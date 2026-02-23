"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingBusinessSchema } from "@/lib/validations";
import { updateBusinessAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
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
      deliveryZones: [{ city: "Douala", region: "Littoral", deliveryDays: 1, baseFee: 1000 }],
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

        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Paiements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="momoNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MTN Mobile Money</FormLabel>
                      <FormControl>
                        <Input placeholder="+237..." {...field} value={field.value || ""} className="rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orangeNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orange Money</FormLabel>
                      <FormControl>
                        <Input placeholder="+237..." {...field} value={field.value || ""} className="rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="acceptsCod"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Paiement à la livraison</FormLabel>
                    <FormDescription>
                      Accepter le cash lors de la remise du produit
                    </FormDescription>
                  </div>
                  <FormControl>
                    <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={field.value}
                        onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact & Livraison</h3>
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Principal (Support Client)</FormLabel>
                  <FormControl>
                    <Input placeholder="+237..." {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>Zones de Livraison</Label>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => append({ city: "", region: "", deliveryDays: 1, baseFee: 0 })}
                        className="text-primary-600"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Ajouter
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-xl bg-neutral-50 dark:bg-neutral-900">
                        <div className="col-span-4">
                            <Label className="text-xs mb-1 block">Ville</Label>
                            <Input {...form.register(`deliveryZones.${index}.city`)} placeholder="Douala" className="h-9 text-sm" />
                        </div>
                        <div className="col-span-4">
                            <Label className="text-xs mb-1 block">Région</Label>
                            <Input {...form.register(`deliveryZones.${index}.region`)} placeholder="Littoral" className="h-9 text-sm" />
                        </div>
                        <div className="col-span-3">
                            <Label className="text-xs mb-1 block">Prix (XAF)</Label>
                            <Input
                                type="number"
                                {...form.register(`deliveryZones.${index}.baseFee`, { valueAsNumber: true })}
                                placeholder="1000"
                                className="h-9 text-sm"
                            />
                        </div>
                        <div className="col-span-1">
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-9 w-9 text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {error && <div className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</div>}

        <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onBack} className="flex-1 h-12 rounded-xl" disabled={isLoading}>
                Retour
            </Button>
            <Button type="submit" className="flex-[2] h-12 rounded-xl text-base font-bold bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                {isLoading ? "Finalisation..." : "Terminer et Lancer 🚀"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
