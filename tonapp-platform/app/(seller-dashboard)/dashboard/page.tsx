import { getDashboardMetrics } from "@/app/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface DashboardOrder {
  id: string;
  customer_name: string;
  total_amount_xaf: bigint;
  product: {
    title: string;
  };
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  if (!metrics) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900 dark:text-neutral-50">
            Bonjour, {metrics.firstName}!
          </h1>
          <p className="text-small text-neutral-500">
            Voici vos statistiques d&apos;aujourd&apos;hui
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
          {metrics.firstName.substring(0, 2).toUpperCase()}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-3xl border-none shadow-sm bg-primary-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-tiny uppercase opacity-80">
              Ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-h3 font-bold">{metrics.salesToday.toLocaleString()}</p>
            <p className="text-[10px] mt-1 opacity-70">XAF • Aujourd&apos;hui</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-tiny uppercase text-neutral-500">
              Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-h3 font-bold">{metrics.newOrdersCount}</p>
            <p className="text-[10px] mt-1 text-neutral-400">Nouveaux</p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Commandes Récentes</h2>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="text-primary-600">
              Voir tout
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {metrics.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-sm bg-white dark:bg-neutral-900 rounded-2xl border border-dashed">
                Pas encore de commandes.
                <br />Partagez vos produits !
            </div>
          ) : (
            metrics.recentOrders.map((order: DashboardOrder) => (
              <Card
                key={order.id}
                className="rounded-2xl border-neutral-100 shadow-sm overflow-hidden"
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0 text-xl">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{order.customer_name}</p>
                    <p className="text-small text-neutral-500 truncate">
                      {order.product.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{Number(order.total_amount_xaf).toLocaleString()}</p>
                    <p className="text-[10px] text-neutral-400">XAF</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
