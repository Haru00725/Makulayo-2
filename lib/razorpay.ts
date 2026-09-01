import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amountInRupees: number, receipt: string) {
    return razorpay.orders.create({
        amount: Math.round(amountInRupees * 100), // Razorpay wants paise
        currency: "INR",
        receipt,
    });
}

// Verify the signature returned by Razorpay Checkout after payment,
// on the client-side success callback -> your /verify route.
export function verifyPaymentSignature({
    orderId,
    paymentId,
    signature,
}: {
    orderId: string;
    paymentId: string;
    signature: string;
}) {
    const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    return expected === signature;
}

// Verify a webhook payload (Settings -> Webhooks -> Secret in Razorpay dashboard).
// Use this in the /api/webhooks/razorpay route as the source of truth,
// since client-side verify can be skipped by a malicious client.
export function verifyWebhookSignature(rawBody: string, signature: string) {
    const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(rawBody)
        .digest("hex");

    return expected === signature;
}