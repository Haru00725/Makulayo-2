"use client";

import Link from "next/link";
import Image from "next/image";
import { Truck, RefreshCcw, Lock } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative z-[2]" style={{ background: "var(--bg)" }}>
      {/* Compact shipping/returns/secure strip */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "var(--space-6) 0",
        }}
      >
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {[
              { icon: Truck, label: "Free shipping over ₹1,999" },
              { icon: RefreshCcw, label: "2-day returns" },
              { icon: Lock, label: "Secure payments" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={16} strokeWidth={1.25} style={{ color: "var(--text-faint)" }} />
                <span style={{ fontSize: "var(--caption)", color: "var(--text-faint)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer content with marble texture */}
      <div className="relative" style={{ background: "var(--bg)" }}>
        {/* Background marble at low opacity */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/footer_bg.png"
            alt=""
            fill
            className="object-cover"
            style={{ opacity: 0.15 }}
          />
          <div className="absolute inset-0" style={{ background: "var(--bg)", opacity: 0.6 }} />
        </div>

        {/* Columns */}
        <div className="relative z-10 px-5 md:px-8 pt-16 md:pt-24 pb-16">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand blurb */}
            <div className="col-span-2 md:col-span-1 space-y-6">
              <p style={{ fontSize: "var(--body)", color: "var(--text-muted)", lineHeight: 1.7 }}>
                Eau de Parfum crafted for those who notice. Blended in India with IFRA-compliant formulations.
              </p>
              <a
                href="https://www.instagram.com/makulayo.parfum_official"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                aria-label="Follow MAKULAYO on Instagram"
              >
                <InstagramIcon size={18} />
                <span style={{ fontSize: "var(--caption)" }}>@makulayo.parfum_official</span>
              </a>
            </div>

            {/* Explore */}
            <div>
              <h4
                className="mb-6"
                style={{
                  fontSize: "var(--eyebrow)",
                  letterSpacing: "var(--tracking-eyebrow)",
                  color: "var(--text)",
                }}
              >
                EXPLORE
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/#collection", label: "The Collection" },
                  { href: "/about", label: "Our Philosophy" },
                  { href: "/account", label: "Account" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors"
                      style={{ fontSize: "var(--body)", color: "var(--text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Client Care */}
            <div>
              <h4
                className="mb-6"
                style={{
                  fontSize: "var(--eyebrow)",
                  letterSpacing: "var(--tracking-eyebrow)",
                  color: "var(--text)",
                }}
              >
                CLIENT CARE
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/shipping", label: "Shipping & Returns" },
                  { href: "/faq", label: "FAQ" },
                  { href: "mailto:makulayo@gmail.com", label: "Contact Us" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors"
                      style={{ fontSize: "var(--body)", color: "var(--text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Contact */}
            <div>
              <h4
                className="mb-6"
                style={{
                  fontSize: "var(--eyebrow)",
                  letterSpacing: "var(--tracking-eyebrow)",
                  color: "var(--text)",
                }}
              >
                LEGAL
              </h4>
              <ul className="space-y-3 mb-6">
                {[
                  { href: "/terms", label: "Terms of Service" },
                  { href: "/privacy", label: "Privacy Policy" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors"
                      style={{ fontSize: "var(--body)", color: "var(--text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Grievance & Contact Block */}
          <div
            className="max-w-7xl mx-auto mt-12 pt-8"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h4
                  className="mb-3"
                  style={{
                    fontSize: "var(--eyebrow)",
                    letterSpacing: "var(--tracking-eyebrow)",
                    color: "var(--text-muted)",
                  }}
                >
                  CONTACT & GRIEVANCE
                </h4>
                <div style={{ fontSize: "var(--caption)", color: "var(--text-faint)", lineHeight: 1.8 }}>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:makulayo@gmail.com"
                      className="transition-colors"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                      makulayo@gmail.com
                    </a>
                  </p>
                  <p>Grievance Officer: To be announced</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            className="max-w-7xl mx-auto mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <p style={{ fontSize: "var(--caption)", color: "var(--text-faint)" }}>
              © {new Date().getFullYear()} MAKULAYO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
