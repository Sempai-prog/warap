import { BottomNav } from "@/components/seller-dashboard/BottomNav";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans">
      <main className="pb-[100px] px-4 pt-8 max-w-lg mx-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
