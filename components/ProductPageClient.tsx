"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import { Navbar } from "@/components/Navbar";
import { AddToCartButton } from "@/components/AddToCartButton";
import { QuantityStepper } from "@/components/QuantityStepper";
import { SizeSelector } from "@/components/SizeSelector";
import { Accordion } from "@/components/Accordion";
import { useCart } from "@/components/CartProvider";

interface ProductPageClientProps {
  product: (typeof products)[number];
  relatedProducts: (typeof products)[number][];
}

export function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("50ml");
  const { addToCart, itemPrice } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const accordionItems = [
    {
      title: "FRAGRANCE NOTES",
      content: (
        <div className="space-y-3">
          <div>
            <span style={{ color: "var(--gold)", fontSize: "var(--caption)" }}>Top: </span>
            <span>{product.notes.top}</span>
          </div>
          <div>
            <span style={{ color: "var(--gold)", fontSize: "var(--caption)" }}>Heart: </span>
            <span>{product.notes.heart}</span>
          </div>
          <div>
            <span style={{ color: "var(--gold)", fontSize: "var(--caption)" }}>Base: </span>
            <span>{product.notes.base}</span>
          </div>
        </div>
      ),
    },
    {
      title: "HOW TO WEAR",
      content: (
        <p>{product.bestWorn || "Apply to pulse points — wrists, neck, behind ears. For best longevity, apply to moisturised skin. One to two sprays is sufficient."}</p>
      ),
    },
    {
      title: "SHIPPING & RETURNS",
      content: (
        <div className="space-y-2">
          <p>Free shipping on orders over ₹1,999. Standard delivery in 2 business days.</p>
          <p>2-day return policy on unopened, sealed items. Contact us to initiate a return.</p>
        </div>
      ),
    },
    {
      title: "INGREDIENTS",
      content: (
        <p style={{ fontSize: "var(--caption)" }}>
          Alcohol denat., parfum (fragrance), aqua (water), limonene, linalool, coumarin, citronellol, geraniol.
          IFRA compliant. Phthalate free. Not tested on animals.
        </p>
      ),
    },
  ];

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-16 md:pb-24">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2" style={{ fontSize: "var(--caption)", color: "var(--text-faint)" }}>
            <li><Link href="/" className="transition-colors hover:underline" style={{ color: "var(--text-faint)" }}>Home</Link></li>
            <li>/</li>
            <li><Link href="/#collection" className="transition-colors hover:underline" style={{ color: "var(--text-faint)" }}>Collection</Link></li>
            <li>/</li>
            <li style={{ color: "var(--text-muted)" }}>{product.name}</li>
          </ol>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-24">
          {/* Left: Gallery */}
          <div>
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4/5", background: "var(--surface)" }}
            >
              <Image
                src={product.image}
                alt={`${product.name} ${product.size} ${product.type} bottle — ${product.family}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right: Purchase panel */}
          <div className="md:sticky md:top-24 md:self-start">
            {/* Product name */}
            <h1
              className="mb-2"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--display-lg)",
                letterSpacing: "var(--tracking-display-lg)",
              }}
            >
              {product.name.toUpperCase()}
            </h1>

            {/* Fragrance family */}
            {product.family && (
              <p
                className="mb-6"
                style={{
                  fontSize: "var(--eyebrow)",
                  letterSpacing: "var(--tracking-eyebrow)",
                  color: "var(--gold)",
                }}
              >
                {product.family.toUpperCase()}
              </p>
            )}

            {/* Price */}
            <p
              className="mb-8"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--display-md)",
                letterSpacing: "var(--tracking-display-md)",
                color: "var(--gold)",
              }}
            >
              ₹{itemPrice.toLocaleString("en-IN")}
            </p>

            {/* Size selector */}
            <div className="mb-6">
              <p className="mb-3" style={{ fontSize: "var(--caption)", color: "var(--text-muted)" }}>SIZE</p>
              <SizeSelector
                sizes={[
                  { label: "50ml", value: "50ml", available: true },
                  { label: "25ml", value: "25ml", available: false },
                ]}
                selected={selectedSize}
                onChange={setSelectedSize}
              />
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="mb-3" style={{ fontSize: "var(--caption)", color: "var(--text-muted)" }}>QUANTITY</p>
              <QuantityStepper value={quantity} onChange={setQuantity} />
            </div>

            {/* Add to cart */}
            <div className="mb-6">
              <AddToCartButton product={product} />
            </div>

            {/* Delivery estimate */}
            <p className="mb-8" style={{ fontSize: "var(--caption)", color: "var(--text-faint)" }}>
              Estimated delivery: 2–3 business days
            </p>

            {/* Accordions */}
            <Accordion items={accordionItems} />
          </div>
        </div>

        {/* Below the fold: Description */}
        <section
          className="mb-16"
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "var(--space-16)",
          }}
        >
          <div style={{ maxWidth: "62ch" }}>
            {product.tagline && (
              <p
                className="mb-6"
                style={{
                  fontSize: "var(--body-lg)",
                  color: "var(--gold)",
                  fontStyle: "italic",
                }}
              >
                {product.tagline}
              </p>
            )}
            <div style={{ fontSize: "var(--body-lg)", lineHeight: 1.7, color: "var(--text-muted)" }}>
              {product.description.split("\n\n").slice(0, 3).map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Fragrance Architecture panel */}
        <section
          className="mb-16 p-6 md:p-8"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            className="mb-6"
            style={{
              fontSize: "var(--eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              color: "var(--gold)",
            }}
          >
            FRAGRANCE ARCHITECTURE
          </h3>
          <div className="space-y-0">
            {[
              { label: "TOP", notes: product.notes.top },
              { label: "HEART", notes: product.notes.heart },
              { label: "BASE", notes: product.notes.base },
            ].map((row, i) => (
              <div
                key={row.label}
                className="flex items-baseline gap-6 py-4"
                style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
              >
                <span
                  className="shrink-0 w-16"
                  style={{
                    fontSize: "var(--eyebrow)",
                    letterSpacing: "var(--tracking-eyebrow)",
                    color: "var(--gold)",
                  }}
                >
                  {row.label}
                </span>
                <span style={{ fontSize: "var(--body)", color: "var(--text)" }}>
                  {row.notes}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Longevity & Sillage */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl">
          {[
            { label: "LONGEVITY", value: 85 },
            { label: "SILLAGE", value: 70 },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: "var(--eyebrow)", letterSpacing: "var(--tracking-eyebrow)", color: "var(--text-muted)" }}>
                  {label}
                </span>
                <span style={{ fontSize: "var(--caption)", color: "var(--text-faint)" }}>
                  {value === 85 ? "8–12 hrs" : "Moderate"}
                </span>
              </div>
              <div className="w-full h-[2px]" style={{ background: "var(--border)" }}>
                <div className="h-full" style={{ width: `${value}%`, background: "var(--gold)" }} />
              </div>
            </div>
          ))}
        </section>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <section
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "var(--space-16)",
            }}
          >
            <h2
              className="mb-12"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--display-md)",
                letterSpacing: "var(--tracking-display-md)",
                color: "var(--text)",
              }}
            >
              YOU MAY ALSO LIKE
            </h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              style={{ gap: "1px", background: "var(--border)" }}
            >
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/product/${rp.id}`}
                  className="group flex flex-col transition-colors"
                  style={{ background: "var(--surface)" }}
                >
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
                    <Image
                      src={rp.image}
                      alt={`${rp.name} ${rp.size} ${rp.type}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain transition-transform group-hover:scale-[1.03]"
                      style={{ transitionDuration: "500ms" }}
                    />
                  </div>
                  <div className="p-5">
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--display-md)",
                        letterSpacing: "var(--tracking-display-md)",
                        color: "var(--text)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      {rp.name.toUpperCase()}
                    </h3>
                    <p style={{ fontSize: "var(--caption)", color: "var(--text-muted)", marginBottom: "var(--space-2)" }}>
                      {rp.family}
                    </p>
                    <p className="font-medium" style={{ color: "var(--gold)", fontSize: "var(--body)" }}>
                      ₹{(1499).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile buy button */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4"
        style={{
          background: "var(--bg)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <AddToCartButton product={product} />
      </div>
    </main>
  );
}
