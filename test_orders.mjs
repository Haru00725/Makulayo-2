import { createClient } from "@supabase/supabase-js";

const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

async function run() {
    const { data, error } = await admin
        .from("orders")
        .select("*, order_items(*), shipping_addresses(*)")
        .order("created_at", { ascending: false });
        
    console.log("Error:", error);
    console.log("Data length:", data?.length);
}

run();
