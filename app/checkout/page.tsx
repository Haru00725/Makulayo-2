"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart, itemPrice, couponCode, discountAmount, setCoupon } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ 
    fullName: "", 
    phone: "", 
    line1: "", 
    line2: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsValidating(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const coupon = data.coupon;
      const subTotal = items.reduce((total, item) => total + (item.quantity * itemPrice), 0);
      let calculatedDiscount = 0;

      if (coupon.discount_type === "percentage") {
        calculatedDiscount = (subTotal * coupon.discount_value) / 100;
      } else {
        calculatedDiscount = coupon.discount_value;
      }

      setCoupon(coupon.code, calculatedDiscount);
    } catch (err: any) {
      setCouponError(err.message || "Invalid coupon code");
      setCoupon(null, 0);
    } finally {
      setIsValidating(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const createOrderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: items.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            price: itemPrice,
            quantity: item.quantity,
          })),
          address: form,
          couponCode,
          discountAmount
        }), 
      });
      const order = await createOrderRes.json();

      if (!createOrderRes.ok) throw new Error(order.error || "Failed to create order");

      if (order.bypassed) {
        // Success - Mock DB update for local usage if needed
        const newOrder = {
          id: order.orderId,
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
        setIsProcessing(false);
        return;
      }

      const options = {
        key: order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MAKULAYO",
        description: "Exquisite Fragrances",
        order_id: order.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyResult = await verifyRes.json();

            if (!verifyRes.ok) throw new Error(verifyResult.error || "Payment verification failed");

            // Success - Mock DB update for local usage if needed
            const newOrder = {
              id: order.orderId,
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
          name: form.fullName,
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
  
  useEffect(() => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  }, [user]);

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
    <main className="bg-brand-void min-h-screen text-brand-ivory pt-32 px-4 md:px-8 pb-24">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Navbar />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h1 className="text-3xl md:text-4xl font-serif font-light mb-8">Checkout</h1>
          <form id="checkout-form" onSubmit={handlePayment} className="space-y-8">
            {/* Contact Details */}
            <div className="space-y-4">
                <h2 className="text-xl font-serif text-brand-gold border-b border-white/10 pb-2">Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-ivory-muted mb-2">Full Name</label>
                        <input required type="text" placeholder="John Doe" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-ivory-muted mb-2">Phone Number</label>
                        <input required type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold" />
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
                <h2 className="text-xl font-serif text-brand-gold border-b border-white/10 pb-2">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-ivory-muted mb-2">Address Line 1</label>
                        <input required type="text" placeholder="Flat / House No. / Building" value={form.line1} onChange={e => setForm({...form, line1: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-ivory-muted mb-2">Address Line 2 (Optional)</label>
                        <input type="text" placeholder="Street / Area / Locality" value={form.line2} onChange={e => setForm({...form, line2: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-ivory-muted mb-2">Pincode</label>
                        <input required type="text" placeholder="110001" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-ivory-muted mb-2">City</label>
                        <input required type="text" placeholder="New Delhi" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-ivory-muted mb-2">State</label>
                        <input required type="text" placeholder="Delhi" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold" />
                    </div>
                </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="crystal-glass p-8 rounded-3xl h-fit">
            <h2 className="text-2xl font-serif mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-brand-ivory-muted text-sm">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>₹{(itemPrice * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="border-t border-white/10 pt-6 mb-6">
                <label className="block text-sm font-medium text-brand-ivory-muted mb-2">Discount Code</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Enter coupon code" 
                        value={couponInput} 
                        onChange={e => setCouponInput(e.target.value.toUpperCase())} 
                        disabled={!!couponCode}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-brand-ivory focus:outline-none focus:border-brand-gold disabled:opacity-50" 
                    />
                    {couponCode ? (
                        <button 
                            type="button"
                            onClick={() => {
                                setCouponInput("");
                                setCoupon(null, 0);
                            }}
                            className="px-4 py-3 rounded-xl bg-white/10 text-brand-ivory hover:bg-white/20 transition-all font-medium"
                        >
                            Remove
                        </button>
                    ) : (
                        <button 
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={isValidating || !couponInput.trim()}
                            className="px-6 py-3 rounded-xl bg-brand-gold text-black font-medium hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            {isValidating ? "..." : "Apply"}
                        </button>
                    )}
                </div>
                {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                {couponCode && <p className="text-green-400 text-xs mt-2">Coupon '{couponCode}' applied successfully!</p>}
            </div>

            <div className="border-t border-white/10 pt-6 space-y-2 mb-8">
              <div className="flex justify-between text-sm text-brand-ivory-muted">
                <span>Subtotal</span>
                <span>₹{(items.reduce((total, item) => total + (item.quantity * itemPrice), 0)).toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                    <span>Discount ({couponCode})</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-brand-ivory-muted">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 mt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-brand-gold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isProcessing || items.length === 0}
              className="w-full crystal-glass-highlight crystal-glass py-4 rounded-xl text-brand-gold font-bold tracking-wide hover:brightness-125 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? "Processing..." : `Pay ₹${cartTotal.toLocaleString('en-IN')}`}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
