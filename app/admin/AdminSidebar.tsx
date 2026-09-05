"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/admin", label: "Home" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/products", label: "Products" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[232px] shrink-0 border-r border-[#E4E4E1] bg-[#FAFAF9] min-h-screen">
            <div className="px-6 py-8">
                <p
                    className="text-[15px] font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    MAKULAYO
                </p>
                <p className="text-[12px] text-[#6E6E68] mt-0.5">Admin</p>
            </div>

            <nav className="px-3">
                {links.map((link) => {
                    const active =
                        link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block px-3 py-2 rounded-[4px] text-[14px] mb-1 transition-colors ${active
                                    ? "bg-[#2F3A8F] text-white font-medium"
                                    : "text-[#3A3A35] hover:bg-[#F0F0EE]"
                                }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}