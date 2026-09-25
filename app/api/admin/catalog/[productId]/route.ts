import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

// PATCH — upsert overrides for a specific catalog product
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    await requireAdmin();
    const { productId } = await params;
    const body = await req.json();
    const admin = createAdminClient();

    const row: Record<string, unknown> = { id: productId };

    if (body.name !== undefined) row.name = body.name;
    if (body.tagline !== undefined) row.tagline = body.tagline;
    if (body.description !== undefined) row.description = body.description;
    if (body.family !== undefined) row.family = body.family;
    if (body.notesTop !== undefined) row.notes_top = body.notesTop;
    if (body.notesHeart !== undefined) row.notes_heart = body.notesHeart;
    if (body.notesBase !== undefined) row.notes_base = body.notesBase;
    if (body.imageUrl !== undefined) row.image_url = body.imageUrl;
    if (body.size !== undefined) row.size = body.size;
    if (body.type !== undefined) row.type = body.type;
    if (body.gender !== undefined) row.gender = body.gender;
    if (body.bestWorn !== undefined) row.best_worn = body.bestWorn;
    if (body.whyLoveIt !== undefined) row.why_love_it = body.whyLoveIt;
    if (body.suitableFor !== undefined) row.suitable_for = body.suitableFor;
    if (body.price !== undefined) row.price = body.price;
    if (body.stock !== undefined) row.stock = body.stock;
    if (body.isActive !== undefined) row.is_active = body.isActive;

    row.updated_at = new Date().toISOString();

    const { data, error } = await admin
        .from("catalog_overrides")
        .upsert(row, { onConflict: "id" })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ override: data });
}

// GET — fetch a single override
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    await requireAdmin();
    const { productId } = await params;
    const admin = createAdminClient();

    const { data, error } = await admin
        .from("catalog_overrides")
        .select("*")
        .eq("id", productId)
        .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ override: data });
}
