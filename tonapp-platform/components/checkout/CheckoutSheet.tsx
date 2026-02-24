"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema } from "@/lib/validations";
import { createOrderAction } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { SuccessScreen } from "./SuccessScreen";

type OrderValues = z.infer<typeof orderSchema>;

interface CheckoutSheetProps {
  product: {
    id: string;
    title: string;
    price_xaf: bigint;
    shop: { accepts_cash_on_delivery: boolean };
  };
}

export function CheckoutSheet({ product }: CheckoutSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    orderId: string;
    product: { title: string; price_xaf: bigint; shop: any };
    deliveryAddress: string;
    quantity: number;
  } | null>(null);

  const form = useForm<OrderValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "+237",
      deliveryAddress: "",
      paymentMethod: "momo",
      quantity: 1,
    },
  });

  async function onSubmit(values: OrderValues) {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, String(value)),
    );
    formData.append("productId", product.id);

    try {
      const result = await createOrderAction(formData);
      if (result.success) {
        setSuccessData({ orderId: result.orderId, ...values, product });
      } else {
        console.error(result.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  if (successData) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="w-full h-14 rounded-full text-lg font-bold shadow-xl bg-primary-600 hover:bg-primary-700 active:scale-95 transition-all">
            Acheter Maintenant
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="rounded-t-[2rem] p-0 min-h-[90vh]"
        >
          <SuccessScreen data={successData} onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="w-full h-14 rounded-full text-lg font-bold shadow-xl bg-primary-600 hover:bg-primary-700 active:scale-95 transition-all">
          Acheter Maintenant
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-[2rem] px-6 py-8 max-h-[90vh] overflow-y-auto"
      >
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-bold">
            Finaliser votre commande
          </SheetTitle>
        </SheetHeader>

        {/* Order Summary */}
        <div className="bg-neutral-50 p-4 rounded-xl mb-6 flex gap-4 border border-neutral-100">
          <div className="h-16 w-16 bg-neutral-200 rounded-lg flex-shrink-0 relative overflow-hidden">
            {/* Image would go here */}
          </div>
          <div>
            <p className="font-semibold line-clamp-1">{product.title}</p>
            <p className="text-sm text-neutral-500">
              Total:{" "}
              <span className="font-bold text-neutral-900">
                {Number(product.price_xaf).toLocaleString()} XAF
              </span>
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jean Dupont"
                      {...field}
                      className="rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+237..."
                      {...field}
                      className="rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quartier de Livraison</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Douala - Akwa"
                      {...field}
                      className="rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Moyen de Paiement</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col gap-3"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border p-4">
                        <FormControl>
                          <RadioGroupItem value="momo" />
                        </FormControl>
                        <FormLabel className="font-normal flex-1 cursor-pointer">
                          MTN Mobile Money
                        </FormLabel>
                        <span className="text-xl">🟡</span>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border p-4">
                        <FormControl>
                          <RadioGroupItem value="orange_money" />
                        </FormControl>
                        <FormLabel className="font-normal flex-1 cursor-pointer">
                          Orange Money
                        </FormLabel>
                        <span className="text-xl">🟠</span>
                      </FormItem>
                      {product.shop.accepts_cash_on_delivery && (
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border p-4">
                          <FormControl>
                            <RadioGroupItem value="cash_on_delivery" />
                          </FormControl>
                          <FormLabel className="font-normal flex-1 cursor-pointer">
                            Paiement à la livraison
                          </FormLabel>
                          <span className="text-xl">💵</span>
                        </FormItem>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-14 rounded-xl text-lg font-bold mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Confirmer la commande"
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
