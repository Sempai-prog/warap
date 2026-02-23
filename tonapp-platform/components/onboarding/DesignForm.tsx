"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingDesignSchema } from "@/lib/validations";
import { updateDesignAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

type DesignValues = z.infer<typeof onboardingDesignSchema>;

const COLORS = [
  { hex: "#00A86B", name: "Green" },
  { hex: "#3B82F6", name: "Blue" },
  { hex: "#EF4444", name: "Red" },
  { hex: "#F59E0B", name: "Amber" },
  { hex: "#8B5CF6", name: "Purple" },
  { hex: "#EC4899", name: "Pink" },
];

const FONTS = [
  { id: "inter_open_sans", name: "Moderne (Inter + Open Sans)" },
  { id: "playfair_lato", name: "Élégant (Playfair + Lato)" },
  { id: "poppins_roboto", name: "Audacieux (Poppins + Roboto)" },
] as const;

export function DesignForm({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DesignValues>({
    resolver: zodResolver(onboardingDesignSchema),
    defaultValues: {
      primaryColor: "#00A86B",
      typographyStyle: "inter_open_sans",
      layoutType: "bento",
    },
  });

  async function onSubmit(values: DesignValues) {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));

    try {
      const result = await updateDesignAction(formData);
      if (result?.error) {
        setError(result.error);
        if (result.details) console.error(result.details);
      } else {
        onNext();
      }
    } catch (e) {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Color Picker */}
        <FormField
          control={form.control}
          name="primaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Couleur Principale</FormLabel>
              <FormControl>
                <div className="flex gap-3 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      className={`w-12 h-12 rounded-full cursor-pointer transition-all hover:scale-110 flex items-center justify-center ring-offset-2 ${
                        field.value === color.hex ? "ring-2 ring-neutral-900 dark:ring-white scale-110" : "ring-1 ring-transparent hover:ring-neutral-200"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => field.onChange(color.hex)}
                      aria-label={`Select color ${color.name}`}
                    >
                      {field.value === color.hex && (
                        <span className="text-white font-bold drop-shadow-md">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Font Style */}
        <FormField
          control={form.control}
          name="typographyStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Style Typographique</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 gap-3">
                  {FONTS.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                        field.value === font.id
                            ? "border-primary-600 bg-primary-50 dark:bg-primary-900/10 ring-1 ring-primary-600"
                            : "border-neutral-200 dark:border-neutral-800"
                      }`}
                      onClick={() => field.onChange(font.id)}
                    >
                      <span className="font-medium text-sm">{font.name}</span>
                      {field.value === font.id && <span className="text-primary-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Layout Type */}
        <FormField
          control={form.control}
          name="layoutType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Disposition</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => field.onChange("bento")}
                    className={`flex flex-col gap-3 rounded-xl border p-4 text-left transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                      field.value === "bento"
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-900/10 ring-1 ring-primary-600"
                        : "border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    <div className="w-full aspect-video bg-white dark:bg-neutral-900 rounded border border-dashed border-neutral-300 dark:border-neutral-700 grid grid-cols-2 gap-1 p-1">
                        <div className="bg-neutral-100 dark:bg-neutral-800 rounded col-span-1 row-span-2"></div>
                        <div className="bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                        <div className="bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm">Bento Grid</span>
                        {field.value === "bento" && <span className="text-primary-600">✓</span>}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => field.onChange("list")}
                    className={`flex flex-col gap-3 rounded-xl border p-4 text-left transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                      field.value === "list"
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-900/10 ring-1 ring-primary-600"
                        : "border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    <div className="w-full aspect-video bg-white dark:bg-neutral-900 rounded border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col gap-1 p-1">
                        <div className="bg-neutral-100 dark:bg-neutral-800 h-1/3 rounded w-full"></div>
                        <div className="bg-neutral-100 dark:bg-neutral-800 h-1/3 rounded w-full"></div>
                        <div className="bg-neutral-100 dark:bg-neutral-800 h-1/3 rounded w-full"></div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm">Liste Simple</span>
                        {field.value === "list" && <span className="text-primary-600">✓</span>}
                    </div>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</div>}

        <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onBack} className="flex-1 h-12 rounded-xl" disabled={isLoading}>
                Retour
            </Button>
            <Button type="submit" className="flex-[2] h-12 rounded-xl text-base font-bold" disabled={isLoading}>
                {isLoading ? "Sauvegarde..." : "Continuer"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
