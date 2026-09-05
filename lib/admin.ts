import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Call this at the top of any /admin server component or route handler.
// Relies on the `profiles.is_admin` column created by the schema's
// handle_new_user trigger — set it to true manually for your own account:
//
//   update profiles set is_admin = true where id = '<your-auth-user-id>';
//
export async function requireAdmin() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (!profile?.is_admin) redirect("/");

    return user;
}