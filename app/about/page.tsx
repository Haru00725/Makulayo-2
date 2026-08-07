import { Navbar } from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="bg-brand-void min-h-screen text-brand-ivory-muted pt-32 pb-24 px-8">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-brand-gold mb-12 text-center">Our Philosophy</h1>
        
        <div className="space-y-12 text-lg leading-relaxed max-w-3xl mx-auto">
          <section className="text-center">
            <h2 className="text-3xl font-serif font-light text-brand-ivory mb-6">Crafted for those who notice.</h2>
            <p className="text-xl">In a world obsessed with mass production, Makulayo stands apart. We believe that true luxury lies in the details—the subtle shift of a heart note, the lingering memory of a base, the flawless geometry of a glass bottle.</p>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.15em] uppercase text-brand-gold font-semibold mb-4 border-b border-white/5 pb-2">The Rule of Five</h2>
            <p>We do not make fifty fragrances. We make five. By restricting our canvas, we force ourselves to achieve perfection. Each Makulayo scent is the result of hundreds of iterations, meticulously balanced until it speaks perfectly.</p>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.15em] uppercase text-brand-gold font-semibold mb-4 border-b border-white/5 pb-2">Uncompromising Ingredients</h2>
            <p>Our raw materials are sourced from the finest origins globally. From the rarest ouds to the most delicate floral absolutes, we spare no expense. We don't build perfumes to a budget; we build them to an emotion.</p>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.15em] uppercase text-brand-gold font-semibold mb-4 border-b border-white/5 pb-2">The Experience</h2>
            <p>Wearing Makulayo is an intimate experience that projects outward. It is a quiet confidence. One spray, and the whole room notices. Welcome to the few.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
