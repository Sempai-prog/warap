"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validations";
import { signupAction } from "@/app/actions/auth";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { z } from "zod";

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "+237",
      password: "",
    },
  });

  async function onSubmit(values: SignupValues) {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value),
    );

    const result = await signupAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
      <Card className="w-full max-w-md border-none shadow-2xl shadow-primary-600/5 rounded-[2.5rem]">
        <CardHeader className="space-y-1 text-center pt-10">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary-600 flex items-center justify-center mb-4">
            <span className="text-white font-black text-xl">T</span>
          </div>
          <CardTitle className="text-h3 font-black tracking-tight">
            Créer un compte
          </CardTitle>
          <CardDescription>
            Lancez votre boutique en quelques secondes
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jean"
                          className="rounded-2xl h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dupont"
                          className="rounded-2xl h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="jean@example.com"
                        className="rounded-2xl h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+2376..."
                        className="rounded-2xl h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="rounded-2xl h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-small font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 text-base font-bold transition-all active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? "Création en cours..." : "S'inscrire"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-small text-neutral-500">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-primary-600 font-bold hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
