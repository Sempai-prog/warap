"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/validations";
import {
  createProductAction,
  updateProductAction,
} from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { Camera, Trash2, LayoutGrid, Tag, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
=======
import { ShareModal } from "./ShareModal";
>>>>>>> 4ae0c77f508c4378c5534f19c5b0ce9e35673d06

type ProductValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    price_xaf: bigint;
    stock_quantity: number;
  };
  isEditing?: boolean;
}

export function ProductForm({
  initialData,
  isEditing = false,
}: ProductFormProps) {
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
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, String(value)),
    );

    if (!isEditing) {
      formData.append(
        "imagePrimaryUrl",
        "https://placehold.co/400x400/png?text=New+Product",
      );
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
<<<<<<< HEAD
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Premium Image Upload Placeholder */}
        <div className="space-y-3">
          <Label className="text-small font-bold uppercase tracking-wider text-neutral-400 ml-1">
            Photo du produit
          </Label>
          <div className="group relative w-full aspect-[4/3] bg-white rounded-[2.5rem] flex flex-col items-center justify-center text-neutral-400 border border-white/60 shadow-soft hover:shadow-soft-lg transition-all cursor-pointer overflow-hidden p-2">
            <div className="w-full h-full rounded-[2rem] bg-neutral-50/50 flex flex-col items-center justify-center border-2 border-dashed border-neutral-100 group-hover:bg-neutral-50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera size={32} className="text-primary" />
              </div>
              <span className="font-bold text-neutral-900">
                Ajouter une photo
              </span>
              <span className="text-xs font-medium text-neutral-400 mt-1">
                Format recommandé: 800x600
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white rounded-[2.5rem] border border-white/60 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-2">
            <div className="p-2 bg-blue-card rounded-xl text-blue-text">
              <Tag size={20} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Informations de base
            </h3>
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400 ml-1">
                  Titre du produit
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Chaussures Nike"
                    {...field}
                    className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-14"
                  />
                </FormControl>
                <FormMessage className="text-tiny font-medium" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400 ml-1">
                    Prix (XAF)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-14 font-black text-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-tiny font-medium" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400 ml-1">
                    Stock
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-14 font-black text-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-tiny font-medium" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="p-8 bg-white rounded-[2.5rem] border border-white/60 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-2">
            <div className="p-2 bg-mint-card rounded-xl text-mint-text">
              <LayoutGrid size={20} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              Détails & Description
            </h3>
          </div>

          <FormField
=======
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className="w-full aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-200">
                {isEditing ? "Image (Modification désactivée)" : "📸 Tap to add photo"}
            </div>

            <FormField
>>>>>>> 4ae0c77f508c4378c5534f19c5b0ce9e35673d06
            control={form.control}
            name="title"
            render={({ field }) => (
<<<<<<< HEAD
              <FormItem className="space-y-2">
                <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400 ml-1">
                  Description
                </FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[160px] w-full rounded-[2rem] border border-neutral-100 bg-neutral-50/50 px-4 py-3 text-sm ring-offset-background placeholder:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                    placeholder="Détails du produit, caractéristiques..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-tiny font-medium" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-16 rounded-[2rem] text-lg font-bold shadow-soft-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-all active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Publication...
            </div>
          ) : isEditing ? (
            "Enregistrer les modifications"
          ) : (
            "Publier le produit"
          )}
        </Button>
      </form>
    </Form>
=======
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
>>>>>>> 4ae0c77f508c4378c5534f19c5b0ce9e35673d06
  );
}
