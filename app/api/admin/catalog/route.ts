import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

// GET — fetch all catalog overrides
export async function GET() {
    await requireAdmin();
    const admin = createAdminClient();
    const { data, error } = await admin
        .from("catalog_overrides")
        .select("*");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ overrides: data });
}
