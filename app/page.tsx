"use client";

import { useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ScrollytellingOverlay } from "@/components/ScrollytellingOverlay";
import { products } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { ArrowRight, Leaf, ShieldCheck, Award, MapPin } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuredProduct = products[0];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { addToCart, itemPrice } = useCart();

  // Newsletter state
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setNewsletterStatus("loading");
    // Simulate submission
    setTimeout(() => setNewsletterStatus("success"), 800);
  };

  // Ordered products for grid
  const orderedProducts = [
    products.find((p) => p.id === "m4"),
    products.find((p) => p.id === "m5"),
    products.find((p) => p.id === "m1"),
    products.find((p) => p.id === "m2"),
    products.find((p) => p.id === "m3"),
  ].filter(Boolean) as typeof products;

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Scroll Track */}
      <div ref={containerRef} className="relative w-full" style={{ height: "300vh" }}>
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: "100svh", background: "var(--bg)" }}
        >
          <ScrollytellingOverlay progress={scrollYProgress} featuredProduct={featuredProduct} />
        </div>
      </div>

      {/* ============================================================
          COLLECTION GRID
          ============================================================ */}
      <section
        id="collection"
        className="relative z-[2]"
        style={{
          background: "var(--surface)",
          paddingTop: "var(--section-pad)",
          paddingBottom: "var(--section-pad)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Reveal>
            <h2
              className="mb-16"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--display-lg)",
                letterSpacing: "var(--tracking-display-lg)",
                color: "var(--text)",
              }}
            >
              THE COLLECTION
            </h2>
          </Reveal>

          <RevealGroup
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "1px", background: "var(--border)" }}
          >
            {orderedProducts.map((product) => (
              <RevealItem key={product.id}>
                <Link
                  href={`/product/${product.id}`}
                  className="group flex flex-col h-full transition-colors"
                  style={{ background: "var(--surface)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-alt)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                >
                  {/* Image */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
                    <Image
                      src={product.image}
                      alt={`${product.name} Eau de Parfum 50ml bottle — ${product.family}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain transition-transform group-hover:scale-[1.03]"
                      style={{ transitionDuration: "500ms", transitionTimingFunction: "var(--ease)" }}
                    />
                  </div>

                  {/* Card info */}
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--display-md)",
                        letterSpacing: "var(--tracking-display-md)",
                        color: "var(--text)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      {product.name.toUpperCase()}
                    </h3>
                    <p style={{ fontSize: "var(--caption)", color: "var(--text-muted)", marginBottom: "var(--space-1)" }}>
                      {product.family}
                    </p>
                    <p style={{ fontSize: "var(--caption)", color: "var(--text-faint)", marginBottom: "var(--space-2)" }}>
                      {product.notes.top.split(",")[0].trim()} · {product.notes.heart.split(",")[0].trim()} · {product.notes.base.split(",")[0].trim()}
                    </p>
                    <p style={{ fontSize: "var(--caption)", color: "var(--text-faint)", marginBottom: "var(--space-3)" }}>
                      50ml · Eau de Parfum
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4">
                      <span className="font-medium" style={{ color: "var(--gold)", fontSize: "var(--body)" }}>
                        ₹{itemPrice.toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="transition-all md:opacity-0 md:group-hover:opacity-100"
                        style={{
                          fontSize: "var(--eyebrow)",
                          letterSpacing: "var(--tracking-eyebrow)",
                          color: "var(--gold)",
                          padding: "8px 16px",
                          border: "1px solid var(--gold-dim)",
                          background: "transparent",
                          transitionDuration: "200ms",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--gold)";
                          e.currentTarget.style.background = "var(--gold-glow)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--gold-dim)";
                          e.currentTarget.style.background = "transparent";
                        }}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ============================================================
          PHILOSOPHY
          ============================================================ */}
      <section
        className="relative z-[2]"
        style={{
          background: "var(--bg)",
          paddingTop: "var(--section-pad)",
          paddingBottom: "var(--section-pad)",
        }}
      >
        <Reveal className="max-w-2xl mx-auto px-5 md:px-8 text-center">
          <p
            className="mb-6"
            style={{
              fontSize: "var(--eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              color: "var(--gold)",
            }}
          >
            OUR PHILOSOPHY
          </p>
          <p
            className="mb-8"
            style={{
              fontSize: "var(--body-lg)",
              lineHeight: 1.7,
              color: "var(--text-muted)",
              maxWidth: "62ch",
              margin: "0 auto",
              marginBottom: "var(--space-8)",
            }}
          >
            Blended in India. Eau de Parfum concentration for 8–12 hour longevity. IFRA-compliant formulations. No compromises on raw materials — every drop is crafted to evolve on your skin.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 transition-all"
            style={{
              color: "var(--text)",
              fontSize: "var(--eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              borderBottom: "1px solid var(--gold-dim)",
              paddingBottom: "4px",
              transitionDuration: "200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--gold)";
              e.currentTarget.style.borderColor = "var(--gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text)";
              e.currentTarget.style.borderColor = "var(--gold-dim)";
            }}
          >
            DISCOVER THE BRAND <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </Reveal>
      </section>

      {/* ============================================================
          QUALITY BADGES
          ============================================================ */}
      <section
        className="relative z-[2]"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "var(--space-12) 0",
        }}
      >
        <RevealGroup className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, label: "CRUELTY FREE", sub: "No animal testing" },
              { icon: ShieldCheck, label: "PHTHALATE FREE", sub: "Clean formulation" },
              { icon: Award, label: "IFRA COMPLIANT", sub: "Safety certified" },
              { icon: MapPin, label: "MADE IN INDIA", sub: "Blended locally" },
            ].map(({ icon: Icon, label, sub }) => (
              <RevealItem key={label} className="flex flex-col items-center text-center">
                <Icon
                  size={24}
                  strokeWidth={1.25}
                  style={{ color: "var(--gold)", marginBottom: "var(--space-3)" }}
                />
                <p
                  style={{
                    fontSize: "var(--eyebrow)",
                    letterSpacing: "var(--tracking-eyebrow)",
                    color: "var(--gold)",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  {label}
                </p>
                <p style={{ fontSize: "var(--caption)", color: "var(--text-muted)" }}>{sub}</p>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>
      </section>

      {/* ============================================================
          NEWSLETTER — JOIN THE FEW
          ============================================================ */}
      <section
        className="relative z-[2]"
        style={{
          background: "var(--bg)",
          paddingTop: "var(--section-pad)",
          paddingBottom: "var(--section-pad)",
        }}
      >
        <Reveal className="max-w-md mx-auto px-5 md:px-8 text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--display-lg)",
              letterSpacing: "var(--tracking-display-lg)",
              color: "var(--text)",
            }}
          >
            JOIN THE FEW
          </h2>
          <p
            className="mb-8"
            style={{ fontSize: "var(--body)", color: "var(--text-muted)" }}
          >
            Early access to new releases and exclusive offers.
          </p>

          {newsletterStatus === "success" ? (
            <p style={{ color: "var(--gold)", fontSize: "var(--body)" }}>
              Welcome to the few. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex items-center gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="flex-1 bg-transparent outline-none pb-2"
                style={{
                  borderBottom: "1px solid var(--border-strong)",
                  color: "var(--text)",
                  fontSize: "var(--body)",
                  transition: "border-color 200ms var(--ease)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
              />
              <button
                type="submit"
                disabled={newsletterStatus === "loading"}
                className="pb-2 ml-3 transition-colors"
                style={{
                  color: "var(--gold)",
                  borderBottom: "1px solid transparent",
                  transitionDuration: "200ms",
                }}
                aria-label="Subscribe"
              >
                {newsletterStatus === "loading" ? (
                  <span style={{ fontSize: "var(--caption)" }}>...</span>
                ) : (
                  <ArrowRight size={18} strokeWidth={1.5} />
                )}
              </button>
            </form>
          )}
        </Reveal>
      </section>
    </main>
  );
}
