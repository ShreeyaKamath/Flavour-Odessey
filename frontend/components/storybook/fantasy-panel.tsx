"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { interactionMotion, panelReveal } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

type FantasyPanelProps = HTMLMotionProps<"article"> & {
  children: ReactNode;
  framed?: boolean;
};

/** Renders a reusable parchment fantasy panel with accessible motion behavior. */
export function FantasyPanel({ children, className, framed = true, ...props }: FantasyPanelProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.article
      animate={reducedMotion ? undefined : "visible"}
      className={cn(
        "storybook-parchment relative overflow-hidden rounded-panel p-5 text-foreground",
        framed ? "storybook-border" : "border border-border shadow-panel",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgb(var(--color-surface-raised)/0.16),transparent)]",
        className
      )}
      data-motion-reduced={String(reducedMotion)}
      data-render-source="asset_manifest"
      data-visual-element="parchment_panel"
      initial={reducedMotion ? false : "hidden"}
      variants={reducedMotion ? undefined : panelReveal}
      whileHover={reducedMotion ? undefined : interactionMotion.hover}
      {...props}
    >
      <div className="relative">{children}</div>
    </motion.article>
  );
}
