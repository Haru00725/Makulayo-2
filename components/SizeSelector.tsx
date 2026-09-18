"use client";

interface SizeSelectorProps {
  sizes: { label: string; value: string; available: boolean }[];
  selected: string;
  onChange: (value: string) => void;
}

export function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
  return (
    <div className="flex gap-3">
      {sizes.map((size) => (
        <button
          key={size.value}
          onClick={() => size.available && onChange(size.value)}
          disabled={!size.available}
          className="py-3 px-6 transition-all duration-200 min-w-[80px]"
          style={{
            border: selected === size.value
              ? "1px solid var(--gold)"
              : "1px solid var(--border)",
            background: selected === size.value
              ? "var(--gold-glow)"
              : "transparent",
            color: !size.available
              ? "var(--text-faint)"
              : selected === size.value
                ? "var(--gold)"
                : "var(--text-muted)",
            fontSize: "var(--caption)",
            letterSpacing: "0.04em",
            opacity: size.available ? 1 : 0.4,
            cursor: size.available ? "pointer" : "not-allowed",
          }}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
}
