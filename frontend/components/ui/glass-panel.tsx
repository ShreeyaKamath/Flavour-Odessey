"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { panelReveal } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

type GlassPanelProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

/** Renders a translucent animated panel surface. */
export function GlassPanel({ children, className, ...props }: GlassPanelProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.div
      animate={reducedMotion ? undefined : "visible"}
      className={cn(
        "rounded-panel border border-border bg-surface/85 p-6 shadow-panel backdrop-blur-md",
        className
      )}
      data-motion-reduced={String(reducedMotion)}
      initial={reducedMotion ? false : "hidden"}
      variants={reducedMotion ? undefined : panelReveal}
      {...props}
    >
      {children}
    </motion.div>
  );
}
