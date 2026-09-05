import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

// Body: any subset of { name, description, price, weightGrams, imageUrl, stock, isActive }
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    await requireAdmin();
    const { productId } = await params;
    const body = await req.json();
    const admin = createAdminClient();

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.price !== undefined) updates.price = body.price;
    if (body.weightGrams !== undefined) updates.weight_grams = body.weightGrams;
    if (body.imageUrl !== undefined) updates.image_url = body.imageUrl;
    if (body.stock !== undefined) updates.stock = body.stock;
    if (body.isActive !== undefined) updates.is_active = body.isActive;

    const { data: product, error } = await admin
        .from("products")
        .update(updates)
        .eq("id", productId)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ product });
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    await requireAdmin();
    const { productId } = await params;
    const admin = createAdminClient();

    // Soft delete by default — keeps history/order references intact.
    // Swap for a real .delete() call if you want it gone entirely.
    const { error } = await admin
        .from("products")
        .update({ is_active: false })
        .eq("id", productId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}