import { createAdminClient } from "@/lib/supabase/server";
import { RevenueChart } from "./RevenueChart";

function formatCurrency(n: number) {
    return `₹${n.toLocaleString("en-IN")}`;
}

export default async function AdminHomePage() {
    const admin = createAdminClient();

    const [{ data: orders }, { data: products }] = await Promise.all([
        admin
            .from("orders")
            .select("id, status, total_amount, fulfillment_method, created_at, shipping_addresses(full_name, city)")
            .order("created_at", { ascending: false }),
        admin.from("products").select("id", { count: "exact", head: false }).eq("is_active", true),
    ]);

    const allOrders = orders ?? [];
    const paidOrders = allOrders.filter((o) => o.status === "paid" || o.status === "shipped");
    const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const needsFulfillment = allOrders.filter(
        (o) => o.status === "paid" && !o.fulfillment_method
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

    const recentOrders = allOrders.slice(0, 6);

    return (
        <div>
            <h1
                className="text-[28px] font-bold tracking-tight mb-1"
                style={{ fontFamily: "var(--font-display)" }}
            >
                Home
            </h1>
            <p className="text-[14px] text-[#6E6E68] mb-10">
                An overview of orders, revenue, and fulfillment.
            </p>

            <div className="grid grid-cols-4 border border-[#E4E4E1] rounded-[4px] mb-10">
                {[
                    { label: "Revenue", value: formatCurrency(revenue) },
                    { label: "Orders", value: String(allOrders.length) },
                    { label: "Needs fulfillment", value: String(needsFulfillment) },
                    { label: "Active products", value: String(activeProducts) },
                ].map((stat, i) => (
                    <div
                        key={stat.label}
                        className={`px-6 py-6 ${i > 0 ? "border-l border-[#E4E4E1]" : ""}`}
                    >
                        <p className="text-[13px] text-[#6E6E68] mb-2">{stat.label}</p>
                        <p
                            className="text-[32px] font-bold tracking-tight"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <section className="mb-10">
                <h2
                    className="text-[15px] font-medium mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    Revenue, last 14 days
                </h2>
                <div className="border border-[#E4E4E1] rounded-[4px] px-6 pt-6 pb-2">
                    <RevenueChart data={days} />
                </div>
            </section>

            <section>
                <h2
                    className="text-[15px] font-medium mb-4"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    Recent orders
                </h2>
                <div className="border border-[#E4E4E1] rounded-[4px] divide-y divide-[#E4E4E1]">
                    {recentOrders.length === 0 && (
                        <p className="px-6 py-8 text-[14px] text-[#6E6E68]">No orders yet.</p>
                    )}
                    {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="text-[14px] font-medium">
                                    {order.shipping_addresses[0]?.full_name ?? "—"}
                                </p>
                                <p className="text-[12px] text-[#6E6E68]">
                                    {order.shipping_addresses[0]?.city ?? "—"} · #{order.id.slice(0, 8)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[14px] font-medium">{formatCurrency(Number(order.total_amount))}</p>
                                <p className="text-[12px] text-[#6E6E68] capitalize">{order.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}