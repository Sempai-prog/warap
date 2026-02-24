import React from "react";
import { Home, Calendar, Search, User } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] h-24 bg-white/70 backdrop-blur-xl border border-white/60 rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex items-center justify-around px-2 z-50">
      <NavBtn active icon={<Home size={24} />} />
      <NavBtn icon={<Calendar size={24} />} />
      <NavBtn icon={<Search size={24} />} />
      <NavBtn icon={<User size={24} />} />
    </nav>
  );
}

function NavBtn({ icon, active }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 relative group overflow-hidden ${
        active
          ? "bg-neutral-900 text-white shadow-xl shadow-neutral-900/20 active:scale-90"
          : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100/50"
      }`}
    >
      <span className="relative z-10">{icon}</span>
      {!active && (
        <div className="absolute inset-0 bg-neutral-900 translate-y-full group-hover:translate-y-[calc(100%-4px)] transition-transform duration-300" />
      )}
    </button>
  );
}
