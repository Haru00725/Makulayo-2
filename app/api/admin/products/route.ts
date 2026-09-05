import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
    await requireAdmin();
    const admin = createAdminClient();
    const { data: products, error } = await admin
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ products });
}

// Body: { slug, name, description, price, weightGrams, imageUrl, stock, isActive }
export async function POST(req: NextRequest) {
    await requireAdmin();
    const body = await req.json();
    const admin = createAdminClient();

    const { data: product, error } = await admin
        .from("products")
        .insert({
            slug: body.slug,
            name: body.name,
            description: body.description,
            price: body.price,
            weight_grams: body.weightGrams ?? 200,
            image_url: body.imageUrl,
            stock: body.stock ?? 0,
            is_active: body.isActive ?? true,
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ product });
}