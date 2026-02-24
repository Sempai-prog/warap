"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: ShoppingCart, label: "Orders", href: "/orders" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full py-8">
      <div className="px-6 mb-8">
        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-soft">
          T
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                isActive
                  ? "bg-white text-primary shadow-soft font-bold"
                  : "text-neutral-500 hover:bg-white/50 hover:text-neutral-900",
              )}
            >
              <item.icon size={20} className={cn(isActive && "text-primary")} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4">
        <button className="w-full lg:flex items-center gap-3 px-4 py-4 bg-neutral-900 text-white rounded-[2rem] shadow-soft-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Plus size={20} className="mx-auto lg:mx-0" />
          <span className="hidden lg:block font-bold">New Product</span>
        </button>
      </div>
    </div>
  );
}
