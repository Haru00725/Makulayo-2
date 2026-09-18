"use client";

import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle2, Box } from "lucide-react";

const MOCK_SHIPMENTS: Record<string, { status: string; items: string[]; estimatedDelivery: string; carrier: string; steps: { name: string; completed: boolean; date: string; current?: boolean }[] }> = {
  "MAK-123456": {
    status: "in-transit",
    items: ["Golden Ember — 50ml"],
    estimatedDelivery: "Aug 12, 2026",
    carrier: "Delhivery",
    steps: [
      { name: "Order Placed", completed: true, date: "Aug 02, 10:00 AM" },
      { name: "Processing", completed: true, date: "Aug 03, 02:30 PM" },
      { name: "In Transit", completed: true, date: "Aug 04, 08:15 AM", current: true },
      { name: "Out for Delivery", completed: false, date: "Pending" },
      { name: "Delivered", completed: false, date: "Pending" },
    ],
  },
};

export default function ShippingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<(typeof MOCK_SHIPMENTS)[string] | null>(null);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    setIsSearching(true);
    setError("");
    setSearchQuery(trackingNumber);

    setTimeout(() => {
      const data = MOCK_SHIPMENTS[trackingNumber.trim().toUpperCase()];
      if (data) {
        setResult(data);
      } else {
        setResult(null);
        setError("We couldn't find a shipment with that tracking number. (Try MAK-123456)");
      }
      setIsSearching(false);
    }, 600);
  };

  const stepIcons = [Package, Box, Truck, Truck, CheckCircle2];

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-5 md:px-8" style={{ paddingTop: "160px", paddingBottom: "var(--section-pad)" }}>
        {/* Shipping & Returns Info */}
        <h1
          className="mb-12"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--display-lg)",
            letterSpacing: "var(--tracking-display-lg)",
          }}
        >
          SHIPPING & RETURNS
        </h1>

        <div className="space-y-10 mb-20">
          <section>
            <h2
              className="mb-4 pb-3"
              style={{
                fontSize: "var(--eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                color: "var(--gold)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              SHIPPING POLICY
            </h2>
            <div style={{ fontSize: "var(--body)", lineHeight: 1.7, color: "var(--text-muted)" }}>
              <p className="mb-3">Complimentary standard shipping on all orders over ₹1,999. Orders are processed and delivered within 2 business days.</p>
              <ul className="space-y-2 pl-4" style={{ listStyleType: "disc" }}>
                <li>Standard shipping (2 business days): ₹99 (free over ₹1,999)</li>
                <li>Express delivery (1 business day): ₹249</li>
              </ul>
            </div>
          </section>

          <section>
            <h2
              className="mb-4 pb-3"
              style={{
                fontSize: "var(--eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                color: "var(--gold)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              2-DAY RETURN POLICY
            </h2>
            <div style={{ fontSize: "var(--body)", lineHeight: 1.7, color: "var(--text-muted)" }}>
              <p className="mb-3">
                Fragrances are a personal product. We maintain a strict 2-day return policy to ensure inventory integrity.
              </p>
              <p className="mb-3">
                To be eligible: the item must be unopened, in original packaging with the cellophane seal intact. Initiate returns within 2 days of delivery.
              </p>
              <p>
                To start a return, contact us at{" "}
                <a href="mailto:makulayo@gmail.com" style={{ color: "var(--gold)" }}>makulayo@gmail.com</a>{" "}
                with your order number.
              </p>
            </div>
          </section>
        </div>

        {/* Track order section */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-16)" }}>
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--display-md)",
              letterSpacing: "var(--tracking-display-md)",
            }}
          >
            TRACK YOUR ORDER
          </h2>
          <p className="mb-8" style={{ fontSize: "var(--body)", color: "var(--text-muted)" }}>
            Enter your tracking number to check your shipment status.
          </p>

          <form onSubmit={handleSearch} className="flex items-center gap-3 mb-12">
            <div className="flex-1 relative">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full bg-transparent outline-none py-3 pr-4"
                style={{
                  borderBottom: "1px solid var(--border-strong)",
                  color: "var(--text)",
                  fontSize: "var(--body)",
                }}
                placeholder="e.g. MAK-123456"
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !trackingNumber.trim()}
              className="py-3 px-6 transition-all disabled:opacity-30"
              style={{
                border: "1px solid var(--gold-dim)",
                color: "var(--gold)",
                fontSize: "var(--eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                background: "transparent",
              }}
            >
              {isSearching ? "..." : "TRACK"}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 mb-8"
                style={{
                  background: "rgba(180, 106, 95, 0.1)",
                  border: "1px solid rgba(180, 106, 95, 0.2)",
                  color: "var(--error)",
                  fontSize: "var(--body)",
                }}
              >
                {error}
              </motion.div>
            )}

            {result && !error && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="p-6 md:p-8"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: "var(--text)", fontSize: "var(--body-lg)" }}>
                      Order {searchQuery.toUpperCase()}
                    </h3>
                    <p style={{ fontSize: "var(--caption)", color: "var(--text-muted)" }}>
                      {result.carrier} · Est. delivery:{" "}
                      <span style={{ color: "var(--gold)" }}>{result.estimatedDelivery}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4">
                  {result.steps.map((step, index) => {
                    const Icon = stepIcons[index];
                    return (
                      <div key={index} className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 md:flex-1">
                        <div
                          className="w-10 h-10 flex items-center justify-center shrink-0"
                          style={{
                            background: step.current
                              ? "var(--gold)"
                              : step.completed
                                ? "var(--gold-glow)"
                                : "var(--surface-alt)",
                            border: step.completed ? "1px solid var(--gold-dim)" : "1px solid var(--border)",
                            color: step.current
                              ? "var(--bg)"
                              : step.completed
                                ? "var(--gold)"
                                : "var(--text-faint)",
                          }}
                        >
                          <Icon size={16} strokeWidth={1.5} />
                        </div>
                        <div className="md:text-center">
                          <p
                            className="font-medium"
                            style={{
                              fontSize: "var(--caption)",
                              color: step.completed || step.current ? "var(--text)" : "var(--text-faint)",
                            }}
                          >
                            {step.name}
                          </p>
                          <p style={{ fontSize: "var(--caption)", color: "var(--text-faint)" }}>
                            {step.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
