import { getProductBySlug } from "@/lib/magic-link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckoutSheet } from "@/components/checkout/CheckoutSheet";

export default async function PublicProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Section */}
      <div className="relative w-full aspect-square md:aspect-video bg-neutral-100">
        <Image
          src={product.image_primary_url || "https://placehold.co/600x600"}
          alt={product.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          1/1
        </div>
      </div>

      {/* Product Info */}
      <div className="px-5 py-6 space-y-6 max-w-lg mx-auto">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold leading-tight text-neutral-900">
            {product.title}
          </h1>
          <p className="text-3xl font-extrabold text-primary-600">
            {Number(product.price_xaf).toLocaleString()} <span className="text-lg text-neutral-500 font-medium">XAF</span>
          </p>
        </div>

        {/* Trust Signals */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          <Badge variant="secondary" className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 font-normal">
            ⭐ 4.9 (12 avis)
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 font-normal">
            🔥 Vendu 24 fois
          </Badge>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Description</h3>
          <p className="text-neutral-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"}`} />
          <span className={product.stock_quantity > 0 ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
            {product.stock_quantity > 0 ? "En Stock" : "Rupture de stock"}
          </span>
        </div>

        {/* Seller Micro-Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
            {product.shop.shop_name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{product.shop.shop_name}</p>
            <p className="text-xs text-neutral-500">Vendeur Vérifié</p>
          </div>
          <a
            href={`https://wa.me/${product.shop.whatsapp_number.replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
              Discuter
            </Button>
          </a>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-neutral-200 z-50">
        <div className="max-w-lg mx-auto">
          <CheckoutSheet product={product} />
        </div>
      </div>
    </div>
  );
}
