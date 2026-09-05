import { createAdminClient } from "@/lib/supabase/server";
import { OrdersDashboard } from "./OrdersDashboard";

export default async function AdminOrdersPage() {
    const admin = createAdminClient();
    const { data: orders } = await admin
        .from("orders")
        .select("*, order_items(*), shipping_addresses(*)")
        .order("created_at", { ascending: false });

    return (
        <div>
            <h1
                className="text-[28px] font-bold tracking-tight mb-1"
                style={{ fontFamily: "var(--font-display)" }}
            >
                Orders
            </h1>
            <p className="text-[14px] text-[#6E6E68] mb-8">
                Assign each paid order to manual delivery or NimbusPost.
            </p>
            <OrdersDashboard orders={orders ?? []} />
        </div>
    );
}