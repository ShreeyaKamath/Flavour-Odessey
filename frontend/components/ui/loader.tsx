"use client";

import { motion } from "framer-motion";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { skeletonPulse } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

type LoaderProps = {
  fullScreen?: boolean;
  label?: string;
};

/** Displays an accessible reduced-motion-aware loading indicator. */
export function Loader({ fullScreen = false, label = "Loading" }: LoaderProps) {
  const reducedMotion = useMotionPreference();

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 text-sm text-muted-foreground",
        fullScreen && "fixed inset-0 z-overlay bg-background/70"
      )}
      data-motion-reduced={String(reducedMotion)}
      role="status"
    >
      <motion.span
        animate={reducedMotion ? undefined : "pulsing"}
        className="h-3 w-3 rounded-full bg-accent"
        initial={reducedMotion ? false : "resting"}
        variants={reducedMotion ? undefined : skeletonPulse}
      />
      <span>{label}</span>
    </div>
  );
}
