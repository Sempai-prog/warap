import { DesktopNav } from "@/components/seller-dashboard/DesktopNav";
import { MobileHeader } from "@/components/seller-dashboard/MobileHeader";
import { BottomTabBar } from "@/components/seller-dashboard/BottomTabBar";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-soft-bg text-foreground font-sans">
      {/* Desktop/Tablet Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-20 lg:w-64 flex-col border-r bg-white/50 backdrop-blur-xl">
        <DesktopNav />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Top Header */}
        <header className="md:hidden flex h-16 items-center justify-between bg-white/80 backdrop-blur-md border-b px-6">
          <MobileHeader />
        </header>

        {/* Scrollable Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 lg:p-12 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto">{children}</div>
        </div>

        {/* Mobile Bottom Navigation (Hidden on Desktop/Tablet) */}
        <nav className="md:hidden absolute bottom-0 w-full h-20 border-t bg-white/80 backdrop-blur-xl shadow-soft">
          <BottomTabBar />
        </nav>
      </main>
    </div>
  );
}
