import { ShoppingBag, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ShopHeaderProps {
  shopName: string;
  logoUrl?: string;
}

export function ShopHeader({ shopName, logoUrl }: ShopHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-neutral-100 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={shopName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
            {shopName.charAt(0)}
          </div>
        )}
        <h1 className="font-bold text-neutral-900 tracking-tight">
          {shopName}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-neutral-500 hover:text-neutral-900 transition-colors">
          <Search size={22} />
        </button>
        <Link
          href="/cart"
          className="relative text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ShoppingBag size={22} />
          <Badge className="absolute -top-2 -right-2 h-4 min-w-[16px] px-1 flex items-center justify-center bg-primary-600 text-[10px] text-white border-white border-2">
            0
          </Badge>
        </Link>
      </div>
    </header>
  );
}
