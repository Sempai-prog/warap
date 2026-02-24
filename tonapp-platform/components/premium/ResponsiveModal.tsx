"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ResponsiveModalProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function ResponsiveModal({
  children,
  title,
  description,
  trigger,
  open,
  onOpenChange,
  className,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent
          className={cn(
            "sm:max-w-[425px] rounded-[2rem] border-white/60 shadow-soft-lg backdrop-blur-xl bg-white/90",
            className,
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-neutral-500">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4 overflow-y-auto max-h-[70vh]">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent className="rounded-t-[3rem] border-t-white/60 bg-white/95 backdrop-blur-2xl">
        <DrawerHeader className="text-left px-6 pt-6">
          <DrawerTitle className="text-2xl font-bold tracking-tight">
            {title}
          </DrawerTitle>
          {description && (
            <DrawerDescription className="text-neutral-500">
              {description}
            </DrawerDescription>
          )}
        </DrawerHeader>
        <div className="px-6 pb-12 pt-2 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
