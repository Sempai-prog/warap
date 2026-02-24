"use client";

import { updateOrderStatus } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
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
    <div className="flex flex-col gap-2">
      {currentStatus === "new" && (
        <Button
            className="w-full h-12 rounded-xl text-base font-bold bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => handleUpdate("preparing")}
            disabled={!!loading}
        >
            {loading === "preparing" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Accepter & Préparer
        </Button>
      )}

      {currentStatus === "preparing" && (
        <Button
            className="w-full h-12 rounded-xl text-base font-bold bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => handleUpdate("in_delivery")}
            disabled={!!loading}
        >
            {loading === "in_delivery" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Envoyer en Livraison
        </Button>
      )}

      {currentStatus === "in_delivery" && (
        <Button
            className="w-full h-12 rounded-xl text-base font-bold bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleUpdate("delivered")}
            disabled={!!loading}
        >
            {loading === "delivered" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Marquer comme Livré
        </Button>
      )}

      <Button
        variant="outline"
        className="w-full h-12 rounded-xl text-red-500 border-red-200 hover:bg-red-50"
        onClick={() => handleUpdate("cancelled")}
        disabled={!!loading}
      >
        {loading === "cancelled" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Annuler la commande
      </Button>
    </div>
  );
}
