"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: ShoppingCart, label: "Orders", href: "/orders" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-around h-full px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 w-16 h-12 transition-all duration-300",
              isActive ? "text-primary" : "text-neutral-400",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="navIndicator"
                className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <item.icon
              size={22}
              className={cn(
                "transition-transform duration-300",
                isActive && "scale-110",
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
