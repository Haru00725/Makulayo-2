import { Space_Grotesk, Inter } from "next/font/google";
import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "./AdminSidebar";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-display",
    weight: ["500", "700"],
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-body",
    weight: ["400", "500", "600"],
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin();

    return (
        <div
            className={`${spaceGrotesk.variable} ${inter.variable}`}
            style={{
                fontFamily: "var(--font-body)",
                background: "#0A0A0A",
                color: "#F2EFE9",
                minHeight: "100vh",
            }}
        >
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="flex-1 min-w-0 admin-main-content">
                    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}