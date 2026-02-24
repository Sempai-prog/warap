"use client";

import React, { useState } from "react";
import { ResponsiveModal } from "@/components/premium/ResponsiveModal";
import {
  IdentityFormWrapper,
  DesignFormWrapper,
  BusinessFormWrapper,
} from "@/components/settings/SettingsWrappers";
import {
  ChevronRight,
  Palette,
  Store,
  CreditCard,
  ShieldQuestion,
  Bell,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const settingCategories = [
  {
    id: "identity",
    title: "Identité de la boutique",
    description: "Nom, bio, logo et bannière",
    icon: Store,
    color: "bg-mint-card text-mint-text",
    content: <IdentityFormWrapper />,
  },
  {
    id: "design",
    title: "Apparence & Visuels",
    description: "Couleurs, polices et mise en page",
    icon: Palette,
    color: "bg-blue-card text-blue-text",
    content: <DesignFormWrapper />,
  },
  {
    id: "business",
    title: "Business & Paiements",
    description: "Paiements MoMo/Orange et livraison",
    icon: CreditCard,
    color: "bg-purple-card text-purple-text",
    content: <BusinessFormWrapper />,
  },
];

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-1">
        <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-bold tracking-tight text-neutral-900">
          Réglages
        </h1>
        <p className="text-neutral-500 font-medium">
          Configurez votre empire TonApp
        </p>
      </header>

      {/* Settings Grid/List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {settingCategories.map((category) => (
          <motion.button
            variants={itemVariants}
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className="group flex flex-col p-6 bg-white rounded-[2.5rem] border border-white/60 shadow-soft hover:shadow-soft-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-left relative overflow-hidden"
          >
            {/* Background Glow */}
            <div
              className={cn(
                "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[40px] opacity-20 transition-opacity group-hover:opacity-30",
                category.color,
              )}
            />

            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm",
                category.color,
              )}
            >
              <category.icon size={28} />
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                {category.title}
                <ChevronRight
                  size={18}
                  className="text-neutral-300 group-hover:translate-x-1 transition-transform"
                />
              </h3>
              <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                {category.description}
              </p>
            </div>
          </motion.button>
        ))}

        {/* Placeholder for future categories */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col p-6 bg-neutral-100/50 rounded-[2.5rem] border border-dashed border-neutral-200 opacity-60"
        >
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6">
            <Bell className="text-neutral-300" size={28} />
          </div>
          <h3 className="font-bold text-lg text-neutral-300 italic">
            Prochainement...
          </h3>
        </motion.div>
      </motion.div>

      {/* Responsive Modals for Settings Content */}
      {settingCategories.map((category) => (
        <ResponsiveModal
          key={category.id}
          open={activeCategory === category.id}
          onOpenChange={(open) => !open && setActiveCategory(null)}
          title={category.title}
          description={category.description}
          className="max-w-xl"
        >
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            {category.content}
          </div>
        </ResponsiveModal>
      ))}

      {/* Support Section */}
      <section className="mt-12 p-8 bg-neutral-900 rounded-[3rem] text-white shadow-soft-xl flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
            <ShieldQuestion size={24} className="text-mint-text" />
            Besoin d'aide ?
          </h3>
          <p className="text-neutral-400 font-medium">
            Notre équipe de support est disponible 24/7 sur WhatsApp.
          </p>
        </div>
        <button className="h-14 px-8 bg-white text-neutral-900 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg whitespace-nowrap">
          Contacter le Support
        </button>
      </section>
    </div>
  );
}
