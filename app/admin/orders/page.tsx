import { createAdminClient } from "@/lib/supabase/server";
import { OrdersDashboard } from "./OrdersDashboard";

export default async function AdminOrdersPage() {
    const admin = createAdminClient();
    const { data: orders } = await admin
        .from("orders")
        .select("*, order_items(*), shipping_addresses(*)")
        .order("created_at", { ascending: false });

    return (
        <div className="pt-2 sm:pt-0">
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#D9B978", boxShadow: "0 0 6px rgba(217,185,120,0.4)" }}
                    />
                    <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: "#6B675F" }}>
                        Fulfillment
                    </span>
                </div>
                <h1
                    className="text-[24px] sm:text-[28px] font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#F2EFE9" }}
                >
                    Orders
                </h1>
                <p className="text-[13px] sm:text-[14px] mt-1" style={{ color: "#6B675F" }}>
                    Assign each paid order to manual delivery or NimbusPost.
                </p>
            </div>
            <OrdersDashboard orders={orders ?? []} />
        </div>
    );
}