"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getProducts(status?: string) {
  const session = await getSession();
  if (!session) return [];

  const whereClause: Prisma.ProductWhereInput = { shop: { seller_id: session.id } };
  if (status) {
    whereClause.status = status;
  } else {
    // Default to show all except archived if not specified, or just all?
    // Let's return all for list
    whereClause.status = { not: "archived" };
  }

  return await prisma.product.findMany({
    where: whereClause,
    orderBy: { created_at: "desc" },
  });
}

export async function getProduct(id: string) {
  const session = await getSession();
  if (!session) return null;

  return await prisma.product.findUnique({
    where: { id, shop: { seller_id: session.id } },
  });
}

export async function createProductAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const rawValues = Object.fromEntries(formData.entries());

  // Clean up price and stock
  const cleanValues = {
    ...rawValues,
    price: Number(rawValues.price),
    stock: Number(rawValues.stock),
  };

  const parsed = productSchema.safeParse(cleanValues);

  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten().fieldErrors };
  }

  const { title, description, price, stock, category } = parsed.data;
  // Handle image upload mock
  const imagePrimaryUrl = (rawValues.imagePrimaryUrl as string) || "https://placehold.co/400x400/png?text=Product";

  try {
    // Generate magic link slug
    const magicLinkSlug = Math.random().toString(36).substring(2, 10);

    const product = await prisma.product.create({
      data: {
        shop: { connect: { seller_id: session.id } },
        title,
        description,
        price_xaf: BigInt(price),
        stock_quantity: stock,
        status: "published", // Auto-publish for MVP simplicity
        image_primary_url: imagePrimaryUrl,
        magic_link_slug: magicLinkSlug,
        // category connection logic if category is UUID, but spec says simple string for AI?
        // Schema has category_id. For MVP, we might need to find/create category.
        // Let's skip category relation for now or assume category is a string ID if passed.
        // If category is a name, we might need to handle it.
      },
    });

    revalidatePath("/products");
    return { success: true, id: product.id };
  } catch (error) {
    console.error("Create Product Error:", error);
    return { error: "Erreur lors de la création" };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const rawValues = Object.fromEntries(formData.entries());
  const cleanValues = {
    ...rawValues,
    price: Number(rawValues.price),
    stock: Number(rawValues.stock),
  };

  const parsed = productSchema.safeParse(cleanValues);
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten().fieldErrors };
  }

  const { title, description, price, stock } = parsed.data;

  try {
    await prisma.product.update({
      where: { id, shop: { seller_id: session.id } },
      data: {
        title,
        description,
        price_xaf: BigInt(price),
        stock_quantity: stock,
      },
    });
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteProductAction(id: string) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  try {
    await prisma.product.update({
      where: { id, shop: { seller_id: session.id } },
      data: { status: "archived" },
    });
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la suppression" };
  }
}
