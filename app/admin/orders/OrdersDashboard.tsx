"use client";

import { useMemo, useState } from "react";
import { OrderFulfillmentRow } from "./OrderFulfillmentRow";
import { Search, Filter } from "lucide-react";

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

const pillStyles: Record<string, { bg: string; color: string }> = {
    manual: { bg: "rgba(110,143,107,0.15)", color: "#6E8F6B" },
    shiprocket: { bg: "rgba(198,161,91,0.12)", color: "#C6A15B" },
    needs: { bg: "rgba(180,106,95,0.15)", color: "#B46A5F" },
};

function StatusPill({ order }: { order: Order }) {
    if (
        order.status === "yet_to_be_delivered" ||
        (order.status === "shipped" && !order.shiprocket_awb && !order.shiprocket_order_id)
    ) {
        return (
            <span
                className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium"
                style={pillStyles.manual}
            >
                Manual
            </span>
        );
    }
    if (order.status === "sent_to_shiprocket" || !!order.shiprocket_order_id || !!order.shiprocket_awb) {
        return (
            <span
                className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium"
                style={pillStyles.shiprocket}
            >
                Shiprocket
            </span>
        );
    }
    return (
        <span
            className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={pillStyles.needs}
        >
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

            const isShiprocket =
                order.status === "sent_to_shiprocket" || !!order.shiprocket_order_id || !!order.shiprocket_awb;
            const isManual =
                order.status === "yet_to_be_delivered" || (order.status === "shipped" && !isShiprocket);
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

    const tabs: { key: FilterTab; label: string; count: number }[] = [
        {
            key: "needs-action",
            label: "Needs Action",
            count: orders.filter(
                (o) =>
                    o.status === "paid" &&
                    !o.shiprocket_order_id &&
                    !o.shiprocket_awb
            ).length,
        },
        {
            key: "manual",
            label: "Manual",
            count: orders.filter(
                (o) =>
                    o.status === "yet_to_be_delivered" ||
                    (o.status === "shipped" &&
                        !o.shiprocket_awb &&
                        !o.shiprocket_order_id)
            ).length,
        },
        {
            key: "shiprocket",
            label: "Shiprocket",
            count: orders.filter(
                (o) => o.status === "sent_to_shiprocket" || !!o.shiprocket_order_id || !!o.shiprocket_awb
            ).length,

        },
        { key: "all", label: "All", count: orders.length },
    ];

    return (
        <div>
            {/* Search + Tabs */}
            <div className="flex flex-col gap-3 mb-6 sm:mb-8">
                {/* Search */}
                <div className="relative">
                    <Search
                        size={16}
                        style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#6B675F",
                        }}
                    />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, city, pincode, AWB, or product"
                        style={{
                            width: "100%",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px",
                            padding: "10px 12px 10px 36px",
                            fontSize: "14px",
                            background: "rgba(255,255,255,0.03)",
                            color: "#F2EFE9",
                            outline: "none",
                            transition: "border-color 200ms ease",
                        }}
                    />
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                    <Filter size={14} style={{ color: "#6B675F", flexShrink: 0 }} />
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            style={{
                                fontSize: "12px",
                                padding: "7px 12px",
                                borderRadius: "6px",
                                border:
                                    tab === t.key
                                        ? "1px solid rgba(198,161,91,0.3)"
                                        : "1px solid rgba(255,255,255,0.06)",
                                background:
                                    tab === t.key
                                        ? "rgba(198,161,91,0.1)"
                                        : "transparent",
                                color: tab === t.key ? "#C6A15B" : "#9A958C",
                                cursor: "pointer",
                                transition: "all 200ms ease",
                                whiteSpace: "nowrap",
                                fontWeight: tab === t.key ? 500 : 400,
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                flexShrink: 0,
                            }}
                        >
                            {t.label}
                            <span
                                style={{
                                    fontSize: "10px",
                                    padding: "1px 5px",
                                    borderRadius: "999px",
                                    background:
                                        tab === t.key
                                            ? "rgba(198,161,91,0.15)"
                                            : "rgba(255,255,255,0.04)",
                                    color: tab === t.key ? "#D9B978" : "#6B675F",
                                }}
                            >
                                {t.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div
                    className="rounded-lg px-5 py-12 text-center"
                    style={{
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <p className="text-[14px]" style={{ color: "#6B675F" }}>
                        No orders match this view.
                    </p>
                </div>
            )}

            {/* Orders list */}
            <div className="space-y-3">
                {filtered.map((order) =>
                    order.status === "paid" ? (
                        <OrderFulfillmentRow key={order.id} order={order} />
                    ) : (
                        <div
                            key={order.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg px-4 sm:px-5 py-3.5 sm:py-4 gap-2 sm:gap-0"
                            style={{
                                background: "#121212",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <div>
                                <p className="text-[13px] sm:text-[14px] font-medium" style={{ color: "#F2EFE9" }}>
                                    {order.shipping_addresses[0]?.full_name}
                                </p>
                                <p className="text-[11px] sm:text-[12px]" style={{ color: "#6B675F" }}>
                                    #{order.id.slice(0, 8)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                {order.shiprocket_awb && (
                                    <span className="text-[11px] sm:text-[12px]" style={{ color: "#6B675F" }}>
                                        AWB {order.shiprocket_awb}
                                    </span>
                                )}
                                {order.shiprocket_tracking_url && (
                                    <a
                                        href={order.shiprocket_tracking_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] sm:text-[12px] underline"
                                        style={{ color: "#C6A15B" }}
                                    >
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