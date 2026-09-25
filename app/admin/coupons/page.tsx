import { createAdminClient } from "@/lib/supabase/server";
import { CouponsAdmin } from "./CouponsAdmin";

export default async function AdminCouponsPage() {
    const admin = createAdminClient();
    const { data: coupons } = await admin
        .from("coupons")
        .select("*")
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
                        Marketing
                    </span>
                </div>
                <h1
                    className="text-[24px] sm:text-[28px] font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#F2EFE9" }}
                >
                    Coupons
                </h1>
                <p className="text-[13px] sm:text-[14px] mt-1" style={{ color: "#6B675F" }}>
                    Create and manage discount codes for your store.
                </p>
            </div>
            <CouponsAdmin initialCoupons={coupons ?? []} />
        </div>
    );
}
