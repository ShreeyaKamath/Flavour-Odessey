"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { interactionMotion, panelReveal } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

type CardProps = HTMLMotionProps<"article"> & {
  children: ReactNode;
};

/** Renders an animated content card with shared surface styling. */
export function Card({ children, className, ...props }: CardProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.article
      animate={reducedMotion ? undefined : "visible"}
      className={cn("rounded-panel border border-border bg-surface p-5 shadow-panel", className)}
      data-motion-reduced={String(reducedMotion)}
      initial={reducedMotion ? false : "hidden"}
      variants={reducedMotion ? undefined : panelReveal}
      whileHover={reducedMotion ? undefined : interactionMotion.hover}
      {...props}
    >
      {children}
    </motion.article>
  );
}
