"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { ambientFloat } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

type FloatingPanelProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

/** Renders a softly floating raised panel. */
export function FloatingPanel({ children, className, ...props }: FloatingPanelProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.div
      animate={reducedMotion ? undefined : "floating"}
      className={cn(
        "rounded-panel border border-border bg-surface-raised p-4 shadow-panel",
        className
      )}
      data-motion-reduced={String(reducedMotion)}
      initial={reducedMotion ? false : "resting"}
      variants={reducedMotion ? undefined : ambientFloat}
      {...props}
    >
      {children}
    </motion.div>
  );
}
