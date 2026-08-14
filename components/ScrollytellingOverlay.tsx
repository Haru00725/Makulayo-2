"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { Product } from "@/lib/products";

interface ScrollytellingOverlayProps {
  progress: MotionValue<number>;
  featuredProduct: Product;
}

export function ScrollytellingOverlay({ progress, featuredProduct }: ScrollytellingOverlayProps) {
  // Hero (0 - 30%)
  const heroOpacity = useTransform(progress, [0, 0.2, 0.3, 1], [1, 1, 0, 0]);
  const heroY = useTransform(progress, [0, 0.3, 1], [0, -50, -50]);

  // Notes (30% - 70%)
  const notesOpacity = useTransform(progress, [0, 0.3, 0.35, 0.65, 0.7, 1], [0, 0, 1, 1, 0, 0]);
  const notesX = useTransform(progress, [0, 0.3, 0.35, 1], [-50, -50, 0, 0]);

  // Spray (70% - 100%)
  const sprayOpacity = useTransform(progress, [0, 0.7, 0.75, 0.95, 1], [0, 0, 1, 1, 0]);
  const sprayY = useTransform(progress, [0, 0.7, 0.75, 1], [30, 30, 0, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* 1. Hero */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center mt-32"
      >
        <h1 className="flex items-start text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-4">
          <span className="logo-text">MAKULAYO</span><span className="text-sm sm:text-base md:text-2xl lg:text-3xl text-brand-gold ml-1 sm:ml-2 mt-1 sm:mt-2 font-sans font-medium">™</span>
        </h1>
        <p className="text-xl md:text-2xl font-serif font-light text-brand-ivory-muted mb-2">
          Crafted for those who notice.
        </p>
        <p className="text-sm md:text-base text-brand-ivory-muted/70 tracking-[0.2em] uppercase">
          Exquisite Eau de Parfums. No compromises.
        </p>
      </motion.div>



      {/* 3. Notes & Architecture */}
      <motion.div
        style={{ opacity: notesOpacity, x: notesX }}
        className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-24 text-left"
      >
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-serif font-normal tracking-tight text-brand-ivory mb-8 leading-tight">
            Built in three layers,<br />not one.
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-brand-gold mb-1">Top</p>
              <p className="text-lg text-brand-ivory-muted">A top note that opens the room.</p>
              <p className="text-md text-brand-ivory mt-1">{featuredProduct.notes.top}</p>
            </div>
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-brand-gold mb-1">Heart</p>
              <p className="text-lg text-brand-ivory-muted">A heart that stays for hours.</p>
              <p className="text-md text-brand-ivory mt-1">{featuredProduct.notes.heart}</p>
            </div>
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-brand-gold mb-1">Base</p>
              <p className="text-lg text-brand-ivory-muted">A base that lingers after you've left.</p>
              <p className="text-md text-brand-ivory mt-1">{featuredProduct.notes.base}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. The Spray */}
      <motion.div
        style={{ opacity: sprayOpacity, y: sprayY }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
      >
        <h2 className="text-4xl md:text-6xl font-serif font-normal tracking-tight text-brand-ivory mb-6">
          One spray. The whole room notices.
        </h2>
        <p className="text-xl text-brand-ivory-muted max-w-2xl">
          Wear it once and you'll understand true luxury.
        </p>
      </motion.div>
    </div>
  );
}
