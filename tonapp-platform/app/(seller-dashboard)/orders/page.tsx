import { getOrders } from "@/app/actions/orders";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MotionContainer, MotionItem } from "@/components/motion/MotionWrapper";
import { ShoppingBag, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const currentTab = tab || "new";
  const orders = await getOrders(currentTab);

  const tabs = [
    { id: "new", label: "Nouveaux", icon: ShoppingBag },
    { id: "preparing", label: "En cours", icon: Clock },
    { id: "delivery", label: "En route", icon: Truck },
    { id: "delivered", label: "Livrées", icon: CheckCircle2 },
    { id: "cancelled", label: "Annulées", icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-neutral-900">
          Mes Commandes
        </h1>
        <p className="text-neutral-500 font-medium">
          Suivez vos ventes en temps réel
        </p>
      </header>

      {/* Premium Horizontal Tabs */}
      <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar -mx-4 px-4 scroll-smooth">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/orders?tab=${t.id}`}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all active:scale-95 border",
              currentTab === t.id
                ? "bg-neutral-900 text-white border-neutral-900 shadow-soft-lg"
                : "bg-white text-neutral-500 border-neutral-100 hover:border-neutral-200",
            )}
          >
            <t.icon size={18} />
            {t.label}
          </Link>
        ))}
      </div>

      <MotionContainer className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-24 text-neutral-300 italic font-medium">
            Aucune commande dans cet onglet.
          </div>
        ) : (
          orders.map((order: any) => (
            <MotionItem key={order.id}>
              <Link href={`/orders/${order.id}`}>
                <div className="group p-6 bg-white rounded-[2.5rem] border border-white/60 shadow-soft hover:shadow-soft-lg active:scale-[0.99] transition-all relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xl text-neutral-900">
                          #{order.id.substring(0, 6).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50 px-2 py-1 rounded-md">
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-neutral-500 mt-1">
                        {order.customer_name}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                        order.payment_status === "confirmed"
                          ? "bg-mint-card text-mint-text"
                          : "bg-amber-50 text-amber-600",
                      )}
                    >
                      {order.payment_status === "confirmed"
                        ? "Payé"
                        : "En attente"}
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-neutral-50/50 rounded-3xl border border-neutral-50">
                    <div className="h-12 w-12 bg-white rounded-xl flex-shrink-0 shadow-sm overflow-hidden p-1">
                      <div className="w-full h-full bg-neutral-100 rounded-lg overflow-hidden relative">
                        {/* Placeholder for real product image */}
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-neutral-300 font-bold">
                          TMP
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-700 line-clamp-1">
                        {order.product.title}
                      </p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-base font-black text-neutral-900">
                          {Number(order.total_amount_xaf).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400">
                          XAF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Glow */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                </div>
              </Link>
            </MotionItem>
          ))
        )}
      </MotionContainer>
    </div>
  );
}
