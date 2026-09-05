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
            className={`${spaceGrotesk.variable} ${inter.variable} min-h-screen bg-white text-[#14140F]`}
            style={{ fontFamily: "var(--font-body)" }}
        >
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 min-w-0">
                    <div className="max-w-[1040px] mx-auto px-10 py-12">{children}</div>
                </main>
            </div>
        </div>
    );
}