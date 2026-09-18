"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import { ShoppingCart, Check, Loader2 } from "lucide-react";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, itemPrice } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = () => {
    setStatus("loading");
    setTimeout(() => {
      addToCart(product);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1500);
    }, 300);
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="w-full flex items-center justify-center gap-3 py-4 transition-colors duration-200"
      style={{
        border: "1px solid var(--gold)",
        background: status === "success" ? "var(--gold-glow)" : "transparent",
        color: "var(--gold)",
        fontSize: "var(--eyebrow)",
        letterSpacing: "var(--tracking-eyebrow)",
        fontFamily: "var(--font-body)",
      }}
      onMouseEnter={(e) => {
        if (status === "idle") {
          e.currentTarget.style.background = "var(--gold-glow)";
          e.currentTarget.style.borderColor = "var(--gold-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (status === "idle") {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "var(--gold)";
        }
      }}
    >
      {status === "loading" && <Loader2 size={16} className="animate-spin" />}
      {status === "success" && <Check size={16} />}
      {status === "idle" && <ShoppingCart size={16} strokeWidth={1.5} />}
      {status === "loading" ? "ADDING..." : status === "success" ? "ADDED TO CART" : `ADD TO CART — ₹${itemPrice.toLocaleString("en-IN")}`}
    </button>
  );
}
