import { Navbar } from "@/components/Navbar";

export default function FAQPage() {
  return (
    <main className="bg-brand-void min-h-screen text-brand-ivory-muted pt-32 pb-24 px-8">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-brand-gold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className="text-xl text-brand-ivory font-semibold mb-2">How long do Makulayo fragrances last?</h2>
            <p>Our Eau de Parfums are formulated with a high concentration of premium oils. You can expect the scent to linger beautifully on the skin for 8 to 12 hours, and even longer on clothing.</p>
          </section>

          <section>
            <h2 className="text-xl text-brand-ivory font-semibold mb-2">Are your fragrances cruelty-free?</h2>
            <p>Yes. Makulayo is fiercely committed to ethical practices. We do not test our products or ingredients on animals, and we work exclusively with suppliers who share this standard.</p>
          </section>

          <section>
            <h2 className="text-xl text-brand-ivory font-semibold mb-2">Do you offer international shipping?</h2>
            <p>We currently ship across India with free standard delivery on orders over ₹1999. We are actively working on expanding our international shipping capabilities to bring Makulayo to more fragrance enthusiasts worldwide.</p>
          </section>

          <section>
            <h2 className="text-xl text-brand-ivory font-semibold mb-2">Can I purchase a sample before committing to a full bottle?</h2>
            <p>Absolutely. We offer a Discovery Set that includes all five of our signature scents, allowing you to experience the full Makulayo collection on your skin before making a choice.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
