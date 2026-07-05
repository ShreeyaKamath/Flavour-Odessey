"use client";

import { HTMLMotionProps, motion } from "framer-motion";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { skeletonPulse } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

type SkeletonProps = HTMLMotionProps<"div">;

/** Displays a reduced-motion-aware loading placeholder. */
export function Skeleton({ className, ...props }: SkeletonProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.div
      animate={reducedMotion ? undefined : "pulsing"}
      aria-hidden="true"
      className={cn("rounded-control bg-muted", className)}
      data-motion-reduced={String(reducedMotion)}
      initial={reducedMotion ? false : "resting"}
      variants={reducedMotion ? undefined : skeletonPulse}
      {...props}
    />
  );
}
