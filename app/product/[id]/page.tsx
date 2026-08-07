import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import { Navbar } from "@/components/Navbar";
import { AddToCartButton } from "@/components/AddToCartButton";

export function generateStaticParams() {
  return products.map((p) => ({
    id: p.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-brand-void min-h-screen text-brand-ivory selection:bg-brand-gold/30 selection:text-brand-ivory flex flex-col">
      <Navbar />
      
      <div className="flex-1 mt-32 px-8 max-w-7xl mx-auto w-full">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          {/* Left: Image */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden crystal-glass p-12 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-contain drop-shadow-2xl transition-transform hover:scale-105 duration-700" 
                priority
              />
            </div>
          </div>
          
          {/* Right: Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-serif font-normal tracking-tight mb-2">{product.name}</h1>
            {product.tagline && (
              <p className="text-2xl font-serif font-light text-brand-gold mb-6 italic">{product.tagline}</p>
            )}
            
            <p className="text-xl text-brand-ivory-muted mb-12 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
            
            <div className="space-y-8 crystal-glass p-8 rounded-3xl">
              <h3 className="text-sm tracking-[0.2em] uppercase font-semibold text-brand-gold">Fragrance Architecture</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-brand-gold/60 mb-1">Top</p>
                  <p className="text-lg">{product.notes.top}</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-brand-gold/60 mb-1">Heart</p>
                  <p className="text-lg">{product.notes.heart}</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-brand-gold/60 mb-1">Base</p>
                  <p className="text-lg">{product.notes.base}</p>
                </div>
              </div>
            </div>
            
            <AddToCartButton product={product} />
          </div>
        </div>
        
        {/* Mock Reviews Section */}
        <div className="border-t border-white/5 pt-24 mb-32">
          <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight mb-16 text-center">Voices of the Few</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { author: "E.R.", rating: 5, text: "A masterpiece. It opens boldly and settles into something incredibly intimate. The sillage is unmatched." },
              { author: "M.K.", rating: 5, text: "I've stopped wearing anything else. It commands attention without having to shout. Truly exquisite." },
              { author: "A.J.", rating: 5, text: "The complexity of the heart notes is stunning. It evolves on the skin beautifully over 12 hours." }
            ].map((review, i) => (
              <div key={i} className="crystal-glass p-10 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex text-brand-gold mb-6 text-2xl gap-1">
                    {"★".repeat(review.rating)}
                  </div>
                  <p className="text-brand-ivory-muted italic text-lg mb-8 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                </div>
                <p className="font-medium tracking-[0.2em] text-sm uppercase text-brand-gold">{review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
