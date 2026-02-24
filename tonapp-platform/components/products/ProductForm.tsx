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

type ProductValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: { id?: string; title: string; description: string; price_xaf: bigint; stock_quantity: number; };
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData ? Number(initialData.price_xaf) : 0,
      stock: initialData?.stock_quantity || 1,
      // category: initialData?.category_id || "",
    },
  });

  async function onSubmit(values: ProductValues) {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value)));

    // Pass image url if creating (mocked)
    if (!isEditing) {
        formData.append("imagePrimaryUrl", "https://placehold.co/400x400/png?text=New+Product");
    }

    try {
      const result = isEditing
        ? await updateProductAction(initialData.id, formData)
        : await createProductAction(formData);

      if (result.success) {
        router.push("/products");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Image Placeholder */}
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
  );
}
