import { NextRequest, NextResponse } from "next/server";
import { trackShipment } from "@/lib/nimbuspost";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ awb: string }> }
) {
    const { awb } = await params;
    const data = await trackShipment(awb);
    return NextResponse.json(data);
}