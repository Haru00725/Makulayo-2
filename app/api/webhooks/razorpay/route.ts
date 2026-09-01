import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { createShipment } from "@/lib/nimbuspost";

// Configure this URL in Razorpay Dashboard -> Settings -> Webhooks
// (https://yourdomain.com/api/webhooks/razorpay), subscribe to
// "payment.captured" at minimum. Copy the webhook secret into
// RAZORPAY_WEBHOOK_SECRET.
export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";

    if (!verifyWebhookSignature(rawBody, signature)) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event !== "payment.captured") {
        // Acknowledge other events so Razorpay doesn't retry them.
        return NextResponse.json({ received: true });
    }

    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;

    const admin = createAdminClient();

    const { data: order } = await admin
        .from("orders")
        .select("*, order_items(*), shipping_addresses(*)")
        .eq("razorpay_order_id", razorpayOrderId)
        .single();

    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Idempotency: webhooks can be delivered more than once.
    if (order.status === "shipped" || order.status === "delivered") {
        return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    await admin
        .from("orders")
        .update({
            status: "paid",
            razorpay_payment_id: payment.id,
        })
        .eq("id", order.id);

    const address = order.shipping_addresses[0];
    const totalWeight = order.order_items.reduce(
        (sum: number, i: { weight_grams: number; quantity: number }) =>
            sum + i.weight_grams * i.quantity,
        0
    );

    try {
        const shipment = await createShipment({
            orderId: order.id,
            paymentType: "prepaid",
            consignee: {
                name: address.full_name,
                phone: address.phone,
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
            },
            items: order.order_items.map((i: { product_name: string; quantity: number; price: number }) => ({
                name: i.product_name,
                qty: i.quantity,
                price: i.price,
            })),
            totalAmount: order.total_amount,
            weightGrams: totalWeight,
        });

        await admin
            .from("orders")
            .update({
                status: "shipped",
                nimbuspost_awb: shipment.data?.awb_number,
                nimbuspost_courier: shipment.data?.courier_name,
            })
            .eq("id", order.id);
    } catch (err) {
        // Payment succeeded but shipment creation failed — don't lose the order,
        // just log it. Handle manually from /admin/orders and retry.
        console.error("NimbusPost shipment creation failed for order", order.id, err);
    }

    return NextResponse.json({ received: true });
}