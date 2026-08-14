import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, RefreshCcw, Lock, Gem } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-20 rounded-t-[2.5rem] md:rounded-t-[4rem] overflow-hidden -mt-12 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col">
      
      {/* Trust Badges Banner */}
      <div className="bg-brand-ivory text-black py-8 px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-y-0 md:divide-x md:divide-black/10">
          <div className="flex flex-col items-center text-center px-4">
            <Truck className="w-8 h-8 mb-4 stroke-[1.5] text-brand-gold" />
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1">Free Shipping</h4>
            <p className="text-[10px] sm:text-xs text-black/60">On orders over ₹1999</p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <Gem className="w-8 h-8 mb-4 stroke-[1.5] text-brand-gold" />
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1">True Luxury</h4>
            <p className="text-[10px] sm:text-xs text-black/60">Finest ingredients</p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <RefreshCcw className="w-8 h-8 mb-4 stroke-[1.5] text-brand-gold" />
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1">Easy Returns</h4>
            <p className="text-[10px] sm:text-xs text-black/60">5-day return policy</p>
          </div>
          <div className="flex flex-col items-center text-center px-4">
            <Lock className="w-8 h-8 mb-4 stroke-[1.5] text-brand-gold" />
            <h4 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1">Secure Payments</h4>
            <p className="text-[10px] sm:text-xs text-black/60">Safe & encrypted</p>
          </div>
        </div>
      </div>

      <div className="relative bg-black text-brand-ivory-muted py-24 px-8 flex flex-col justify-between">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/footer_bg.png" 
            alt="Dark elegant texture" 
            fill 
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        {/* Brand & Newsletter */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="flex items-start text-4xl md:text-5xl">
            <span className="logo-text">MAKULAYO</span><span className="text-sm text-brand-gold ml-1 mt-1 font-sans font-medium">™</span>
          </h2>
          <p className="text-lg max-w-sm leading-relaxed">
            Exquisite Eau de Parfums. Crafted without compromise for those who notice the details.
          </p>
          <div className="pt-4">
            <h4 className="text-sm font-semibold tracking-[0.2em] uppercase text-brand-ivory mb-4">Join The Few</h4>
            <div className="flex items-center border-b border-white/20 pb-2 max-w-md focus-within:border-brand-gold transition-colors">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent border-none outline-none w-full text-brand-ivory placeholder:text-white/30"
              />
              <button className="text-brand-gold hover:text-brand-ivory transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-[0.2em] uppercase text-brand-ivory mb-6">Explore</h4>
          <ul className="space-y-4">
            <li><Link href="/#collection" className="hover:text-brand-gold transition-colors">The Collection</Link></li>
            <li><Link href="/about" className="hover:text-brand-gold transition-colors">Our Philosophy</Link></li>
            <li><Link href="/account" className="hover:text-brand-gold transition-colors">Account</Link></li>
            <li><Link href="/shipping-returns" className="hover:text-brand-gold transition-colors">Shipping & Returns</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-[0.2em] uppercase text-brand-ivory mb-6">Client Care</h4>
          <ul className="space-y-4">
            <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto w-full mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} Makulayo. All rights reserved.
        </p>
        <div className="flex space-x-6 text-sm font-semibold tracking-wider">
          <a href="#" className="text-white/40 hover:text-brand-gold transition-colors">IG</a>
          <a href="#" className="text-white/40 hover:text-brand-gold transition-colors">X</a>
          <a href="#" className="text-white/40 hover:text-brand-gold transition-colors">FB</a>
        </div>
        </div>
      </div>
    </footer>
  );
}
