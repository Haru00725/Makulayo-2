import { createAdminClient } from "@/lib/supabase/server";
import { CouponsAdmin } from "./CouponsAdmin";

export default async function AdminCouponsPage() {
    const admin = createAdminClient();
    const { data: coupons } = await admin
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <h1
                className="text-[28px] font-bold tracking-tight mb-1"
                style={{ fontFamily: "var(--font-display)" }}
            >
                Coupons
            </h1>
            <p className="text-[14px] text-[#6E6E68] mb-8">
                Create and manage discount codes for your store.
            </p>
            <CouponsAdmin initialCoupons={coupons ?? []} />
        </div>
    );
}
