"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isLikelyDelhiNCR } from "@/lib/pincode";

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
    const [loading, setLoading] = useState<"manual" | "nimbuspost" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const address = order.shipping_addresses[0];
    const suggestedManual = address ? isLikelyDelhiNCR(address.pincode) : false;

    async function handleFulfill(method: "manual" | "nimbuspost") {
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
        <div className="border border-[#E4E4E1] rounded-[4px] px-5 py-4">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-[14px] font-medium">
                        {address?.full_name}{" "}
                        <span className="text-[#9C9C95] font-normal">#{order.id.slice(0, 8)}</span>
                    </p>
                    <p className="text-[13px] text-[#6E6E68] mt-0.5">
                        {address?.city}, {address?.state} — {address?.pincode}
                        {suggestedManual && <span className="text-[#8A6414]"> · looks like Delhi NCR</span>}
                    </p>
                    <p className="text-[13px] text-[#6E6E68] mt-1">
                        {order.order_items.map((i) => `${i.product_name} × ${i.quantity}`).join(", ")}
                    </p>
                </div>
                <span
                    className="text-[16px] font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </span>
            </div>

            {error && <p className="text-[12px] text-[#B3261E] mb-2">{error}</p>}

            <div className="flex gap-2">
                <button
                    onClick={() => handleFulfill("manual")}
                    disabled={loading !== null}
                    className="text-[13px] px-3 py-1.5 rounded-[4px] border border-[#E4E4E1] hover:bg-[#FAFAF9] disabled:opacity-50 transition-colors"
                >
                    {loading === "manual" ? "Marking as manual…" : "Mark as manual delivery"}
                </button>
                <button
                    onClick={() => handleFulfill("nimbuspost")}
                    disabled={loading !== null}
                    className="text-[13px] px-3 py-1.5 rounded-[4px] bg-[#2F3A8F] text-white hover:bg-[#262F73] disabled:opacity-50 transition-colors"
                >
                    {loading === "nimbuspost" ? "Booking shipment…" : "Ship via NimbusPost"}
                </button>
            </div>
        </div>
    );
}