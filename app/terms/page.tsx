import { Navbar } from "@/components/Navbar";

export default function TermsPage() {
  return (
    <main className="bg-brand-void min-h-screen text-brand-ivory-muted pt-32 pb-24 px-8">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-gold mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl text-brand-ivory font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using the Makulayo website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-2xl text-brand-ivory font-semibold mb-4">2. Products and Pricing</h2>
            <p>All products are subject to availability. We reserve the right to modify prices or discontinue products at any time without notice. We make every effort to display the colors and details of our fragrances accurately.</p>
          </section>

          <section>
            <h2 className="text-2xl text-brand-ivory font-semibold mb-4">3. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, images, and software, is the property of Makulayo and is protected by copyright and other intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-2xl text-brand-ivory font-semibold mb-4">4. Limitation of Liability</h2>
            <p>Makulayo shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or services.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
