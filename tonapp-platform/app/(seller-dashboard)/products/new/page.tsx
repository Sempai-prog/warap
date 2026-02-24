import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Nouveau Produit</h1>
      </header>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm">
        <ProductForm />
      </div>
    </div>
  );
}
