"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingDesignSchema } from "@/lib/validations";
import { updateDesignAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

export function DesignForm({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
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
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value),
    );

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
            <FormItem className="space-y-4">
              <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400">
                Couleur de la marque
              </FormLabel>
              <FormControl>
                <div className="flex gap-4 flex-wrap p-6 bg-white rounded-[2.5rem] shadow-soft border border-white/60">
                  {COLORS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      className={`w-14 h-14 rounded-2xl cursor-pointer transition-all hover:scale-110 flex items-center justify-center ring-offset-4 ${
                        field.value === color.hex
                          ? "ring-2 ring-primary scale-110 shadow-soft-lg"
                          : "ring-1 ring-neutral-100 hover:ring-neutral-200"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => field.onChange(color.hex)}
                      aria-label={`Select color ${color.name}`}
                    >
                      {field.value === color.hex && (
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-primary font-bold text-xs">
                            ✓
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                  <div className="w-14 h-14 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-100 flex items-center justify-center text-neutral-300">
                    <span className="text-xl">+</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-tiny font-medium" />
            </FormItem>
          )}
        />

        {/* Font Style */}
        <FormField
          control={form.control}
          name="typographyStyle"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400">
                Style Typographique
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 gap-4">
                  {FONTS.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      className={`flex items-center justify-between rounded-[2rem] border p-6 text-left transition-all hover:shadow-soft ${
                        field.value === font.id
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-neutral-100 bg-white"
                      }`}
                      onClick={() => field.onChange(font.id)}
                    >
                      <span
                        className={cn(
                          "font-bold text-base",
                          field.value === font.id
                            ? "text-primary"
                            : "text-neutral-900",
                        )}
                      >
                        {font.name}
                      </span>
                      {field.value === font.id && (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-bold text-sm">
                            ✓
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-tiny font-medium" />
            </FormItem>
          )}
        />

        {/* Layout Type */}
        <FormField
          control={form.control}
          name="layoutType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Disposition
              </FormLabel>
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
                      {field.value === "bento" && (
                        <span className="text-primary-600">✓</span>
                      )}
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
                      {field.value === "list" && (
                        <span className="text-primary-600">✓</span>
                      )}
                    </div>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            className="w-full h-16 rounded-[2rem] text-lg font-bold shadow-soft-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? "Sauvegarde..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
