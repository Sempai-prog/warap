import React from "react";

export function StatusCard() {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white/60 flex items-center justify-between relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#E0F4EE]/30 blur-3xl rounded-full" />

      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative h-7 w-7 flex items-center justify-center">
            {/* Soft UI Progress Ring Indicator */}
            <div className="absolute inset-0 rounded-full border-[2.5px] border-[#E0F4EE]" />
            <div className="h-2 w-2 rounded-full bg-[#2A9D8F] shadow-[0_0_10px_rgba(42,157,143,0.4)]" />

            {/* Dynamic Progress Dots */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute h-1.5 w-1.5 rounded-full transition-all duration-500 ${i === 0 ? "bg-[#2A9D8F]" : "bg-[#2A9D8F]/20"}`}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 45}deg) translate(10px) translate(-50%, -50%)`,
                }}
              />
            ))}
          </div>
          <span className="text-[11px] uppercase font-bold tracking-[0.18em] text-neutral-400">
            Status
          </span>
        </div>
        <p className="text-6xl font-bold text-neutral-900 tracking-tighter group-hover:scale-105 transition-transform duration-500 origin-left">
          17%
        </p>
      </div>

      {/* Optional Right Insight (e.g., Streak/Count) */}
      <div className="h-16 w-16 rounded-3xl bg-neutral-50 border border-neutral-100 flex flex-col items-center justify-center shadow-inner">
        <span className="text-[10px] uppercase font-bold text-neutral-400">
          Left
        </span>
        <span className="text-xl font-bold text-neutral-800">12</span>
      </div>
    </div>
  );
}
