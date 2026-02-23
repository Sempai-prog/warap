import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900 dark:text-neutral-50">
            Bonjour!
          </h1>
          <p className="text-small text-neutral-500">
            Voici vos statistiques d&apos;aujourd&apos;hui
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
          JD
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
            <p className="text-h3 font-bold">150,000</p>
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
            <p className="text-h3 font-bold">12</p>
            <p className="text-[10px] mt-1 text-neutral-400">Nouveaux</p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Commandes Récentes</h2>
          <Button variant="ghost" size="sm" className="text-primary-600">
            Voir tout
          </Button>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="rounded-2xl border-neutral-100 shadow-sm overflow-hidden"
            >
              <div className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-neutral-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">Jean Dupont</p>
                  <p className="text-small text-neutral-500">
                    Paperback - Chop and Chew
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">15,000</p>
                  <p className="text-[10px] text-neutral-400">XAF</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
