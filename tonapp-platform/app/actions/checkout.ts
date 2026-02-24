"use server";

import { prisma } from "@/lib/db";
import { orderSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createOrderAction(formData: FormData) {
  const rawValues = Object.fromEntries(formData.entries());

  // Basic type conversion
  const values = {
    ...rawValues,
    quantity: Number(rawValues.quantity),
  };

  const parsed = orderSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten().fieldErrors };
  }

  const { customerName, customerPhone, deliveryAddress, paymentMethod, quantity } = parsed.data;
  const productId = rawValues.productId as string;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product) return { error: "Produit introuvable" };

    const totalAmount = product.price_xaf * BigInt(quantity);

    const order = await prisma.order.create({
      data: {
        shop: { connect: { id: product.shop_id } },
        product: { connect: { id: product.id } },
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        quantity: quantity,
        unit_price_xaf: product.price_xaf,
        total_amount_xaf: totalAmount,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "cash_on_delivery" ? "pending" : "pending", // Update later for MoMo
        fulfillment_status: "new",
      },
    });

    // In a real app, trigger payment request here for MoMo/OM

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order Creation Error:", error);
    return { error: "Erreur lors de la commande" };
  }
}
