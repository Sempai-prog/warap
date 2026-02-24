import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShopSettingsForm } from "@/components/shop-settings-form";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const shop = await prisma.shop.findUnique({
    where: { seller_id: session.id },
  });

  if (!shop) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500 font-medium">Boutique introuvable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-2">
          Configuration
        </h1>
        <p className="text-neutral-500">
          Personnalisez votre boutique et vos moyens de paiement.
        </p>
      </header>

      <ShopSettingsForm initialData={shop} />
    </div>
  );
}
