"use client";

import { useMemo, useState } from "react";
import { OrderFulfillmentRow } from "./OrderFulfillmentRow";

type Order = {
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    fulfillment_method: "manual" | "shiprocket" | null;
    shiprocket_order_id: string | null;
    shiprocket_awb: string | null;
    shiprocket_tracking_url: string | null;
    order_items: { product_name: string; quantity: number }[];
    shipping_addresses: {
        full_name: string;
        city: string;
        state: string;
        pincode: string;
    }[];
};

type FilterTab = "needs-action" | "manual" | "shiprocket" | "all";

function StatusPill({ order }: { order: Order }) {
    if (order.status === "yet_to_be_delivered" || (order.status === "shipped" && !order.shiprocket_awb && !order.shiprocket_order_id)) {
        return (
            <span className="text-[12px] px-2 py-0.5 rounded-[3px] bg-[#EEF2E9] text-[#1E7F4E]">
                Manual
            </span>
        );
    }
    if (order.status === "sent_to_shiprocket" || !!order.shiprocket_order_id || !!order.shiprocket_awb) {
        return (
            <span className="text-[12px] px-2 py-0.5 rounded-[3px] bg-[#EAEBF6] text-[#2F3A8F]">
                Shiprocket
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

            const isShiprocket = order.status === "sent_to_shiprocket" || !!order.shiprocket_order_id || !!order.shiprocket_awb;
            const isManual = order.status === "yet_to_be_delivered" || (order.status === "shipped" && !isShiprocket);
            const needsAction = order.status === "paid" && !isShiprocket && !isManual;

            const matchesTab =
                tab === "all"
                    ? true
                    : tab === "needs-action"
                        ? needsAction
                        : tab === "shiprocket"
                            ? isShiprocket
                            : tab === "manual"
                                ? isManual
                                : false;

            if (!matchesTab) return false;
            if (!q) return true;

            const haystack = [
                order.id,
                address?.full_name,
                address?.city,
                address?.state,
                address?.pincode,
                order.shiprocket_awb,
                order.shiprocket_order_id,
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
        { key: "shiprocket", label: "Shiprocket" },
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
                    order.status === "paid" ? (
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
                                {order.shiprocket_awb && (
                                    <span className="text-[12px] text-[#6E6E68]">
                                        AWB {order.shiprocket_awb}
                                    </span>
                                )}
                                {order.shiprocket_tracking_url && (
                                    <a href={order.shiprocket_tracking_url} target="_blank" rel="noreferrer" className="text-[12px] text-brand-gold underline hover:no-underline">
                                        Track
                                    </a>
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