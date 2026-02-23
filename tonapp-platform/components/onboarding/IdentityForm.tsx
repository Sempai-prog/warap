"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingIdentitySchema } from "@/lib/validations";
import { updateIdentityAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

  const handleMockUpload = (field: any, type: 'logo' | 'banner') => {
    const url = type === 'logo'
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
            <FormItem>
              <FormLabel>Nom de la boutique</FormLabel>
              <FormControl>
                <Input placeholder="Ma Boutique" {...field} className="rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Une courte description..."
                            {...field}
                            value={field.value || ""}
                            onChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-3 items-center p-4 border rounded-xl border-dashed border-neutral-200 dark:border-neutral-800">
                        {field.value ? (
                            <img src={field.value} className="w-20 h-20 rounded-full object-cover shadow-sm bg-neutral-100" alt="Logo Preview" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                                <span className="text-2xl">📷</span>
                            </div>
                        )}
                        <Button type="button" variant="outline" size="sm" onClick={() => handleMockUpload(field, 'logo')}>
                            {field.value ? "Changer" : "Ajouter Logo"}
                        </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="bannerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bannière</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-3 items-center p-4 border rounded-xl border-dashed border-neutral-200 dark:border-neutral-800">
                        {field.value ? (
                            <img src={field.value} className="w-full h-20 rounded-lg object-cover shadow-sm bg-neutral-100" alt="Banner Preview" />
                        ) : (
                            <div className="w-full h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                                <span className="text-2xl">🖼️</span>
                            </div>
                        )}
                        <Button type="button" variant="outline" size="sm" onClick={() => handleMockUpload(field, 'banner')}>
                            {field.value ? "Changer" : "Ajouter Bannière"}
                        </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
            </div>
        )}

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Continuer"}
        </Button>
      </form>
    </Form>
  );
}
