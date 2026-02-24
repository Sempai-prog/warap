import { prisma } from "@/lib/db";

export function generateMagicLinkSlug(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { magic_link_slug: slug },
    include: {
      shop: {
        select: {
          shop_name: true,
          whatsapp_number: true,
          delivery_zones: true,
          accepts_cash_on_delivery: true,
          momo_number: true,
          orange_money_number: true,
        },
      },
    },
  });
}
