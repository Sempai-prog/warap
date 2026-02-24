"use client";

import React from "react";
import { Menu, Bell } from "lucide-react";

export function MobileHeader() {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-sm">
          T
        </div>
        <span className="font-bold tracking-tight">TonApp</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors">
          <Menu size={20} />
        </button>
      </div>
    </>
  );
}
