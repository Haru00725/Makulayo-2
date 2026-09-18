"use client";

import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

// Fade + 12px rise, 400ms duration
export const revealVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1] as const
    } 
  },
};

// 80ms stagger
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

interface RevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  className?: string;
  delay?: number;
  style?: CSSProperties;
}

export function Reveal({ children, width = "100%", className = "", delay = 0, style }: RevealProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.4, 
            ease: [0.22, 1, 0.36, 1] as const,
            delay
          } 
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{ width, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function RevealGroup({ children, className = "", style }: RevealGroupProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function RevealItem({ children, className = "", style }: RevealItemProps) {
  return (
    <motion.div variants={revealVariant} className={className} style={style}>
      {children}
    </motion.div>
  );
}
