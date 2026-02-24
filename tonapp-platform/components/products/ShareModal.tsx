import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, Copy, QrCode, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    magic_link_slug: string;
    price_xaf: bigint;
  };
}

export function ShareModal({ isOpen, onClose, product }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Use localhost in dev, production domain later.
  // Ideally this comes from an env var
  const origin = typeof window !== "undefined" ? window.location.origin : "https://tonapp.cm";
  const shareLink = `${origin}/p/${product.magic_link_slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: "whatsapp" | "twitter" | "native") => {
    const text = `🔥 CHECK THIS OUT! ${product.title} at ${Number(product.price_xaf).toLocaleString()} XAF 💯 #cameroun #shopping`;

    if (platform === "native" && navigator.share) {
      navigator.share({
        title: product.title,
        text: text,
        url: shareLink,
      });
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + shareLink)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-[2rem] p-6">
        <DialogHeader className="text-center items-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold">Produit Publié !</DialogTitle>
            <DialogDescription className="text-neutral-500">
              Votre Magic Link est prêt à être partagé.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex items-center space-x-2 bg-neutral-100 p-3 rounded-xl mt-4">
          <div className="flex-1 truncate text-sm font-medium text-neutral-600">
            {shareLink}
          </div>
          <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8 rounded-lg">
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            variant="outline"
            className="h-12 rounded-xl flex items-center gap-2 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
            onClick={() => handleShare("whatsapp")}
          >
            <Share2 className="w-4 h-4" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-xl flex items-center gap-2 border-neutral-200 hover:bg-neutral-50"
            onClick={() => handleShare("native")}
          >
            <QrCode className="w-4 h-4" />
            Autres
          </Button>
        </div>

        <Button className="w-full h-12 rounded-xl mt-2 font-bold" onClick={onClose}>
          Terminer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
