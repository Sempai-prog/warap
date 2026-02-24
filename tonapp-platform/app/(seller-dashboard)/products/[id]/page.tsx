import { getProduct } from "@/app/actions/products";
import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Modifier Produit</h1>
      </header>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm">
        <ProductForm initialData={product} isEditing />
      </div>
    </div>
  );
}
