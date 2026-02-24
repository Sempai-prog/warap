import { getOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  ShieldQuestion,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusActions } from "@/components/orders/OrderStatusActions";
import { cn } from "@/lib/utils";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/orders">
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-2xl bg-white shadow-soft hover:bg-neutral-50 border border-white/60"
          >
            <ArrowLeft className="h-6 w-6 text-neutral-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Détails Commande
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            #{order.id.substring(0, 8).toUpperCase()}
          </p>
        </div>
      </header>

      <div className="p-8 bg-white rounded-[2.5rem] border border-white/60 shadow-soft space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-card rounded-xl text-blue-text">
              <ShieldQuestion size={20} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Client</h3>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${order.customer_phone}`}>
              <Button
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-2xl bg-white shadow-soft hover:bg-neutral-50 border-neutral-100 transition-all active:scale-95"
              >
                <Phone className="h-5 w-5 text-neutral-600" />
              </Button>
            </a>
            <a href={`https://wa.me/${order.customer_phone.replace("+", "")}`}>
              <Button
                size="icon"
                className="h-12 w-12 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white shadow-soft-xl transition-all active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-neutral-50/50 rounded-[2rem] border border-neutral-50">
            <p className="text-xl font-black text-neutral-900">
              {order.customer_name}
            </p>
            <p className="text-sm font-bold text-neutral-500 mt-1">
              {order.customer_phone}
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-tiny font-black uppercase tracking-widest text-neutral-400 ml-1">
              Adresse de livraison
            </span>
            <p className="text-neutral-700 font-medium leading-relaxed">
              {order.delivery_address}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 bg-white rounded-[2.5rem] border border-white/60 shadow-soft space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-card rounded-xl text-purple-text">
            <Truck size={20} />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">Détails Panier</h3>
        </div>

        <div className="flex gap-5 p-4 bg-neutral-50/50 rounded-[2rem] border border-neutral-50 overflow-hidden">
          <div className="h-20 w-20 bg-white rounded-2xl flex-shrink-0 shadow-sm overflow-hidden p-1">
            <div className="w-full h-full bg-neutral-100 rounded-xl overflow-hidden relative">
              {/* Real image here in production */}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <p className="font-bold text-neutral-900 text-lg line-clamp-2 leading-tight">
              {order.product.title}
            </p>
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mt-1">
              Quantité: {order.quantity}
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center px-2">
            <span className="text-neutral-500 font-bold">Total TTC</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-neutral-900">
                {Number(order.total_amount_xaf).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-neutral-400">XAF</span>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-neutral-50/50 rounded-2xl border border-neutral-50">
            <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">
              Paiement
            </span>
            <div
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                order.payment_status === "confirmed"
                  ? "bg-mint-card text-mint-text"
                  : "bg-neutral-100 text-neutral-400",
              )}
            >
              {order.payment_status === "confirmed"
                ? "Payé"
                : order.payment_method === "cash_on_delivery"
                  ? "Cash Livraison"
                  : "En attente"}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[80px] left-0 right-0 px-4 max-w-lg mx-auto">
        <OrderStatusActions
          orderId={order.id}
          currentStatus={order.fulfillment_status}
        />
      </div>
    </div>
  );
}
