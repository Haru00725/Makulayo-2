"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left transition-colors"
            style={{
              fontSize: "var(--eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              color: openIndex === i ? "var(--gold)" : "var(--text-muted)",
            }}
            aria-expanded={openIndex === i}
          >
            {item.title}
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className="transition-transform"
              style={{
                transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                transitionDuration: "var(--duration)",
              }}
            />
          </button>
          <div
            className="overflow-hidden transition-all"
            style={{
              maxHeight: openIndex === i ? "500px" : "0",
              transitionDuration: "var(--duration-slow)",
              transitionTimingFunction: "var(--ease)",
            }}
          >
            <div className="pb-4" style={{ fontSize: "var(--body)", color: "var(--text-muted)", lineHeight: 1.7 }}>
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
