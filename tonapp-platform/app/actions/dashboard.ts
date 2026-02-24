"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getDashboardMetrics() {
  const session = await getSession();
  if (!session) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    salesToday,
    newOrdersCount,
    recentOrders,
    seller
  ] = await Promise.all([
    // Sales Today
    prisma.order.aggregate({
      where: {
        shop: { seller_id: session.id },
        created_at: { gte: today },
        payment_status: "confirmed",
      },
      _sum: { total_amount_xaf: true },
    }),
    // New Orders Count
    prisma.order.count({
      where: {
        shop: { seller_id: session.id },
        fulfillment_status: "new",
      },
    }),
    // Recent Orders (Limit 5)
    prisma.order.findMany({
      where: { shop: { seller_id: session.id } },
      orderBy: { created_at: "desc" },
      take: 5,
      include: { product: { select: { title: true } } },
    }),
    // Seller Info
    prisma.seller.findUnique({
      where: { id: session.id },
      select: { first_name: true },
    }),
  ]);

  return {
    salesToday: Number(salesToday._sum.total_amount_xaf || 0),
    newOrdersCount,
    recentOrders,
    firstName: seller?.first_name || "Vendeur",
  };
}
