"use client";

import { useRef, useState, useEffect } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const featuredProduct = products[0]; // MAKULAYO No. 1
  const [isHovered, setIsHovered] = useState(false);

  // Ordered: Golden Ember (m4), Veloura Noir (m5), Apex (m1), Crimson Eden (m2), Tidal Rush (m3)
  const orderedProducts = [
    products.find(p => p.id === 'm4'),
    products.find(p => p.id === 'm5'),
    products.find(p => p.id === 'm1'),
    products.find(p => p.id === 'm2'),
    products.find(p => p.id === 'm3')
  ].filter(Boolean) as typeof products;

  const displayProducts = [...orderedProducts, ...orderedProducts, ...orderedProducts];

  useEffect(() => {
    let animationFrameId: number;
    let direction = 1;
    
    const loop = () => {
      const container = scrollContainerRef.current;
      if (container && !isHovered) {
        container.scrollLeft += direction * 1;
        
        // Bounce back if we hit either end
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
          direction = -1; // scroll left
        } else if (container.scrollLeft <= 0) {
          direction = 1; // scroll right
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

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
      
      {/* The Scroll Track */}
      <div ref={containerRef} className="relative h-[350vh] md:h-[300vh] w-full">
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
          
          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto relative py-4 md:py-8 -mx-5 md:-mx-8 px-5 md:px-8 touch-pan-x" 
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <div className="flex gap-4 md:gap-12 w-max pr-4 md:pr-12">
              {displayProducts.map((product, i) => (
                <Link 
                  key={`${product.id}-${i}`} 
                  href={`/product/${product.id}`}
                  className="group flex flex-col items-center p-4 md:p-6 bg-white/5 backdrop-blur-md border-none rounded-2xl md:rounded-3xl transition-all hover:bg-white/10 w-[220px] md:w-[280px] shrink-0"
                >
                  <div className="relative w-full aspect-[4/5] mb-4 md:mb-6 overflow-hidden rounded-xl md:rounded-2xl">
                    <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 z-10 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium text-brand-ivory">
                      <span className="text-brand-gold text-[10px] md:text-xs">★</span>
                      <span>{i % 2 === 0 ? '4.9' : '4.8'}</span>
                    </div>
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
                  <p className="text-brand-ivory-muted text-center text-[10px] md:text-xs mb-4 md:mb-6">
                    {product.notes.top.split(',')[0]} • {product.notes.heart.split(',')[0]} • {product.notes.base.split(',')[0]}
                  </p>
                  
                  <div className="flex items-center justify-between w-full mt-auto pt-3 md:pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-brand-ivory font-sans font-normal text-sm md:text-base">₹{itemPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="text-brand-gold font-bold tracking-widest text-[9px] md:text-xs uppercase hover:text-white transition-colors py-1"
                      aria-label="Add to cart"
                    >
                      ADD TO CART
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
        <section className="relative z-20 bg-brand-gold pt-10 pb-20 md:pt-16 md:pb-32 px-5 md:px-8 text-center">
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
