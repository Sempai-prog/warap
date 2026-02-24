"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shopConfigSchema } from "@/lib/validations";
import { updateShopAction } from "@/app/actions/shop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Palette,
  Phone,
  Info,
} from "lucide-react";

interface ShopSettingsFormProps {
  initialData: any;
}

export function ShopSettingsForm({ initialData }: ShopSettingsFormProps) {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(shopConfigSchema),
    defaultValues: {
      shopName: initialData.shop_name || "",
      bio: initialData.bio_description || "",
      primaryColor: initialData.primary_color || "#00A86B",
      whatsappNumber: initialData.whatsapp_number || "",
      momoNumber: initialData.momo_number || "",
      orangeNumber: initialData.orange_money_number || "",
    },
  });

  const selectedColor = watch("primaryColor");

  const onSubmit = async (data: any) => {
    setIsPending(true);
    setStatus(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });

    const result = await updateShopAction(formData);

    if (result.success) {
      setStatus({ type: "success", message: result.message! });
    } else {
      setStatus({ type: "error", message: result.error });
    }
    setIsPending(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Branding Section */}
      <div className="bg-white rounded-[2rem] p-6 shadow-soft border border-white/60 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-mint-card rounded-xl">
            <Palette className="text-mint-text" size={20} />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">
            Identité Visuelle
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="shopName"
              className="text-small font-bold uppercase tracking-wider text-neutral-400"
            >
              Nom de la boutique
            </Label>
            <Input
              id="shopName"
              {...register("shopName")}
              className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-12 focus:ring-primary/20"
              placeholder="Ex: Ma Super Boutique"
            />
            {errors.shopName && (
              <p className="text-tiny font-medium text-error">
                {errors.shopName.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="bio"
              className="text-small font-bold uppercase tracking-wider text-neutral-400"
            >
              Description / Bio
            </Label>
            <textarea
              id="bio"
              {...register("bio")}
              className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              placeholder="Décrivez votre boutique en quelques mots..."
            />
            {errors.bio && (
              <p className="text-tiny font-medium text-error">
                {errors.bio.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-small font-bold uppercase tracking-wider text-neutral-400">
              Couleur de la marque
            </Label>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-24 rounded-2xl border-2 border-white shadow-soft transition-transform hover:scale-105"
                style={{ backgroundColor: selectedColor }}
              />
              <Input
                type="color"
                {...register("primaryColor")}
                className="w-full h-12 rounded-2xl border-neutral-100 bg-neutral-50/50 p-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-[2rem] p-6 shadow-soft border border-white/60 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-card rounded-xl">
            <Phone className="text-blue-text" size={20} />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">
            Coordonnées & Paiement
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="whatsappNumber"
              className="text-small font-bold uppercase tracking-wider text-neutral-400"
            >
              Numéro WhatsApp
            </Label>
            <Input
              id="whatsappNumber"
              {...register("whatsappNumber")}
              className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-12"
              placeholder="+237XXXXXXXXX"
            />
            {errors.whatsappNumber && (
              <p className="text-tiny font-medium text-error">
                {errors.whatsappNumber.message as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="momoNumber"
                className="text-small font-bold uppercase tracking-wider text-neutral-400"
              >
                MTN MoMo
              </Label>
              <Input
                id="momoNumber"
                {...register("momoNumber")}
                className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-12"
                placeholder="+237XXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="orangeNumber"
                className="text-small font-bold uppercase tracking-wider text-neutral-400"
              >
                Orange Money
              </Label>
              <Input
                id="orangeNumber"
                {...register("orangeNumber")}
                className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-12"
                placeholder="+237XXXXXXXXX"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Area */}
      {status && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
            status.type === "success"
              ? "bg-mint-card text-mint-text shadow-soft-lg"
              : "bg-red-50 text-error border border-red-100"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <p className="text-sm font-bold">{status.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-16 rounded-[2rem] bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-lg shadow-soft-xl transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Mise à jour...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Save size={20} />
            Enregistrer les modifications
          </div>
        )}
      </Button>
    </form>
  );
}
