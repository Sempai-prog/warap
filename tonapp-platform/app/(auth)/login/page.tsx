"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { loginAction } from "@/app/actions/auth";
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
import { Eye, EyeOff } from "lucide-react";

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value),
    );

    const result = await loginAction(formData);

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
            Bon retour!
          </CardTitle>
          <CardDescription>
            Connectez-vous pour gérer votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="rounded-2xl h-12 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
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
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-small text-neutral-500">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="text-primary-600 font-bold hover:underline"
            >
              Créer un compte
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
