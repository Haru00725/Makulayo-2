import { createBrowserClient } from "@supabase/ssr";

// Use this inside client components ("use client"), e.g. AuthModal.tsx, AuthProvider.tsx
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}