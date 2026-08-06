"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ScrollytellingCanvas } from "@/components/ScrollytellingCanvas";
import { ScrollytellingOverlay } from "@/components/ScrollytellingOverlay";
import { products } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import { useCart } from "@/components/CartProvider";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuredProduct = products[0]; // MAKULAYO No. 1

  // Track the scroll progress of the main container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasShownAuth, setHasShownAuth] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
    if (latest > 0.99 && !user && !hasShownAuth) {
      setIsAuthModalOpen(true);
      setHasShownAuth(true);
    }
  });

  return (
    <main className="bg-brand-void min-h-screen selection:bg-brand-gold/30 selection:text-brand-ivory">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <Navbar />
      
      {/* The Scroll Track - ~220vh gives enough room to scroll through the 3 beats comfortably */}
      <div ref={containerRef} className="relative h-[220vh] w-full">
        {/* Sticky Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <ScrollytellingCanvas progress={progress} />
          <ScrollytellingOverlay progress={scrollYProgress} featuredProduct={featuredProduct} />
        </div>
      </div>
      
      {/* 
        Product Showcase
      */}
      <div className="min-h-screen bg-brand-surface py-24 px-8 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-gold mb-16 text-center drop-shadow-md">
            The Exquisite Ones
          </h2>
          
          <div className="w-full overflow-hidden pause-marquee relative py-8 -mx-8 px-8">
            <div className="flex gap-12 w-max animate-marquee pr-12">
              {[...products, ...products, ...products, ...products].map((product, i) => (
                <Link 
                  key={`${product.id}-${i}`} 
                  href={`/product/${product.id}`}
                  className="group flex flex-col items-center p-6 crystal-glass rounded-3xl transition-all hover:bg-white/5 w-[320px] shrink-0"
                >
                  <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-2xl">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-brand-ivory mb-2 group-hover:text-brand-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-brand-ivory-muted text-center text-xs mb-4 line-clamp-2">
                    {product.notes.top} • {product.notes.heart} • {product.notes.base}
                  </p>
                  
                  <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-white/10">
                    <span className="text-brand-gold font-bold text-lg">$240</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-gold hover:text-black flex items-center justify-center transition-colors border border-white/10 text-xl font-light"
                      aria-label="Add to cart"
                    >
                      +
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
