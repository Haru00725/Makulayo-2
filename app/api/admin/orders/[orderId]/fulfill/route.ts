import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const { method } = await req.json();

    if (method === "manual") {
      // Update status to 'yet_to_be_delivered' and fulfillment_method to 'manual'
      const { error } = await supabase
        .from("orders")
        .update({
          status: "yet_to_be_delivered",
          fulfillment_method: "manual",
        })
        .eq("id", orderId);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (method === "shiprocket") {
      // Create Shiprocket order logic here
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*),
          shipping_addresses(*)
        `)
        .eq("id", orderId)
        .single();

      if (orderError || !order) throw new Error("Order not found");

      // 1. Authenticate with Shiprocket
      const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: process.env.SHIPROCKET_EMAIL,
          password: process.env.SHIPROCKET_PASSWORD,
        }),
      });

      if (!authRes.ok) {
        throw new Error("Failed to authenticate with Shiprocket");
      }
      const authData = await authRes.json();
      const token = authData.token;

      // 2. Format order data for Shiprocket
      const address = order.shipping_addresses[0];
      const shiprocketPayload = {
        order_id: order.id,
        order_date: new Date(order.created_at).toISOString().split('T')[0],
        pickup_location: "Primary", // Update if needed
        billing_customer_name: address.full_name,
        billing_last_name: "",
        billing_address: address.line1,
        billing_address_2: address.line2 || "",
        billing_city: address.city,
        billing_pincode: address.pincode,
        billing_state: address.state,
        billing_country: "India",
        billing_email: "customer@example.com", // Assuming no email in DB, placeholder
        billing_phone: address.phone,
        shipping_is_billing: true,
        order_items: order.order_items.map((item: any) => ({
          name: item.product_name,
          sku: item.product_id,
          units: item.quantity,
          selling_price: item.price,
        })),
        payment_method: "Prepaid",
        sub_total: order.total_amount,
        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.5,
      };

      // 3. Create Custom Order in Shiprocket
      const createOrderRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shiprocketPayload),
      });

      if (!createOrderRes.ok) {
        const errData = await createOrderRes.text();
        throw new Error(`Shiprocket order creation failed: ${errData}`);
      }

      const createOrderData = await createOrderRes.json();

      // 4. Update Supabase with Shiprocket Order ID and tracking URL if available
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "sent_to_shiprocket",
          fulfillment_method: "shiprocket",
          shiprocket_order_id: createOrderData.order_id.toString(),
          shiprocket_awb: null,
          shiprocket_tracking_url: `https://shiprocket.co/tracking/${createOrderData.order_id}`,
        })
        .eq("id", orderId);

      if (updateError) throw updateError;
      return NextResponse.json({ success: true, shiprocketOrderId: createOrderData.order_id });
    }

    return NextResponse.json({ error: "Invalid fulfillment method" }, { status: 400 });
  } catch (error: any) {
    console.error("Fulfillment Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process fulfillment" },
      { status: 500 }
    );
  }
}
