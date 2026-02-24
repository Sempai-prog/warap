"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getOrders(statusFilter?: string) {
  const session = await getSession();
  if (!session) return [];

  const whereClause: Prisma.OrderWhereInput = { shop: { seller_id: session.id } };

  if (statusFilter && statusFilter !== "all") {
    // Map tab names to fulfillment_status
    // Tabs: new, preparing, delivery, delivered, cancelled
    // DB statuses: new, preparing, in_delivery, delivered, cancelled
    const statusMap: Record<string, string> = {
      new: "new",
      preparing: "preparing",
      delivery: "in_delivery",
      delivered: "delivered",
      cancelled: "cancelled"
    };
    if (statusMap[statusFilter]) {
        whereClause.fulfillment_status = statusMap[statusFilter];
    }
  }

  return await prisma.order.findMany({
    where: whereClause,
    orderBy: { created_at: "desc" },
    include: { product: true },
  });
}

export async function getOrder(id: string) {
  const session = await getSession();
  if (!session) return null;

  return await prisma.order.findUnique({
    where: { id, shop: { seller_id: session.id } },
    include: { product: true },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  try {
    await prisma.order.update({
      where: { id, shop: { seller_id: session.id } },
      data: { fulfillment_status: status },
    });
    revalidatePath("/orders");
    revalidatePath(`/orders/${id}`);
    return { success: true };
  } catch (error) {
    return { error: "Erreur de mise à jour" };
  }
}
