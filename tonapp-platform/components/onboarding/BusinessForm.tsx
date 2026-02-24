"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingBusinessSchema } from "@/lib/validations";
import { updateBusinessAction } from "@/app/actions/onboarding";
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
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

type BusinessValues = z.infer<typeof onboardingBusinessSchema>;

export function BusinessForm({ onBack }: { onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<BusinessValues>({
    resolver: zodResolver(onboardingBusinessSchema),
    defaultValues: {
      momoNumber: "",
      orangeNumber: "",
      whatsappNumber: "", // Ideally pre-filled from session/db
      acceptsCod: true,
      deliveryZones: [
        { city: "Douala", region: "Littoral", deliveryDays: 1, baseFee: 1000 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliveryZones",
  });

  async function onSubmit(values: BusinessValues) {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();

    formData.append("momoNumber", values.momoNumber || "");
    formData.append("orangeNumber", values.orangeNumber || "");
    formData.append("whatsappNumber", values.whatsappNumber);
    formData.append("acceptsCod", String(values.acceptsCod));
    formData.append("deliveryZones", JSON.stringify(values.deliveryZones));

    try {
      const result = await updateBusinessAction(formData);
      if (result?.error) {
        setError(result.error);
        if (result.details) {
          console.error(result.details);
          // Display detailed validation errors if needed, usually mapped by react-hook-form automatically if keys match
        }
      }
    } catch (e) {
      console.error(e);
      // Don't set error if it's a redirect
      // But we can't easily detect redirect error type in client
      // However, server action won't return if redirecting.
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-mint-card rounded-xl text-mint-text">
              <CreditCard size={20} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Paiements</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="momoNumber"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400">
                    MTN Mobile Money
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+237..."
                      {...field}
                      value={field.value || ""}
                      className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-14"
                    />
                  </FormControl>
                  <FormMessage className="text-tiny font-medium" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orangeNumber"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400">
                    Orange Money
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+237..."
                      {...field}
                      value={field.value || ""}
                      className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-14"
                    />
                  </FormControl>
                  <FormMessage className="text-tiny font-medium" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="acceptsCod"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-[2rem] border border-white/60 bg-white p-6 shadow-soft transition-all hover:shadow-soft-lg">
                <div className="space-y-1">
                  <FormLabel className="text-base font-bold text-neutral-900">
                    Paiement à la livraison (Cash)
                  </FormLabel>
                  <FormDescription className="text-sm font-medium text-neutral-500">
                    Permettre aux clients de payer en espèces
                  </FormDescription>
                </div>
                <FormControl>
                  <div
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      "w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300",
                      field.value ? "bg-primary" : "bg-neutral-200",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300",
                        field.value ? "translate-x-6" : "translate-x-0",
                      )}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-card rounded-xl text-blue-text">
              <Plus size={20} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">
              Contact & Livraison
            </h3>
          </div>

          <FormField
            control={form.control}
            name="whatsappNumber"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400">
                  WhatsApp Support
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="+237..."
                    {...field}
                    className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-14"
                  />
                </FormControl>
                <FormMessage className="text-tiny font-medium" />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <Label className="text-small font-bold uppercase tracking-wider text-neutral-400">
                Zones de Livraison
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  append({ city: "", region: "", deliveryDays: 1, baseFee: 0 })
                }
                className="text-primary font-bold hover:bg-primary/5 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-1" /> Ajouter une zone
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="group relative flex flex-col p-6 bg-white rounded-[2.5rem] border border-white/60 shadow-soft hover:shadow-soft-lg transition-all animate-in slide-in-from-right-4 duration-300"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 h-10 w-10 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-neutral-400 ml-1">
                        Ville
                      </Label>
                      <Input
                        {...form.register(`deliveryZones.${index}.city`)}
                        placeholder="Douala"
                        className="h-12 rounded-2xl border-neutral-50 bg-neutral-50/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-neutral-400 ml-1">
                        Région
                      </Label>
                      <Input
                        {...form.register(`deliveryZones.${index}.region`)}
                        placeholder="Littoral"
                        className="h-12 rounded-2xl border-neutral-50 bg-neutral-50/30"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs font-bold uppercase text-neutral-400 ml-1">
                        Frais de livraison (XAF)
                      </Label>
                      <Input
                        type="number"
                        {...form.register(`deliveryZones.${index}.baseFee`, {
                          valueAsNumber: true,
                        })}
                        placeholder="1000"
                        className="h-14 rounded-2xl border-neutral-50 bg-neutral-50/50 font-bold text-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 animate-in zoom-in-95">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            className="w-full h-16 rounded-[2rem] text-lg font-bold shadow-soft-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enregistrement...
              </div>
            ) : (
              "Terminer la configuration 🚀"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
