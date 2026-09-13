import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createRazorpayOrder } from "@/lib/razorpay";

// Body: { items: [{ productId, name, price, quantity, weightGrams }], address: {...} }
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json();
  const { items, address, couponCode, discountAmount } = body;

  const subTotalAmount = items.reduce(
    (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
    0
  );
  
  const finalDiscount = discountAmount ?? 0;
  const totalAmount = Math.max(0, subTotalAmount - finalDiscount);

  // Use the admin client for writes (bypasses RLS; server verified the user above).
  const admin = createAdminClient();

  const { data: order, error } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total_amount: totalAmount,
      coupon_code: couponCode ?? null,
      discount_amount: finalDiscount,
    })
    .select()
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  await admin.from("order_items").insert(
    items.map((i: { productId: string; name: string; price: number; quantity: number; weightGrams?: number }) => ({
      order_id: order.id,
      product_id: i.productId,
      product_name: i.name,
      price: i.price,
      quantity: i.quantity,
      weight_grams: i.weightGrams ?? 200,
    }))
  );

  await admin.from("shipping_addresses").insert({
    order_id: order.id,
    full_name: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2 ?? null,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
  });

  // If the total is 0 (e.g., 100% discount), bypass Razorpay completely
  if (totalAmount === 0) {
    await admin.from("orders").update({ status: "paid" }).eq("id", order.id);

    if (couponCode) {
      const { data: cData } = await admin.from("coupons").select("current_uses").eq("code", couponCode).single();
      if (cData) {
          await admin.from("coupons").update({ current_uses: cData.current_uses + 1 }).eq("code", couponCode);
      }
    }
    
    return NextResponse.json({
      orderId: order.id,
      bypassed: true,
    });
  }

  const razorpayOrder = await createRazorpayOrder(totalAmount, order.id);

  await admin
    .from("orders")
    .update({ razorpay_order_id: razorpayOrder.id })
    .eq("id", order.id);

  if (couponCode) {
    // We will just do a direct update since we have the admin client
    const { data: cData } = await admin.from("coupons").select("current_uses").eq("code", couponCode).single();
    if (cData) {
        await admin.from("coupons").update({ current_uses: cData.current_uses + 1 }).eq("code", couponCode);
    }
  }

  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}