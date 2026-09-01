import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyPaymentSignature } from "@/lib/razorpay";

// Called from the Razorpay Checkout `handler` callback on the client, right
// after payment. This gives the user instant feedback ("Order confirmed!").
// The webhook route below is still the SOURCE OF TRUTH for marking an order
// paid — this route just verifies + updates UI-facing status quickly.
// Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const isValid = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();
  await admin
    .from("orders")
    .update({
      status: "paid",
      razorpay_payment_id,
      razorpay_signature,
    })
    .eq("id", orderId)
    .eq("razorpay_order_id", razorpay_order_id);

  return NextResponse.json({ success: true });
}