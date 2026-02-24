import { getProducts } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes Produits</h1>
        <Link href="/products/new">
          <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {products.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            Aucun produit pour le moment.
          </div>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="p-4 flex gap-4 overflow-hidden">
              <div className="relative h-24 w-24 flex-shrink-0 bg-neutral-100 rounded-xl overflow-hidden">
                <Image
                  src={product.image_primary_url || "https://placehold.co/200x200"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                  <p className="text-sm text-neutral-500 font-medium">
                    {Number(product.price_xaf).toLocaleString()} XAF
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.stock_quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {product.stock_quantity > 0 ? `Stock: ${product.stock_quantity}` : "Rupture"}
                  </span>
                  <Link href={`/products/${product.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
