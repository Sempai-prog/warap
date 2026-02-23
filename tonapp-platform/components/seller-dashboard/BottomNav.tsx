import { LayoutDashboard, Package, ShoppingCart, Settings } from "lucide-react";
import Link from "next/link";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 text-neutral-500 hover:text-primary transition-colors"
    >
      {icon}
      <span className="text-[10px] uppercase font-medium tracking-wider">
        {label}
      </span>
    </Link>
  );
}

export function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-4 right-4 h-[60px] bg-white/80 backdrop-blur-md border border-neutral-200 rounded-full shadow-lg shadow-black/5 z-40 flex items-center justify-around px-6">
      <NavItem
        href="/dashboard"
        icon={<LayoutDashboard size={20} />}
        label="Home"
      />
      <NavItem href="/products" icon={<Package size={20} />} label="Products" />
      <NavItem
        href="/orders"
        icon={<ShoppingCart size={20} />}
        label="Orders"
      />
      <NavItem
        href="/settings"
        icon={<Settings size={20} />}
        label="Settings"
      />
    </nav>
  );
}
