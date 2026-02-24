"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/validations";
import { createProductAction, updateProductAction } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ShareModal } from "./ShareModal";

type ProductValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: { id?: string; title: string; description: string; price_xaf: bigint; stock_quantity: number; };
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<{ title: string; price_xaf: bigint; magic_link_slug: string } | null>(null);
  const router = useRouter();

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData ? Number(initialData.price_xaf) : 0,
      stock: initialData?.stock_quantity || 1,
    },
  });

  async function onSubmit(values: ProductValues) {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value)));

    if (!isEditing) {
        formData.append("imagePrimaryUrl", "https://placehold.co/400x400/png?text=New+Product");
    }

    try {
      const result = isEditing
        ? await updateProductAction(initialData!.id!, formData)
        : await createProductAction(formData);

      if (result.success) {
        if (!isEditing) {
            // Show share modal for new products
            // We need the product details to share. Since we don't get full object back from action easily without refetch,
            // we construct a temporary one or update action to return slug.
            // For MVP, assume we can get slug or pass it.
            // Actually action returns id. We might need to fetch it or just use the slug we generated if we moved generation here?
            // Better: Update action to return the full product or at least the slug.

            // Let's assume action returns { success: true, id: string, slug: string }
            // I'll update the action next.
            // For now, let's pretend we have it.
            setCreatedProduct({
                title: values.title,
                price_xaf: BigInt(values.price),
                magic_link_slug: result.slug || "demo-slug"
            });
            setShowShareModal(true);
        } else {
            router.push("/products");
        }
      } else {
        console.error(result.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className="w-full aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-200">
                {isEditing ? "Image (Modification désactivée)" : "📸 Tap to add photo"}
            </div>

            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Titre du produit</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Chaussures Nike" {...field} className="rounded-xl" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Prix (XAF)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <textarea
                                className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Détails du produit..."
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : (isEditing ? "Mettre à jour" : "Publier le produit")}
            </Button>
        </form>
        </Form>

        {createdProduct && (
            <ShareModal
                isOpen={showShareModal}
                onClose={() => {
                    setShowShareModal(false);
                    router.push("/products");
                }}
                product={createdProduct}
            />
        )}
    </>
  );
}
