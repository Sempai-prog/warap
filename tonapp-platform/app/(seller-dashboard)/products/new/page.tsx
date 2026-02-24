import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/products">
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-2xl bg-white shadow-soft hover:bg-neutral-50 border border-white/60"
          >
            <ArrowLeft className="h-6 w-6 text-neutral-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Nouveau Produit
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            Capturez l'attention de vos clients
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        <ProductForm />
      </div>
    </div>
  );
}
