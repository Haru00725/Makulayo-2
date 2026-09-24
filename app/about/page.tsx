import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Philosophy | MAKULAYO",
  description: "Blended in India. IFRA-compliant Eau de Parfum crafted for those who notice.",
};

export default function AboutPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      <Navbar />
      <div
        className="max-w-3xl mx-auto px-5 md:px-8"
        style={{ paddingTop: "160px", paddingBottom: "var(--section-pad)" }}
      >
        <p
          className="text-center mb-6"
          style={{
            fontSize: "var(--eyebrow)",
            letterSpacing: "var(--tracking-eyebrow)",
            color: "var(--gold)",
          }}
        >
          OUR PHILOSOPHY
        </p>
        <h1
          className="text-center mb-16"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--display-lg)",
            letterSpacing: "var(--tracking-display-lg)",
          }}
        >
          CRAFTED FOR THOSE WHO NOTICE
        </h1>

        <div className="space-y-12" style={{ maxWidth: "62ch", margin: "0 auto" }}>
          <section>
            <p style={{ fontSize: "var(--body-lg)", lineHeight: 1.7, color: "var(--text-muted)" }}>
              In a world of mass production, Makulayo stands apart. We believe true excellence lies in the details — the subtle shift of a heart note, the lingering memory of a base, the way a fragrance evolves on your skin over eight to twelve hours.
            </p>
          </section>

          <section>
            <h2
              className="mb-4 pb-3"
              style={{
                fontSize: "var(--eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                color: "var(--gold)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              THE FORMULATION
            </h2>
            <p style={{ fontSize: "var(--body-lg)", lineHeight: 1.7, color: "var(--text-muted)" }}>
              Eau de Parfum concentration — the highest we offer — for longevity that lasts from morning to midnight. Every formulation is IFRA-compliant, phthalate-free, and cruelty-free. We source raw materials for their quality, not their cost. No shortcuts, no synthetics-for-the-sake-of-synthetics.
            </p>
          </section>

          <section>
            <h2
              className="mb-4 pb-3"
              style={{
                fontSize: "var(--eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                color: "var(--gold)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              BLENDED IN INDIA
            </h2>
            <p style={{ fontSize: "var(--body-lg)", lineHeight: 1.7, color: "var(--text-muted)" }}>
              Every Makulayo fragrance is formulated and bottled in India. We work directly with our blending house to maintain complete control over quality, from raw material to finished bottle.
            </p>
          </section>

          <section>
            <h2
              className="mb-4 pb-3"
              style={{
                fontSize: "var(--eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                color: "var(--gold)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              THE EXPERIENCE
            </h2>
            <p style={{ fontSize: "var(--body-lg)", lineHeight: 1.7, color: "var(--text-muted)" }}>
              Wearing Makulayo is an intimate experience that projects outward. A quiet confidence. One spray, and the room notices. Welcome to the few.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
