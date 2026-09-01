"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart, isFirstOrder, itemPrice } = useCart();
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const createOrderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal * 100 }), // Amount in paise
      });
      const order = await createOrderRes.json();

      if (!createOrderRes.ok) throw new Error(order.error || "Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MAKULAYO",
        description: "Exquisite Fragrances",
        order_id: order.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyResult = await verifyRes.json();

            if (!verifyRes.ok) throw new Error(verifyResult.error || "Payment verification failed");

            // Success - Mock DB update
            const newOrder = {
              id: order.order_id,
              date: new Date().toISOString(),
              items: [...items],
              total: cartTotal,
              status: "Processing",
              shippingDetails: form,
            };

            const existingOrders = JSON.parse(localStorage.getItem("makulayo_orders") || "[]");
            localStorage.setItem("makulayo_orders", JSON.stringify([newOrder, ...existingOrders]));

            clearCart();
            setSuccess(true);
          } catch (err) {
            console.error(err);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: form.name,
          contact: form.phone,
        },
        theme: {
          color: "#D4AF37", // brand-gold
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error(response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Failed to initiate checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!user) {
    return (
      <main className="bg-brand-void min-h-screen text-brand-ivory pt-32 px-8 flex items-center justify-center">
        <Navbar />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <div className="crystal-glass p-10 rounded-3xl max-w-md text-center">
          <h2 className="text-2xl font-serif font-light mb-4">Sign in to Continue</h2>
          <p className="text-brand-ivory-muted mb-8 text-sm">You need to be signed in to complete your purchase.</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-4 rounded-xl crystal-glass-highlight crystal-glass text-brand-gold font-semibold tracking-wide hover:brightness-125 transition-all"
          >
            Sign In / Create Account
          </button>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="bg-brand-void min-h-screen text-brand-ivory pt-32 px-8 flex flex-col items-center justify-center text-center">
        <Navbar />
        <div className="crystal-glass p-12 rounded-3xl max-w-xl">
          <div className="w-20 h-20 bg-brand-gold text-black rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h1 className="text-4xl font-bold mb-4">Payment Successful</h1>
          <p className="text-brand-ivory-muted mb-8 text-lg">
            Your exquisite selection is being prepared for dispatch.
          </p>
          <Link 
            href="/account"
            className="crystal-glass-highlight crystal-glass px-8 py-4 rounded-xl text-brand-gold font-bold tracking-wide hover:brightness-125 transition-all"
          >
            View Your Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-brand-void min-h-screen text-brand-ivory pt-32 px-8 pb-24">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Navbar />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl font-serif font-light mb-8">Checkout</h1>
          <form id="checkout-form" onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-ivory-muted mb-2">Full Name</label>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-ivory-muted mb-2">Phone Number</label>
              <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-ivory-muted mb-2">Shipping Address</label>
              <textarea required rows={4} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold resize-none" />
            </div>
          </form>
        </div>

        <div className="crystal-glass p-8 rounded-3xl h-fit">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-8">
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between text-brand-ivory-muted">
                <span>{item.quantity}x {item.product.name}</span>
                <span>₹{(itemPrice * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 mb-8 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-brand-gold">₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>

          <button 
            type="submit"
            form="checkout-form"
            disabled={isProcessing || items.length === 0}
            className="w-full crystal-glass-highlight crystal-glass py-4 rounded-xl text-brand-gold font-bold tracking-wide hover:brightness-125 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? "Processing..." : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </main>
  );
}
