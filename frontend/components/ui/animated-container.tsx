"use client";

import { HTMLMotionProps, motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

import { fadeInUp } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

type AnimatedContainerProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function AnimatedContainer({ children, className, ...props }: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate="visible"
      className={cn(className)}
      initial={shouldReduceMotion ? false : "hidden"}
      variants={shouldReduceMotion ? undefined : fadeInUp}
      {...props}
    >
      {children}
    </motion.div>
  );
}
