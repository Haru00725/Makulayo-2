import { createAdminClient } from "@/lib/supabase/server";
import { ProductsAdmin } from "./ProductsAdmin";
import { products as catalogProducts } from "@/lib/products";

export default async function AdminProductsPage() {
    const admin = createAdminClient();

    const [{ data: dbProducts }, { data: catalogOverrides }] = await Promise.all([
        admin
            .from("products")
            .select("*")
            .order("created_at", { ascending: false }),
        admin
            .from("catalog_overrides")
            .select("*"),
    ]);

    return (
        <div className="pt-2 sm:pt-0">
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#C6A15B", boxShadow: "0 0 6px rgba(198,161,91,0.4)" }}
                    />
                    <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: "#6B675F" }}>
                        Inventory
                    </span>
                </div>
                <h1
                    className="text-[24px] sm:text-[28px] font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#F2EFE9" }}
                >
                    Products
                </h1>
                <p className="text-[13px] sm:text-[14px] mt-1" style={{ color: "#6B675F" }}>
                    Edit pricing, descriptions, photos, or add a new fragrance.
                </p>
            </div>
            <ProductsAdmin
                initialProducts={dbProducts ?? []}
                catalogProducts={catalogProducts}
                initialOverrides={catalogOverrides ?? []}
            />
        </div>
    );
}