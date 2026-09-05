"use client";

import { useMemo, useState } from "react";
import { OrderFulfillmentRow } from "./OrderFulfillmentRow";

type Order = {
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    fulfillment_method: "manual" | "nimbuspost" | null;
    nimbuspost_awb: string | null;
    order_items: { product_name: string; quantity: number }[];
    shipping_addresses: {
        full_name: string;
        city: string;
        state: string;
        pincode: string;
    }[];
};

type FilterTab = "needs-action" | "manual" | "nimbuspost" | "all";

function StatusPill({ order }: { order: Order }) {
    if (order.fulfillment_method === "manual") {
        return (
            <span className="text-[12px] px-2 py-0.5 rounded-[3px] bg-[#EEF2E9] text-[#1E7F4E]">
                Manual
            </span>
        );
    }
    if (order.fulfillment_method === "nimbuspost") {
        return (
            <span className="text-[12px] px-2 py-0.5 rounded-[3px] bg-[#EAEBF6] text-[#2F3A8F]">
                NimbusPost
            </span>
        );
    }
    return (
        <span className="text-[12px] px-2 py-0.5 rounded-[3px] bg-[#FBF2E3] text-[#8A6414]">
            Needs fulfillment
        </span>
    );
}

export function OrdersDashboard({ orders }: { orders: Order[] }) {
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState<FilterTab>("needs-action");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return orders.filter((order) => {
            const address = order.shipping_addresses[0];

            const matchesTab =
                tab === "all"
                    ? true
                    : tab === "needs-action"
                        ? order.status === "paid" && !order.fulfillment_method
                        : order.fulfillment_method === tab;

            if (!matchesTab) return false;
            if (!q) return true;

            const haystack = [
                order.id,
                address?.full_name,
                address?.city,
                address?.state,
                address?.pincode,
                order.nimbuspost_awb,
                ...order.order_items.map((i) => i.product_name),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(q);
        });
    }, [orders, query, tab]);

    const tabs: { key: FilterTab; label: string }[] = [
        { key: "needs-action", label: "Needs fulfillment" },
        { key: "manual", label: "Manual" },
        { key: "nimbuspost", label: "NimbusPost" },
        { key: "all", label: "All" },
    ];

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, city, pincode, order ID, AWB, or product"
                    className="flex-1 border border-[#E4E4E1] rounded-[4px] px-3 py-2 text-[14px] placeholder:text-[#9C9C95] focus:outline-none focus:border-[#2F3A8F]"
                />
                <div className="flex gap-1">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`text-[13px] px-3 py-2 rounded-[4px] border transition-colors ${tab === t.key
                                    ? "bg-[#2F3A8F] text-white border-[#2F3A8F]"
                                    : "border-[#E4E4E1] text-[#3A3A35] hover:bg-[#FAFAF9]"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 && (
                <div className="border border-[#E4E4E1] rounded-[4px] px-6 py-10 text-center">
                    <p className="text-[14px] text-[#6E6E68]">No orders match this view.</p>
                </div>
            )}

            <div className="space-y-3">
                {filtered.map((order) =>
                    order.status === "paid" && !order.fulfillment_method ? (
                        <OrderFulfillmentRow key={order.id} order={order} />
                    ) : (
                        <div
                            key={order.id}
                            className="flex items-center justify-between border border-[#E4E4E1] rounded-[4px] px-5 py-4"
                        >
                            <div>
                                <p className="text-[14px] font-medium">
                                    {order.shipping_addresses[0]?.full_name}
                                </p>
                                <p className="text-[12px] text-[#6E6E68]">#{order.id.slice(0, 8)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {order.nimbuspost_awb && (
                                    <span className="text-[12px] text-[#6E6E68]">
                                        AWB {order.nimbuspost_awb}
                                    </span>
                                )}
                                <StatusPill order={order} />
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}