"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { Product } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

const PARTICLES = [
  { left: "10%", top: "20%", size: 3, delay: 0, duration: 8, yOffset: -80 },
  { left: "85%", top: "15%", size: 2, delay: 2, duration: 6, yOffset: -60 },
  { left: "50%", top: "40%", size: 4, delay: 1, duration: 10, yOffset: -120 },
  { left: "30%", top: "70%", size: 2, delay: 3, duration: 7, yOffset: -50 },
  { left: "75%", top: "60%", size: 3, delay: 0.5, duration: 9, yOffset: -90 },
  { left: "20%", top: "85%", size: 1.5, delay: 4, duration: 5, yOffset: -40 },
  { left: "60%", top: "80%", size: 2.5, delay: 1.5, duration: 8, yOffset: -70 },
  { left: "90%", top: "90%", size: 3, delay: 2.5, duration: 11, yOffset: -100 },
  { left: "5%", top: "50%", size: 2, delay: 3.5, duration: 6, yOffset: -50 },
  { left: "45%", top: "10%", size: 1.5, delay: 1.2, duration: 7, yOffset: -60 },
  { left: "65%", top: "30%", size: 3, delay: 4.5, duration: 9, yOffset: -80 },
  { left: "40%", top: "90%", size: 2, delay: 2.2, duration: 8, yOffset: -70 },
];

interface ScrollytellingOverlayProps {
  progress: MotionValue<number>;
  featuredProduct: Product;
}

export function ScrollytellingOverlay({ progress, featuredProduct }: ScrollytellingOverlayProps) {
  // Hero (0 - 30%) - Fade away upward
  const heroOpacity = useTransform(progress, [0, 0.2, 0.3, 1], [1, 1, 0, 0]);
  const heroY = useTransform(progress, [0, 0.3, 1], [0, -80, -80]);

  // Three Layers (30% - 70%) - Come from down to up
  const notesOpacity = useTransform(progress, [0, 0.3, 0.35, 0.65, 0.7, 1], [0, 0, 1, 1, 0, 0]);
  const notesY = useTransform(progress, [0, 0.3, 0.35, 0.65, 0.7, 1], [40, 40, 0, 0, -40, -40]);

  // Final statement (70% - 100%)
  const sprayOpacity = useTransform(progress, [0, 0.7, 0.75, 0.95, 1], [0, 0, 1, 1, 0]);
  const sprayY = useTransform(progress, [0, 0.7, 0.75, 0.95, 1], [40, 40, 0, 0, -40]);

  return (
    <div className="absolute inset-0 z-10" style={{ pointerEvents: "none" }}>
      {/* Golden Particle Gradient Background */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1, overflow: 'hidden' }}>
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, var(--gold-glow) 0%, transparent 50%)',
            opacity: 0.4,
          }}
        />
        {PARTICLES.map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: "var(--gold)",
              left: p.left,
              top: p.top,
              boxShadow: "0 0 8px 1px var(--gold)",
            }}
            animate={{
              y: [0, p.yOffset],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* 1. Hero */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-10"
      >
        <h1 className="mb-4">
          <Image
            src="/logo-makulayo.png"
            alt="MAKULAYO™"
            width={600}
            height={120}
            className="w-[320px] md:w-[560px] lg:w-[720px] h-auto object-contain mx-auto"
            priority
          />
        </h1>
        <p
          className="mb-8"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--display-md)",
            letterSpacing: "var(--tracking-display-md)",
            color: "var(--text-muted)",
          }}
        >
          THREE LAYERS. ONE SIGNATURE.
        </p>
        <Link
          href="/#collection"
          className="inline-block transition-all"
          style={{
            pointerEvents: "auto",
            border: "1px solid var(--gold-dim)",
            background: "transparent",
            color: "var(--gold)",
            fontSize: "var(--eyebrow)",
            letterSpacing: "var(--tracking-eyebrow)",
            fontFamily: "var(--font-body)",
            padding: "12px 32px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gold)";
            e.currentTarget.style.background = "var(--gold-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--gold-dim)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          EXPLORE THE COLLECTION
        </Link>

        {/* Scroll cue */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 scroll-cue">
          <div
            className="w-[1px] h-10 mx-auto"
            style={{ background: "var(--gold)" }}
          />
        </div>
      </motion.div>

      {/* 2. Three Layers — Educational */}
      <motion.div
        style={{ opacity: notesOpacity, y: notesY }}
        className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-24 text-center z-10"
      >
        <div className="w-full max-w-4xl">
          <p
            className="mb-12"
            style={{
              fontSize: "var(--eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              color: "var(--gold)",
              fontFamily: "var(--font-body)",
            }}
          >
            FRAGRANCE ARCHITECTURE
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            {[
              { label: "TOP", desc: "Opens the room.", time: "First 15 minutes" },
              { label: "HEART", desc: "Stays for hours.", time: "2 – 4 hours" },
              { label: "BASE", desc: "Lingers on.", time: "6+ hours" },
            ].map((layer, i) => (
              <div
                key={layer.label}
                className="flex flex-col items-center px-8"
                style={{
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                }}
              >
                <p
                  className="mb-3"
                  style={{
                    fontSize: "var(--eyebrow)",
                    letterSpacing: "var(--tracking-eyebrow)",
                    color: "var(--gold)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {layer.label}
                </p>
                <p
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--display-md)",
                    letterSpacing: "var(--tracking-display-md)",
                    color: "var(--text)",
                  }}
                >
                  {layer.desc}
                </p>
                <p
                  style={{
                    fontSize: "var(--caption)",
                    color: "var(--text-faint)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {layer.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3. Closing Statement */}
      <motion.div
        style={{ opacity: sprayOpacity, y: sprayY }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10"
      >
        <p
          className="mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--display-lg)",
            letterSpacing: "var(--tracking-display-lg)",
            color: "var(--text)",
          }}
        >
          FOR THOSE WHO NOTICE.
        </p>
      </motion.div>
    </div>
  );
}
