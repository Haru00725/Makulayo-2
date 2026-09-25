import { createAdminClient } from "@/lib/supabase/server";
import { RevenueChart } from "./RevenueChart";
import {
    IndianRupee,
    ShoppingBag,
    AlertCircle,
    Package,
    TrendingUp,
    Clock,
    ArrowUpRight,
} from "lucide-react";

function formatCurrency(n: number) {
    return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const statIcons = [IndianRupee, ShoppingBag, AlertCircle, Package];
const statColors = ["#C6A15B", "#D9B978", "#B46A5F", "#6E8F6B"];

export default async function AdminHomePage() {
    const admin = createAdminClient();

    const [{ data: orders }, { data: products }] = await Promise.all([
        admin
            .from("orders")
            .select("id, status, total_amount, shiprocket_awb, shiprocket_order_id, created_at, shipping_addresses(full_name, city)")
            .order("created_at", { ascending: false }),
        admin.from("products").select("id", { count: "exact", head: false }).eq("is_active", true),
    ]);

    const allOrders = orders ?? [];
    const paidOrders = allOrders.filter((o) => o.status === "paid" || o.status === "shipped");
    const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const needsFulfillment = allOrders.filter(
        (o) => o.status === "paid" && !o.shiprocket_awb && !o.shiprocket_order_id
    ).length;
    const activeProducts = products?.length ?? 0;

    // Last 14 days revenue
    const days: { label: string; amount: number }[] = [];
    for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().slice(0, 10);
        const label = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        const amount = paidOrders
            .filter((o) => o.created_at.slice(0, 10) === dateStr)
            .reduce((sum, o) => sum + Number(o.total_amount), 0);
        days.push({ label, amount });
    }

    const recentOrders = allOrders.slice(0, 8);

    const stats = [
        { label: "Total Revenue", value: formatCurrency(revenue) },
        { label: "Total Orders", value: String(allOrders.length) },
        { label: "Needs Fulfillment", value: String(needsFulfillment) },
        { label: "Active Products", value: String(activeProducts) },
    ];

    return (
        <div className="pt-2 sm:pt-0">
            {/* Header */}
            <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-3 mb-1">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#6E8F6B", boxShadow: "0 0 6px rgba(110,143,107,0.5)" }}
                    />
                    <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: "#6B675F" }}>
                        Dashboard
                    </span>
                </div>
                <h1
                    className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#F2EFE9" }}
                >
                    Welcome back
                </h1>
                <p className="text-[13px] sm:text-[14px] mt-1" style={{ color: "#6B675F" }}>
                    An overview of orders, revenue, and fulfillment.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {stats.map((stat, i) => {
                    const Icon = statIcons[i];
                    const color = statColors[i];
                    return (
                        <div
                            key={stat.label}
                            className="relative overflow-hidden rounded-lg p-4 sm:p-5"
                            style={{
                                background: "#121212",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            {/* Subtle corner glow */}
                            <div
                                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
                                style={{
                                    background: color,
                                    filter: "blur(20px)",
                                    transform: "translate(30%, -30%)",
                                }}
                            />
                            <div className="relative">
                                <div
                                    className="w-8 h-8 rounded-md flex items-center justify-center mb-3"
                                    style={{
                                        background: `${color}14`,
                                        color: color,
                                    }}
                                >
                                    <Icon size={16} strokeWidth={1.5} />
                                </div>
                                <p className="text-[11px] sm:text-[12px] mb-1.5 tracking-wide uppercase" style={{ color: "#6B675F" }}>
                                    {stat.label}
                                </p>
                                <p
                                    className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold tracking-tight"
                                    style={{ fontFamily: "var(--font-display)", color: "#F2EFE9" }}
                                >
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Revenue Chart */}
            <section className="mb-8 sm:mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} style={{ color: "#C6A15B" }} />
                    <h2
                        className="text-[14px] sm:text-[15px] font-medium"
                        style={{ fontFamily: "var(--font-display)", color: "#F2EFE9" }}
                    >
                        Revenue — Last 14 days
                    </h2>
                </div>
                <div
                    className="rounded-lg p-4 sm:p-6 pt-4 sm:pt-6 pb-2 overflow-x-auto"
                    style={{
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="min-w-[400px]">
                        <RevenueChart data={days} />
                    </div>
                </div>
            </section>

            {/* Recent Orders */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Clock size={16} style={{ color: "#C6A15B" }} />
                        <h2
                            className="text-[14px] sm:text-[15px] font-medium"
                            style={{ fontFamily: "var(--font-display)", color: "#F2EFE9" }}
                        >
                            Recent Orders
                        </h2>
                    </div>
                    <a
                        href="/admin/orders"
                        className="flex items-center gap-1 text-[12px] transition-colors"
                        style={{ color: "#C6A15B" }}
                    >
                        View all
                        <ArrowUpRight size={12} />
                    </a>
                </div>
                <div
                    className="rounded-lg overflow-hidden"
                    style={{
                        background: "#121212",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    {recentOrders.length === 0 && (
                        <p className="px-5 py-10 text-[14px] text-center" style={{ color: "#6B675F" }}>
                            No orders yet.
                        </p>
                    )}
                    {recentOrders.map((order, idx) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 transition-colors"
                            style={{
                                borderBottom: idx < recentOrders.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            }}
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-[13px] sm:text-[14px] font-medium truncate" style={{ color: "#F2EFE9" }}>
                                    {order.shipping_addresses[0]?.full_name ?? "—"}
                                </p>
                                <p className="text-[11px] sm:text-[12px] mt-0.5" style={{ color: "#6B675F" }}>
                                    {order.shipping_addresses[0]?.city ?? "—"} · #{order.id.slice(0, 8)}
                                </p>
                            </div>
                            <div className="text-right ml-3 shrink-0">
                                <p className="text-[13px] sm:text-[14px] font-medium" style={{ color: "#F2EFE9" }}>
                                    {formatCurrency(Number(order.total_amount))}
                                </p>
                                <span
                                    className="inline-block text-[10px] sm:text-[11px] mt-0.5 px-2 py-0.5 rounded-full capitalize"
                                    style={{
                                        background:
                                            order.status === "paid"
                                                ? "rgba(198,161,91,0.12)"
                                                : order.status === "shipped"
                                                    ? "rgba(110,143,107,0.15)"
                                                    : "rgba(255,255,255,0.06)",
                                        color:
                                            order.status === "paid"
                                                ? "#D9B978"
                                                : order.status === "shipped"
                                                    ? "#6E8F6B"
                                                    : "#6B675F",
                                    }}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}