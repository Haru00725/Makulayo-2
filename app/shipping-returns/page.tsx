import { Navbar } from "@/components/Navbar";

export default function ShippingReturnsPage() {
  return (
    <main className="bg-brand-void min-h-screen text-brand-ivory-muted pt-32 pb-24 px-8">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-brand-gold mb-8">Shipping & Returns</h1>
        
        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className="text-lg tracking-[0.15em] uppercase text-brand-ivory font-semibold mb-4">Shipping Policy</h2>
            <p className="mb-4">We offer complimentary standard shipping on all orders over ₹999. Orders are processed within 1-2 business days.</p>
            <ul className="list-disc pl-6 space-y-2 text-brand-ivory/80">
              <li>Standard Shipping (5-7 business days): ₹99 (Free over ₹999)</li>
              <li>Express Shipping (2-3 business days): ₹249</li>
              <li>Overnight Delivery: ₹499</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.15em] uppercase text-brand-ivory font-semibold mb-4">5-Day Return Policy</h2>
            <p className="mb-4">Because fragrances are a highly personal and intimate product, we maintain a strict <span className="text-brand-gold font-semibold">5-day return policy</span> to ensure the integrity of our inventory.</p>
            <p className="mb-4">If you are unsatisfied with your purchase, you must initiate a return within 5 days of the delivery date. To be eligible for a return, the item must be unused, in the same condition that you received it, and in its original packaging with the cellophane seal intact.</p>
            <p>If you have opened the fragrance, we unfortunately cannot accept a return due to hygiene and quality control standards. We highly recommend purchasing our Discovery Set if you are unsure which Makulayo scent is right for you.</p>
          </section>

          <section>
            <h2 className="text-lg tracking-[0.15em] uppercase text-brand-ivory font-semibold mb-4">How to Return</h2>
            <p>To start a return, please contact our Client Care team with your order number. If your return is accepted, we will send you a return shipping label, as well as instructions on how and where to send your package.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
