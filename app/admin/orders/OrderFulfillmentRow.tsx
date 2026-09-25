"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isLikelyDelhiNCR } from "@/lib/pincode";
import { Truck, Package, MapPin, AlertTriangle, Loader2 } from "lucide-react";

type Order = {
    id: string;
    total_amount: number;
    created_at: string;
    order_items: { product_name: string; quantity: number }[];
    shipping_addresses: {
        full_name: string;
        city: string;
        state: string;
        pincode: string;
    }[];
};

export function OrderFulfillmentRow({ order }: { order: Order }) {
    const router = useRouter();
    const [loading, setLoading] = useState<"manual" | "shiprocket" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const address = order.shipping_addresses[0];
    const suggestedManual = address ? isLikelyDelhiNCR(address.pincode) : false;

    async function handleFulfill(method: "manual" | "shiprocket") {
        setLoading(method);
        setError(null);

        const res = await fetch(`/api/admin/orders/${order.id}/fulfill`, {
            method: "POST",
            body: JSON.stringify({ method }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error ?? "Something went wrong");
            setLoading(null);
            return;
        }

        router.refresh();
    }

    return (
        <div
            className="rounded-lg px-4 sm:px-5 py-4"
            style={{
                background: "#121212",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                    <p className="text-[13px] sm:text-[14px] font-medium" style={{ color: "#F2EFE9" }}>
                        {address?.full_name}{" "}
                        <span className="font-normal" style={{ color: "#6B675F" }}>
                            #{order.id.slice(0, 8)}
                        </span>
                    </p>
                    <p className="text-[12px] sm:text-[13px] mt-0.5 flex items-center gap-1.5" style={{ color: "#6B675F" }}>
                        <MapPin size={11} />
                        {address?.city}, {address?.state} — {address?.pincode}
                        {suggestedManual && (
                            <span className="flex items-center gap-1" style={{ color: "#D9B978" }}>
                                <AlertTriangle size={10} />
                                Delhi NCR
                            </span>
                        )}
                    </p>
                    <p className="text-[12px] sm:text-[13px] mt-1" style={{ color: "#9A958C" }}>
                        {order.order_items.map((i) => `${i.product_name} × ${i.quantity}`).join(", ")}
                    </p>
                </div>
                <span
                    className="text-[15px] sm:text-[16px] font-bold shrink-0"
                    style={{ fontFamily: "var(--font-display)", color: "#C6A15B" }}
                >
                    ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </span>
            </div>

            {error && (
                <p
                    className="text-[12px] mb-2 flex items-center gap-1.5 px-3 py-2 rounded-md"
                    style={{
                        color: "#B46A5F",
                        background: "rgba(180,106,95,0.1)",
                    }}
                >
                    <AlertTriangle size={12} />
                    {error}
                </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
                <button
                    onClick={() => handleFulfill("manual")}
                    disabled={loading !== null}
                    style={{
                        fontSize: "13px",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "transparent",
                        color: loading === "manual" ? "#D9B978" : "#9A958C",
                        cursor: loading !== null ? "not-allowed" : "pointer",
                        transition: "all 200ms ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        opacity: loading !== null && loading !== "manual" ? 0.4 : 1,
                    }}
                >
                    {loading === "manual" ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Package size={14} />
                    )}
                    {loading === "manual" ? "Marking…" : "Manual delivery"}
                </button>
                <button
                    onClick={() => handleFulfill("shiprocket")}
                    disabled={loading !== null}
                    style={{
                        fontSize: "13px",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: "none",
                        background:
                            loading !== null && loading !== "shiprocket"
                                ? "rgba(198,161,91,0.2)"
                                : "linear-gradient(135deg, #C6A15B, #D9B978)",
                        color: "#0A0A0A",
                        fontWeight: 600,
                        cursor: loading !== null ? "not-allowed" : "pointer",
                        transition: "all 200ms ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        opacity: loading !== null && loading !== "shiprocket" ? 0.4 : 1,
                    }}
                >
                    {loading === "shiprocket" ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Truck size={14} />
                    )}
                    {loading === "shiprocket" ? "Creating order…" : "Ship via Shiprocket"}
                </button>
            </div>
        </div>
    );
}