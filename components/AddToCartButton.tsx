"use client";

import { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      className="mt-8 md:mt-12 w-full md:w-auto crystal-glass-highlight crystal-glass px-10 py-4 md:py-5 rounded-full text-brand-gold text-base md:text-lg font-bold tracking-wide hover:brightness-125 active:scale-[0.97] transition-all"
    >
      Acquire — ₹1,999
    </button>
  );
}
