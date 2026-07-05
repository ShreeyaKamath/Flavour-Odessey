"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { panelReveal } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

type AnimatedContainerProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

/** Reveals arbitrary content with the shared panel entrance motion. */
export function AnimatedContainer({ children, className, ...props }: AnimatedContainerProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.div
      animate={reducedMotion ? undefined : "visible"}
      className={cn(className)}
      data-motion-reduced={String(reducedMotion)}
      initial={reducedMotion ? false : "hidden"}
      variants={reducedMotion ? undefined : panelReveal}
      {...props}
    >
      {children}
    </motion.div>
  );
}
