import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import { ProductPageClient } from "@/components/ProductPageClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  return products.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — ${product.size} ${product.type} | MAKULAYO®`,
    description: `${product.tagline || ""} ${product.family || ""}. ${product.size} ${product.type}. ₹1,499.`.trim(),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Get related products (exclude current, take first 3)
  const relatedProducts = products.filter((p) => p.id !== id).slice(0, 3);

  return (
    <>
      {/* Product JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `MAKULAYO ${product.name}`,
            description: product.description.split("\n\n")[0],
            image: `https://makulayo.com${product.image}`,
            brand: {
              "@type": "Brand",
              name: "MAKULAYO",
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: "1499",
              availability: "https://schema.org/InStock",
              url: `https://makulayo.com/product/${product.id}`,
            },
          }),
        }}
      />
      <ProductPageClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
