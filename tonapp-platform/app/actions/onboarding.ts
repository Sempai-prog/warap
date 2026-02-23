"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  onboardingIdentitySchema,
  onboardingDesignSchema,
  onboardingBusinessSchema,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateIdentityAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const values = Object.fromEntries(formData.entries());
  const parsed = onboardingIdentitySchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten().fieldErrors };
  }

  const { shopName, bio, logoUrl, bannerUrl } = parsed.data;

  try {
    await prisma.shop.update({
      where: { seller_id: session.id },
      data: {
        shop_name: shopName,
        bio_description: bio,
        logo_url: logoUrl || null,
        banner_url: bannerUrl || null,
      },
    });
    revalidatePath("/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Update Identity Error:", error);
    return { error: "Erreur lors de la mise à jour" };
  }
}

export async function updateDesignAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const values = Object.fromEntries(formData.entries());
  const parsed = onboardingDesignSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten().fieldErrors };
  }

  const { primaryColor, typographyStyle, layoutType } = parsed.data;

  try {
    await prisma.shop.update({
      where: { seller_id: session.id },
      data: {
        primary_color: primaryColor,
        typography_style: typographyStyle,
        layout_type: layoutType,
      },
    });
    revalidatePath("/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Update Design Error:", error);
    return { error: "Erreur lors de la mise à jour" };
  }
}

export async function updateBusinessAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const rawValues: any = Object.fromEntries(formData.entries());

  // Handle checkbox (it's "on" if checked, missing if not)
  // But wait, if it's controlled by React Hook Form and sent via FormData,
  // we might need to be careful. Typically checkboxes send "on" or nothing.
  // However, if we construct FormData manually or use native form submission, this applies.
  // We'll rely on the schema coercion if possible or manual handling.

  // Assuming the client sends "true" or "false" string for acceptsCod if using hidden input or controlled form
  if (rawValues.acceptsCod === "on") rawValues.acceptsCod = true;
  if (rawValues.acceptsCod === undefined) rawValues.acceptsCod = false;
  // If sent as string "true"/"false"
  if (rawValues.acceptsCod === "true") rawValues.acceptsCod = true;
  if (rawValues.acceptsCod === "false") rawValues.acceptsCod = false;

  // JSON parsing
  if (typeof rawValues.deliveryZones === 'string') {
    try {
      rawValues.deliveryZones = JSON.parse(rawValues.deliveryZones);
    } catch {
      rawValues.deliveryZones = [];
    }
  }

  const parsed = onboardingBusinessSchema.safeParse(rawValues);

  if (!parsed.success) {
    console.error(parsed.error);
    return { error: "Données invalides", details: parsed.error.flatten().fieldErrors };
  }

  const { momoNumber, orangeNumber, whatsappNumber, acceptsCod, deliveryZones } = parsed.data;

  try {
    await prisma.shop.update({
      where: { seller_id: session.id },
      data: {
        momo_number: momoNumber || null,
        orange_money_number: orangeNumber || null,
        whatsapp_number: whatsappNumber,
        accepts_cash_on_delivery: acceptsCod,
        delivery_zones: JSON.stringify(deliveryZones || []),
        onboarding_completed: true,
      },
    });
  } catch (error) {
    console.error("Update Business Error:", error);
    return { error: "Erreur lors de la mise à jour" };
  }

  redirect("/dashboard");
}
