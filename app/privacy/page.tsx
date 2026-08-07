import { Navbar } from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <main className="bg-brand-void min-h-screen text-brand-ivory-muted pt-32 pb-24 px-8">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-gold mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl text-brand-ivory font-semibold mb-4">1. Information We Collect</h2>
            <p>At Makulayo, we collect information that you provide directly to us, such as when you create an account, make a purchase, or sign up for our newsletter. This includes your name, email address, shipping address, and payment details.</p>
          </section>

          <section>
            <h2 className="text-2xl text-brand-ivory font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to process your orders, provide customer support, and send you updates about new collections and exclusive offers. We never sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl text-brand-ivory font-semibold mb-4">3. Data Security</h2>
            <p>We employ industry-standard security measures to protect your personal information during transmission and storage. All payment information is encrypted and processed securely.</p>
          </section>

          <section>
            <h2 className="text-2xl text-brand-ivory font-semibold mb-4">4. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time. If you wish to exercise these rights, please contact our Client Care team.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
