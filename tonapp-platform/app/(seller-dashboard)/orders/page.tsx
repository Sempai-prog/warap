import { getOrders } from "@/app/actions/orders";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const currentTab = tab || "new";
  const orders = await getOrders(currentTab);

  const tabs = [
    { id: "new", label: "Nouveaux" },
    { id: "preparing", label: "Prép." },
    { id: "delivery", label: "Livraison" },
    { id: "delivered", label: "Livrées" },
    { id: "cancelled", label: "Annulées" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes Commandes</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/orders?tab=${t.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              currentTab === t.id
                ? "bg-primary-600 text-white"
                : "bg-white text-neutral-600 border border-neutral-200"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Order List */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            Aucune commande dans cet onglet.
          </div>
        ) : (
          orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card className="p-4 active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-lg">#{order.id.substring(0, 6)}</span>
                    <p className="text-sm font-medium">{order.customer_name}</p>
                  </div>
                  <Badge variant={order.payment_status === "confirmed" ? "default" : "secondary"}>
                    {order.payment_status === "confirmed" ? "Payé" : "En attente"}
                  </Badge>
                </div>
                <div className="flex gap-3 mt-2 pt-2 border-t border-neutral-100">
                    {/* Placeholder image if product image missing */}
                    <div className="h-10 w-10 bg-neutral-100 rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm text-neutral-600 line-clamp-1">{order.product.title}</p>
                        <p className="text-xs text-neutral-400">
                            {Number(order.total_amount_xaf).toLocaleString()} XAF • {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
