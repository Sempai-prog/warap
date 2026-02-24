import React from "react";
import { Check } from "lucide-react";

interface TaskCardProps {
  title: string;
  room: string;
  duration: string;
  type: "mint" | "blue" | "purple";
  isCompleted?: boolean;
}

export function TaskCard({
  title,
  room,
  duration,
  type,
  isCompleted,
}: TaskCardProps) {
  const styles = {
    mint: {
      tag: "bg-[#E0F4EE] text-[#2A9D8F]",
      dot: "bg-[#2A9D8F]",
      shadow: "group-hover:shadow-[#2A9D8F]/5",
    },
    blue: {
      tag: "bg-[#EBF5FF] text-[#3182CE]",
      dot: "bg-[#3182CE]",
      shadow: "group-hover:shadow-[#3182CE]/5",
    },
    purple: {
      tag: "bg-[#F5F3FF] text-[#7C3AED]",
      dot: "bg-[#7C3AED]",
      shadow: "group-hover:shadow-[#7C3AED]/5",
    },
  };

  return (
    <div
      className={`group bg-white rounded-[2rem] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white/60 flex items-center gap-4 transition-all duration-300 hover:shadow-[0_15px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 active:scale-[0.97] ${styles[type].shadow}`}
    >
      {/* Custom Circular Checkbox */}
      <div
        className={`h-10 w-10 min-w-[40px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          isCompleted
            ? `${styles[type].tag} border-transparent`
            : "border-neutral-100 group-hover:border-neutral-200 bg-neutral-50/50"
        }`}
      >
        {isCompleted && <Check size={18} strokeWidth={3} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h3
            className={`font-bold text-neutral-900 truncate leading-none ${isCompleted ? "line-through opacity-40" : ""}`}
          >
            {title}
          </h3>
          <span className="text-[10px] font-bold text-neutral-400">
            {duration}
          </span>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${styles[type].tag} text-[10px] font-bold uppercase tracking-wider transition-transform group-hover:scale-105 origin-left`}
        >
          <div className={`h-1.5 w-1.5 rounded-full ${styles[type].dot}`} />
          {room}
        </div>
      </div>
    </div>
  );
}
