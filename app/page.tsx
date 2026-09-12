"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Navbar } from "@/components/Navbar";
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

  const { user } = useAuth();
  const { addToCart, itemPrice } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasShownAuth, setHasShownAuth] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
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
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-golden-live">
          <ScrollytellingOverlay progress={scrollYProgress} featuredProduct={featuredProduct} />
        </div>
      </div>
      
      {/* Philosophy Section */}
      <section className="bg-brand-void py-16 md:py-32 px-5 md:px-8 relative z-20">
        {/* Fade overlay at the top */}
        <div className="absolute top-0 left-0 right-0 h-32 md:h-64 bg-gradient-to-b from-[#140f04] to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-xs md:text-sm tracking-[0.2em] uppercase text-brand-gold mb-4 md:mb-6">Our Philosophy</h2>
          <p className="text-xl md:text-5xl font-serif font-light text-brand-ivory leading-tight mb-8 md:mb-12">
            We craft fragrances of unparalleled quality. By using only the finest ingredients, we ensure every drop embodies true sophistication.
          </p>
          <Link href="/about" className="inline-flex items-center space-x-2 text-brand-ivory hover:text-brand-gold transition-colors pb-1 border-b border-brand-gold/30 hover:border-brand-gold font-medium tracking-[0.15em] text-sm md:text-base">
            <span>Discover The Brand</span>
            <span className="text-lg md:text-xl">→</span>
          </Link>
        </div>
      </section>

      {/* 
        Product Showcase
      */}
      <div className="min-h-[80vh] md:min-h-screen bg-brand-surface py-12 md:py-24 px-5 md:px-8 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col items-start w-full">
          <h2 className="text-3xl md:text-7xl font-serif font-light tracking-tight text-brand-gold mb-8 md:mb-16 text-left drop-shadow-md">
            The Exquisite Ones
          </h2>
          
          <div className="w-full overflow-x-auto md:overflow-hidden relative py-4 md:py-8 -mx-5 md:-mx-8 px-5 md:px-8" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-4 md:gap-12 w-max md:animate-marquee pr-4 md:pr-12">
              {[...products, ...products, ...products, ...products].map((product, i) => (
                <Link 
                  key={`${product.id}-${i}`} 
                  href={`/product/${product.id}`}
                  className="group flex flex-col items-center p-4 md:p-6 crystal-glass rounded-2xl md:rounded-3xl transition-all hover:bg-white/5 w-[240px] md:w-[320px] shrink-0"
                >
                  <div className="relative w-full aspect-square mb-4 md:mb-6 overflow-hidden rounded-xl md:rounded-2xl">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      sizes="(max-width: 768px) 240px, 320px"
                      className="object-contain transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  <h3 className="text-lg md:text-2xl font-serif font-normal text-brand-ivory mb-1 md:mb-2 group-hover:text-brand-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-brand-ivory-muted text-center text-[10px] md:text-xs mb-3 md:mb-4 line-clamp-2">
                    {product.notes.top} • {product.notes.heart} • {product.notes.base}
                  </p>
                  
                  <div className="flex items-center justify-between w-full mt-auto pt-3 md:pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-brand-gold font-sans font-normal text-base md:text-lg">₹{itemPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 hover:bg-brand-gold hover:text-black flex items-center justify-center transition-colors border border-white/5 text-lg md:text-xl font-light active:scale-95"
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

      {/* Signed In CTA Section */}
      {!user && (
        <section className="relative z-20 bg-brand-gold py-10 md:py-16 px-5 md:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-5xl font-bold text-black tracking-wide mb-3 md:mb-4">
              SIGNED IN YET?
            </h2>
            <p className="text-black/70 text-xs md:text-base tracking-widest uppercase mb-6 md:mb-8">
              Exclusive drops are waiting. Make sure not to miss out!
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-block border-2 border-black text-black font-bold tracking-[0.2em] uppercase text-xs md:text-sm px-8 md:px-10 py-3.5 md:py-4 hover:bg-black hover:text-brand-gold active:scale-95 transition-all duration-300"
            >
              GET IN. NOW.
            </button>
          </div>
        </section>
      )}

    </main>
  );
}
