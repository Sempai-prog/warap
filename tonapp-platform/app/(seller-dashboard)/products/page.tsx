import { getProducts } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MotionContainer, MotionItem } from "@/components/motion/MotionWrapper";
import { Plus, Package, Edit2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Assuming cn is imported from here or similar

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-neutral-900">
            Mes Produits
          </h1>
          <p className="text-neutral-500 font-medium">
            Gérez votre inventaire avec style
          </p>
        </div>
        <Link href="/products/new">
          <Button className="rounded-2xl h-14 px-6 shadow-soft-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all active:scale-[0.98]">
            <Plus className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
        </Link>
      </header>

      {/* Grid des Produits Soft UI */}
      <MotionContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full py-20 text-center text-neutral-400 bg-white rounded-[2.5rem] border border-dashed border-neutral-200">
            <Package
              size={48}
              className="mx-auto mb-4 opacity-50 text-neutral-300"
            />
            <p className="font-bold text-lg text-neutral-500">Aucun produit</p>
            <p className="text-sm mt-1">
              Commencez par ajouter votre premier produit.
            </p>
          </div>
        ) : (
          products.map((product: any) => (
            <MotionItem
              key={product.id}
              className="group relative flex flex-col bg-white rounded-[2.5rem] border border-white/60 shadow-soft hover:shadow-soft-lg transition-all duration-300"
            >
              {/* Product Image Zone */}
              <div className="relative aspect-square w-full bg-neutral-50 p-2 overflow-hidden rounded-t-[2.5rem]">
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-inner">
                  <Image
                    src={
                      product.image_primary_url ||
                      "https://placehold.co/400x400"
                    }
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md",
                      product.stock_quantity > 0
                        ? "bg-white/80 text-green-600"
                        : "bg-red-500/90 text-white",
                    )}
                  >
                    {product.stock_quantity > 0
                      ? `${product.stock_quantity} en stock`
                      : "Rupture"}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-neutral-900 line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-neutral-900">
                      {Number(product.price_xaf).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      XAF
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-2xl border-neutral-100 hover:bg-neutral-50 font-bold text-sm text-neutral-600"
                    >
                      Modifier
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-2xl text-red-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </MotionItem>
          ))
        )}
      </MotionContainer>
    </div>
  );
}
