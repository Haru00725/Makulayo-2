"use client";

import { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      className="mt-12 crystal-glass-highlight crystal-glass px-10 py-5 rounded-full text-brand-gold text-lg font-bold tracking-wide hover:brightness-125 transition-all self-start"
    >
      Acquire — $240
    </button>
  );
}
