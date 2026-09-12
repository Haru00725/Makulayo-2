import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, RefreshCcw, Lock, Gem } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-20 rounded-t-[2rem] md:rounded-t-[4rem] overflow-hidden -mt-12 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col">
      
      {/* Trust Badges Banner */}
      <div className="bg-brand-ivory text-black py-5 md:py-8 px-4 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-x-2 md:divide-x md:divide-black/10">
          <div className="flex flex-col items-center text-center px-1 md:px-4">
            <Truck className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-4 stroke-[1.5] text-brand-gold" />
            <h4 className="text-[9px] md:text-xs font-bold tracking-widest uppercase mb-0.5 md:mb-1">Free Shipping</h4>
            <p className="text-[8px] md:text-xs text-black/60">Over ₹1999</p>
          </div>

          <div className="flex flex-col items-center text-center px-1 md:px-4">
            <RefreshCcw className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-4 stroke-[1.5] text-brand-gold" />
            <h4 className="text-[9px] md:text-xs font-bold tracking-widest uppercase mb-0.5 md:mb-1">Easy Returns</h4>
            <p className="text-[8px] md:text-xs text-black/60">5-day policy</p>
          </div>
          <div className="flex flex-col items-center text-center px-1 md:px-4">
            <Lock className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-4 stroke-[1.5] text-brand-gold" />
            <h4 className="text-[9px] md:text-xs font-bold tracking-widest uppercase mb-0.5 md:mb-1">Secure Pay</h4>
            <p className="text-[8px] md:text-xs text-black/60">Safe & encrypted</p>
          </div>
        </div>
      </div>

      <div className="relative bg-black text-brand-ivory-muted flex flex-col justify-between">
        
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

        {/* Brand Tagline - same bg as footer */}
        <div className="relative z-10 py-12 md:py-20 px-6 md:px-8 overflow-hidden border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-[clamp(2.5rem,14vw,10rem)] font-bold leading-[0.9] tracking-tight text-transparent uppercase select-none"
              style={{
                WebkitTextStroke: '1.5px rgba(212, 175, 55, 0.4)',
              }}
            >
              CRAFTED FOR YOU!
            </h2>
          </div>
        </div>

        {/* Footer Content */}
        <div className="relative z-10 py-12 md:py-24 px-6 md:px-8">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-8">
          
            {/* Brand & Newsletter */}
            <div className="col-span-2 space-y-6 md:space-y-8">
              <h2 className="flex items-start text-3xl md:text-5xl">
                <span className="logo-text">MAKULAYO</span><span className="text-sm text-brand-gold ml-1 mt-1 font-sans font-medium">™</span>
              </h2>
              <p className="text-sm md:text-lg max-w-sm leading-relaxed">
                Exquisite Eau de Parfums. Crafted without compromise for those who notice the details.
              </p>
              <div className="pt-2 md:pt-4">
                <h4 className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-brand-ivory mb-3 md:mb-4">Join The Few</h4>
                <div className="flex items-center border-b border-white/20 pb-2 max-w-md focus-within:border-brand-gold transition-colors">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="bg-transparent border-none outline-none w-full text-brand-ivory placeholder:text-white/30 text-sm md:text-base"
                  />
                  <button className="text-brand-gold hover:text-brand-ivory transition-colors p-2">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-brand-ivory mb-4 md:mb-6">Explore</h4>
              <ul className="space-y-3 md:space-y-4 text-sm">
                <li><Link href="/#collection" className="hover:text-brand-gold transition-colors">The Collection</Link></li>
                <li><Link href="/about" className="hover:text-brand-gold transition-colors">Our Philosophy</Link></li>
                <li><Link href="/account" className="hover:text-brand-gold transition-colors">Account</Link></li>
                <li><Link href="/shipping-returns" className="hover:text-brand-gold transition-colors">Shipping & Returns</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-brand-ivory mb-4 md:mb-6">Client Care</h4>
              <ul className="space-y-3 md:space-y-4 text-sm">
                <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link></li>
                <li><Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

          </div>

          <div className="max-w-7xl mx-auto w-full mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <p className="text-xs md:text-sm text-white/40">
              © {new Date().getFullYear()} Makulayo. All rights reserved.
            </p>
            <div className="flex space-x-6 text-xs md:text-sm font-semibold tracking-wider">
              <a href="#" className="text-white/40 hover:text-brand-gold transition-colors">IG</a>
              <a href="#" className="text-white/40 hover:text-brand-gold transition-colors">X</a>
              <a href="#" className="text-white/40 hover:text-brand-gold transition-colors">FB</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
