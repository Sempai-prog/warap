"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingIdentitySchema } from "@/lib/validations";
import { updateIdentityAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

type IdentityValues = z.infer<typeof onboardingIdentitySchema>;

export function IdentityForm({ onNext }: { onNext: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<IdentityValues>({
    resolver: zodResolver(onboardingIdentitySchema),
    defaultValues: {
      shopName: "",
      bio: "",
      logoUrl: "",
      bannerUrl: "",
    },
  });

  async function onSubmit(values: IdentityValues) {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const result = await updateIdentityAction(formData);
      if (result?.error) {
        setError(result.error);
        if (result.details) {
          console.error(result.details);
        }
      } else {
        onNext();
      }
    } catch (e) {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  const handleMockUpload = (
    field: { onChange: (value: string) => void },
    type: "logo" | "banner",
  ) => {
    const url =
      type === "logo"
        ? "https://placehold.co/400x400/png?text=Logo"
        : "https://placehold.co/800x200/png?text=Banniere";

    setTimeout(() => {
      field.onChange(url);
    }, 500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="shopName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400">
                Nom de la boutique
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ma Boutique"
                  {...field}
                  className="rounded-2xl border-neutral-100 bg-neutral-50/50 h-14 selection:bg-primary/20"
                />
              </FormControl>
              <FormMessage className="text-tiny font-medium" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400">
                Bio
              </FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[120px] w-full rounded-[2rem] border border-neutral-100 bg-neutral-50/50 px-4 py-3 text-sm ring-offset-background placeholder:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                  placeholder="Une courte description..."
                  {...field}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage className="text-tiny font-medium" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400">
                  Logo
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4 items-center p-6 bg-white rounded-[2.5rem] shadow-soft border border-white/60">
                    {field.value ? (
                      <img
                        src={field.value}
                        className="w-24 h-24 rounded-full object-cover shadow-soft bg-neutral-50 ring-4 ring-white"
                        alt="Logo Preview"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-200 border-2 border-dashed border-neutral-100">
                        <span className="text-3xl">📷</span>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 rounded-xl px-4 font-bold border-neutral-100 hover:bg-neutral-50"
                      onClick={() => handleMockUpload(field, "logo")}
                    >
                      {field.value ? "Changer" : "Ajouter Logo"}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-tiny font-medium" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bannerUrl"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-small font-bold uppercase tracking-wider text-neutral-400">
                  Bannière
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4 items-center p-6 bg-white rounded-[2.5rem] shadow-soft border border-white/60">
                    {field.value ? (
                      <img
                        src={field.value}
                        className="w-full h-24 rounded-[1.5rem] object-cover shadow-soft bg-neutral-50 ring-4 ring-white"
                        alt="Banner Preview"
                      />
                    ) : (
                      <div className="w-full h-24 rounded-[1.5rem] bg-neutral-50 flex items-center justify-center text-neutral-200 border-2 border-dashed border-neutral-100">
                        <span className="text-3xl">🖼️</span>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 rounded-xl px-4 font-bold border-neutral-100 hover:bg-neutral-50"
                      onClick={() => handleMockUpload(field, "banner")}
                    >
                      {field.value ? "Changer" : "Ajouter Bannière"}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-tiny font-medium" />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 animate-in zoom-in-95">
            {error}
          </div>
        )}

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
            "Enregistrer les modifications"
          )}
        </Button>
      </form>
    </Form>
  );
}
