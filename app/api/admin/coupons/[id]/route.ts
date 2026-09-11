import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await requireAdmin();
    const admin = createAdminClient();

    // Soft delete by setting is_active = false
    const { error } = await admin
        .from("coupons")
        .update({ is_active: false })
        .eq("id", params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
