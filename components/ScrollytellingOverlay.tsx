"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { Product } from "@/lib/products";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ScrollytellingOverlayProps {
  progress: MotionValue<number>;
  featuredProduct: Product;
}

export function ScrollytellingOverlay({ progress, featuredProduct }: ScrollytellingOverlayProps) {
  // Hero (0 - 30%) - Fade away upward
  const heroOpacity = useTransform(progress, [0, 0.2, 0.3, 1], [1, 1, 0, 0]);
  const heroY = useTransform(progress, [0, 0.3, 1], [0, -150, -150]);

  // Notes (30% - 70%) - Come from down to up
  const notesOpacity = useTransform(progress, [0, 0.3, 0.35, 0.65, 0.7, 1], [0, 0, 1, 1, 0, 0]);
  const notesY = useTransform(progress, [0, 0.3, 0.35, 0.65, 0.7, 1], [100, 100, 0, 0, -100, -100]);

  // Spray (70% - 100%) - Come from down to up
  const sprayOpacity = useTransform(progress, [0, 0.7, 0.75, 0.95, 1], [0, 0, 1, 1, 0]);
  const sprayY = useTransform(progress, [0, 0.7, 0.75, 0.95, 1], [100, 100, 0, 0, -100]);

  // Particles & Strikes
  const [particles, setParticles] = useState<{id: number, size: number, left: number, top: number, duration: number, delay: number, yMove: number}[]>([]);
  const [strikes, setStrikes] = useState<{id: number, left: number, height: number, duration: number, delay: number, angle: number}[]>([]);

  useEffect(() => {
    setParticles([...Array(30)].map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 5,
      yMove: Math.random() * 150 + 50,
    })));

    setStrikes([...Array(6)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      height: Math.random() * 150 + 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 8,
      angle: Math.random() * 30 - 15, // slight random angle between -15 and +15 deg
    })));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Golden Particles Background */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-brand-gold shadow-[0_0_10px_2px_rgba(212,175,55,0.4)]"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [0, -p.yMove],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* Global Spotlight from Above */}
      <motion.div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[120vw] md:w-[800px] h-[60vh] z-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.25), transparent 70%)',
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Smooth Golden Strikes Background */}
      {strikes.map((s) => (
        <motion.div
          key={`strike-${s.id}`}
          className="absolute w-[1px] md:w-[2px] bg-gradient-to-b from-transparent via-brand-gold to-transparent mix-blend-screen"
          style={{
            left: `${s.left}%`,
            height: `${s.height}px`,
            rotate: `${s.angle}deg`,
          }}
          animate={{
            y: ['-100vh', '150vh'],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        />
      ))}

      {/* 1. Hero */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center mt-32 z-10"
      >
        <div className="relative inline-block mb-4">
          <h1 className="flex items-start text-4xl sm:text-5xl md:text-7xl lg:text-8xl relative overflow-visible pb-2 z-10">
            <span className="logo-text z-10 relative drop-shadow-lg">MAKULAYO</span>
            <sup className="text-sm sm:text-base md:text-2xl lg:text-3xl text-brand-gold ml-[2px] sm:ml-[4px] font-sans font-medium z-10 relative -top-[0.2em]">™</sup>
          </h1>
        </div>
        <p className="text-2xl md:text-4xl font-okine font-bold text-brand-ivory-muted mb-2 tracking-wide drop-shadow-md">
          UNSTOPABLE & UNSKIPABLE.
        </p>
      </motion.div>

      {/* 3. Notes & Architecture */}
      <motion.div
        style={{ opacity: notesOpacity, y: notesY }}
        className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-24 text-center z-10"
      >
        <div className="max-w-xl flex flex-col items-center">
          <h2 className="text-4xl md:text-7xl font-okine font-bold tracking-tight text-brand-ivory mb-12 drop-shadow-md">
            Three Layers.
          </h2>
          
          <div className="space-y-8 flex flex-col items-center">
            <div className="text-center">
              <p className="text-xs font-okine tracking-[0.3em] uppercase text-brand-gold mb-2 drop-shadow-sm">Top</p>
              <p className="text-lg md:text-2xl font-okine font-bold text-brand-ivory-muted drop-shadow-sm">Opens the room.</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-okine tracking-[0.3em] uppercase text-brand-gold mb-2 drop-shadow-sm">Heart</p>
              <p className="text-lg md:text-2xl font-okine font-bold text-brand-ivory-muted drop-shadow-sm">Stays for hours.</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-okine tracking-[0.3em] uppercase text-brand-gold mb-2 drop-shadow-sm">Base</p>
              <p className="text-lg md:text-2xl font-okine font-bold text-brand-ivory-muted drop-shadow-sm">Lingers on.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. The Spray */}
      <motion.div
        style={{ opacity: sprayOpacity, y: sprayY }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10"
      >
        <h2 className="text-5xl md:text-8xl font-okine font-bold tracking-tight text-brand-ivory mb-6 drop-shadow-md">
          One spray.
        </h2>
        <p className="text-2xl md:text-4xl text-brand-gold font-okine font-bold max-w-2xl drop-shadow-md">
          True elegance.
        </p>
      </motion.div>
    </div>
  );
}
