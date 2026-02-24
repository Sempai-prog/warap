"use client";

import { updateOrderStatus } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, CheckCircle2, Package, Truck, XCircle } from "lucide-react";

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusActions({
  orderId,
  currentStatus,
}: OrderStatusActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (status: string) => {
    setLoading(status);
    await updateOrderStatus(orderId, status);
    setLoading(null);
  };

  if (currentStatus === "delivered" || currentStatus === "cancelled") {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 p-6 bg-white rounded-[2.5rem] border border-white/60 shadow-soft-xl">
      {currentStatus === "new" && (
        <Button
          className="w-full h-16 rounded-2xl text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-soft-xl transition-all active:scale-95"
          onClick={() => handleUpdate("preparing")}
          disabled={!!loading}
        >
          {loading === "preparing" ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Package className="mr-2 h-5 w-5" />
          )}
          Accepter & Préparer
        </Button>
      )}

      {currentStatus === "preparing" && (
        <Button
          className="w-full h-16 rounded-2xl text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-soft-xl transition-all active:scale-95"
          onClick={() => handleUpdate("in_delivery")}
          disabled={!!loading}
        >
          {loading === "in_delivery" ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Truck className="mr-2 h-5 w-5" />
          )}
          Envoyer en Livraison
        </Button>
      )}

      {currentStatus === "in_delivery" && (
        <Button
          className="w-full h-16 rounded-2xl text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-soft-xl transition-all active:scale-95"
          onClick={() => handleUpdate("delivered")}
          disabled={!!loading}
        >
          {loading === "delivered" ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-5 w-5" />
          )}
          Marquer comme Livré
        </Button>
      )}

      <Button
        variant="ghost"
        className="w-full h-14 rounded-2xl text-red-400 hover:text-red-500 hover:bg-red-50 font-bold transition-all"
        onClick={() => handleUpdate("cancelled")}
        disabled={!!loading}
      >
        {loading === "cancelled" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="mr-2 h-4 w-4" />
        )}
        Annuler la commande
      </Button>
    </div>
  );
}
