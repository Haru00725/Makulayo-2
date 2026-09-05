import { createAdminClient } from "@/lib/supabase/server";
import { ProductsAdmin } from "./ProductsAdmin";

export default async function AdminProductsPage() {
    const admin = createAdminClient();
    const { data: products } = await admin
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <h1
                className="text-[28px] font-bold tracking-tight mb-1"
                style={{ fontFamily: "var(--font-display)" }}
            >
                Products
            </h1>
            <p className="text-[14px] text-[#6E6E68] mb-8">
                Edit pricing, descriptions, and photos, or add a new fragrance.
            </p>
            <ProductsAdmin initialProducts={products ?? []} />
        </div>
    );
}