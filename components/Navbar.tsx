"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, X, Trash2, User } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export function Navbar() {
  const { scrollYProgress } = useScroll();
  const { items, cartCount, cartTotal, isCartOpen, setIsCartOpen, removeFromCart, itemPrice, isFirstOrder } = useCart();
  
  // The nav starts nearly invisible over the opening hero frame and gently increases in presence
  // as the cap-separation sequence begins (~15% scroll).
  const navOpacity = useTransform(scrollYProgress, [0, 0.15], [0.3, 1]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-brand-gold text-black text-xs md:text-sm font-semibold tracking-widest uppercase py-2 z-50 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          Get 20% discount on your first order! • Free shipping on orders over ₹1999 • Get 20% discount on your first order! • Free shipping on orders over ₹1999 • Get 20% discount on your first order! • Free shipping on orders over ₹1999 • Get 20% discount on your first order!
        </div>
      </div>
      <motion.nav
        style={{ opacity: navOpacity }}
        className="fixed top-12 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between px-6 py-3 w-[90%] max-w-5xl rounded-full crystal-glass"
      >
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-start">
            <span className="logo-text text-lg">MAKULAYO</span><span className="text-[10px] text-brand-gold ml-0.5 mt-0.5 font-sans font-medium">™</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center space-x-8 text-sm font-medium text-brand-ivory-muted tracking-[0.15em]">
          <Link href="/#collection" className="hover:text-brand-ivory transition-colors">Collection</Link>
          <Link href="/shipping" className="hover:text-brand-ivory transition-colors">Shipping</Link>
        </div>

        <div className="flex-1 flex items-center justify-end space-x-4">
          <Link href="/account" className="relative p-2 text-brand-ivory hover:text-brand-gold transition-colors" aria-label="Account">
            <User size={20} />
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-brand-ivory hover:text-brand-gold transition-colors"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-black text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          
          <button className="hidden md:block crystal-glass-highlight crystal-glass px-5 py-2.5 rounded-full text-brand-gold text-sm font-semibold tracking-wide hover:brightness-125 transition-all">
            Explore The Collection
          </button>
        </div>
      </motion.nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-surface border-l border-white/5 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-brand-ivory">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-brand-ivory-muted hover:text-brand-ivory">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-brand-ivory-muted space-y-4">
                    <ShoppingCart size={48} className="opacity-20" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 items-center crystal-glass p-4 rounded-2xl">
                      <div className="relative w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-brand-ivory">{item.product.name}</h4>
                        <p className="text-sm text-brand-ivory-muted">Qty: {item.quantity}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-brand-gold font-medium">₹{(itemPrice * item.quantity).toLocaleString('en-IN')}</p>
                          {isFirstOrder && <p className="text-brand-ivory-muted line-through text-xs">₹{(1599 * item.quantity).toLocaleString('en-IN')}</p>}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-brand-ivory-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-black/20">
                  <div className="flex justify-between text-lg font-bold text-brand-ivory mb-2">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {isFirstOrder && (
                    <p className="text-brand-gold text-sm font-medium mb-6">
                      ✨ You'll get a 20% discount on this order!
                    </p>
                  )}
                  <Link 
                    href="/checkout" 
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full text-center crystal-glass-highlight crystal-glass py-4 rounded-xl text-brand-gold font-bold tracking-wide hover:brightness-125 transition-all"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
