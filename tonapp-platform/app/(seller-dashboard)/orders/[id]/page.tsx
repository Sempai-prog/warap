import { getOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusActions } from "@/components/orders/OrderStatusActions";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center gap-4">
        <Link href="/orders">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Commande #{order.id.substring(0, 8)}</h1>
      </header>

      <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
        <CardHeader className="pb-2">
            <div className="flex justify-between">
                <CardTitle>Client</CardTitle>
                <div className="flex gap-2">
                    <a href={`tel:${order.customer_phone}`}>
                        <Button size="icon" variant="outline" className="rounded-full h-8 w-8">
                            <Phone className="h-4 w-4" />
                        </Button>
                    </a>
                    <a href={`https://wa.me/${order.customer_phone.replace('+', '')}`}>
                        <Button size="icon" variant="default" className="rounded-full h-8 w-8 bg-green-600 hover:bg-green-700 text-white">
                            <MessageCircle className="h-4 w-4" />
                        </Button>
                    </a>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-1">
            <p className="text-lg font-bold">{order.customer_name}</p>
            <p className="text-neutral-500">{order.customer_phone}</p>
            <p className="text-neutral-500">{order.delivery_address}</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
        <CardHeader className="pb-2">
            <CardTitle>Détails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex gap-4">
                <div className="h-16 w-16 bg-neutral-100 rounded-lg flex-shrink-0" />
                <div>
                    <p className="font-medium line-clamp-2">{order.product.title}</p>
                    <p className="text-sm text-neutral-500">Qté: {order.quantity}</p>
                </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
                <span>Total</span>
                <span className="font-bold text-lg">{Number(order.total_amount_xaf).toLocaleString()} XAF</span>
            </div>
            <div className="flex justify-between items-center">
                <span>Paiement</span>
                <Badge variant={order.payment_status === "confirmed" ? "default" : "outline"}>
                    {order.payment_status === "confirmed" ? "Payé" : order.payment_method === "cash_on_delivery" ? "Cash à la livraison" : "En attente"}
                </Badge>
            </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-[80px] left-0 right-0 px-4 max-w-lg mx-auto">
        <OrderStatusActions orderId={order.id} currentStatus={order.fulfillment_status} />
      </div>
    </div>
  );
}
