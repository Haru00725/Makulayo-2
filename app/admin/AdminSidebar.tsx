"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Home,
    ShoppingBag,
    Package,
    Tag,
    Menu,
    X,
    ExternalLink,
} from "lucide-react";

const links = [
    { href: "/admin", label: "Home", icon: Home },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/coupons", label: "Coupons", icon: Tag },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="px-5 pt-7 pb-6 flex items-center justify-between">
                <div>
                    <p
                        className="text-[16px] font-bold tracking-[0.15em]"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "#C6A15B",
                        }}
                    >
                        MAKULAYO
                    </p>
                    <p
                        className="text-[11px] mt-0.5 tracking-[0.3em] uppercase"
                        style={{ color: "#6B675F" }}
                    >
                        Admin
                    </p>
                </div>
                {/* Close button for mobile */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="lg:hidden p-2 rounded-md"
                    style={{ color: "#9A958C" }}
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="px-3 flex-1">
                <p
                    className="px-3 mb-2 text-[10px] tracking-[0.25em] uppercase"
                    style={{ color: "#6B675F" }}
                >
                    Navigation
                </p>
                {links.map((link) => {
                    const active =
                        link.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(link.href);
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="admin-nav-link"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "10px 12px",
                                borderRadius: "6px",
                                fontSize: "14px",
                                marginBottom: "2px",
                                transition: "all 200ms ease",
                                fontWeight: active ? 500 : 400,
                                background: active
                                    ? "rgba(198, 161, 91, 0.12)"
                                    : "transparent",
                                color: active ? "#C6A15B" : "#9A958C",
                                borderLeft: active
                                    ? "2px solid #C6A15B"
                                    : "2px solid transparent",
                            }}
                        >
                            <Icon size={18} strokeWidth={active ? 2 : 1.5} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-5 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Link
                    href="/"
                    className="flex items-center gap-2 text-[12px] transition-colors"
                    style={{ color: "#6B675F" }}
                    target="_blank"
                >
                    <ExternalLink size={14} />
                    View Storefront
                </Link>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div
                className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
                style={{
                    background: "rgba(10, 10, 10, 0.92)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-md"
                        style={{ color: "#C6A15B" }}
                        aria-label="Open menu"
                    >
                        <Menu size={22} />
                    </button>
                    <p
                        className="text-[14px] font-bold tracking-[0.12em]"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "#C6A15B",
                        }}
                    >
                        MAKULAYO
                    </p>
                </div>
                <span
                    className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded"
                    style={{
                        color: "#6B675F",
                        background: "rgba(255,255,255,0.04)",
                    }}
                >
                    Admin
                </span>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-[60]"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile slide-out sidebar */}
            <aside
                className="lg:hidden fixed top-0 left-0 bottom-0 z-[70] flex flex-col transition-transform duration-300 ease-out"
                style={{
                    width: "280px",
                    background: "#0F0F0F",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
                }}
            >
                {sidebarContent}
            </aside>

            {/* Desktop sidebar */}
            <aside
                className="hidden lg:flex flex-col shrink-0"
                style={{
                    width: "240px",
                    background: "#0F0F0F",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    minHeight: "100vh",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                }}
            >
                {sidebarContent}
            </aside>

            {/* Spacer for mobile top bar */}
            <div className="lg:hidden" style={{ height: "56px" }} />
        </>
    );
}