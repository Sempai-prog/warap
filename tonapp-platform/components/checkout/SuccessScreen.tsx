import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle } from "lucide-react";

interface SuccessScreenProps {
  data: { orderId: string; quantity: number; deliveryAddress: string; product: { title: string; price_xaf: bigint; shop: { whatsapp_number: string } } };
  onClose: () => void;
}

export function SuccessScreen({ data, onClose }: SuccessScreenProps) {
  const whatsappMessage = `Salut! J'ai passé une commande pour ${data.product.title}. ID: #${data.orderId.substring(0, 8)}`;
  const whatsappLink = `https://wa.me/${data.product.shop.whatsapp_number.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-in zoom-in duration-500">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-neutral-900">Succès !</h2>
        <p className="text-neutral-500 mt-2">Votre commande a été confirmée.</p>
        <p className="font-mono text-sm bg-neutral-100 px-3 py-1 rounded-full inline-block mt-4">
            #{data.orderId.substring(0, 8)}
        </p>
      </div>

      <div className="w-full bg-neutral-50 rounded-2xl p-6 border border-neutral-100 text-left space-y-2">
        <div className="flex justify-between">
            <span className="text-neutral-500">Produit</span>
            <span className="font-medium">{data.product.title}</span>
        </div>
        <div className="flex justify-between">
            <span className="text-neutral-500">Total</span>
            <span className="font-bold">{Number(data.product.price_xaf * BigInt(data.quantity)).toLocaleString()} XAF</span>
        </div>
        <div className="flex justify-between">
            <span className="text-neutral-500">Livraison à</span>
            <span className="font-medium">{data.deliveryAddress}</span>
        </div>
      </div>

      <div className="w-full space-y-3 pt-4">
        <p className="text-sm text-neutral-500">
            Le vendeur vous contactera bientôt pour la livraison.
        </p>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button className="w-full h-14 rounded-xl text-lg font-bold bg-[#25D366] hover:bg-[#128C7E] text-white gap-2">
                <MessageCircle className="w-5 h-5" />
                Discuter avec le vendeur
            </Button>
        </a>
        <Button variant="ghost" onClick={onClose} className="w-full h-12 rounded-xl text-neutral-500">
            Fermer
        </Button>
      </div>
    </div>
  );
}
