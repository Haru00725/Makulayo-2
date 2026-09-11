import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
    await requireAdmin();
    const admin = createAdminClient();
    const { data: coupons, error } = await admin
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
    await requireAdmin();
    const body = await req.json();
    const admin = createAdminClient();

    const { data: coupon, error } = await admin
        .from("coupons")
        .insert({
            code: body.code.toUpperCase(),
            discount_type: body.discount_type,
            discount_value: body.discount_value,
            max_uses: body.max_uses || null,
            is_active: true,
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ coupon });
}
