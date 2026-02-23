import { ShopHeader } from "@/components/shop-frontend/ShopHeader";
import { TrustFooter } from "@/components/shop-frontend/TrustFooter";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary-100 selection:text-primary-900">
      <ShopHeader shopName="Ma Boutique" />
      <main className="max-w-screen-md mx-auto min-h-[calc(100vh-160px)]">
        {children}
      </main>
      <TrustFooter />
    </div>
  );
}
