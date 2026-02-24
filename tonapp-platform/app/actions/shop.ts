"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { shopConfigSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateShopAction(formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { error: "Non autorisé. Veuillez vous connecter." };
    }

    const values = Object.fromEntries(formData.entries());

    // Handle checkbox for accepts_cash_on_delivery
    const acceptsCOD = formData.get("accepts_cash_on_delivery") === "on";

    const validatedFields = shopConfigSchema.safeParse({
        ...values,
        accepts_cash_on_delivery: acceptsCOD
    });

    if (!validatedFields.success) {
        return {
            error: "Données invalides. Veuillez vérifier le formulaire.",
            details: validatedFields.error.flatten().fieldErrors
        };
    }

    const {
        shopName, bio, primaryColor, whatsappNumber,
        momoNumber, orangeNumber
    } = validatedFields.data;

    try {
        const shop = await prisma.shop.findUnique({
            where: { seller_id: session.id }
        });

        if (!shop) {
            return { error: "Boutique non trouvée." };
        }

        await prisma.shop.update({
            where: { id: shop.id },
            data: {
                shop_name: shopName,
                bio_description: bio,
                primary_color: primaryColor,
                whatsapp_number: whatsappNumber,
                momo_number: momoNumber,
                orange_money_number: orangeNumber,
                accepts_cash_on_delivery: acceptsCOD
            }
        });

        revalidatePath("/settings");
        revalidatePath("/dashboard");

        return { success: true, message: "Boutique mise à jour avec succès !" };
    } catch (e: any) {
        console.error("Shop update error:", e);
        return { error: "Une erreur est survenue lors de la mise à jour." };
    }
}
