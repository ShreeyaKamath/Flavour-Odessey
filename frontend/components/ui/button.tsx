"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { interactionMotion } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-glow hover:bg-primary/90",
  secondary: "border border-border bg-surface text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted"
};

/** Renders the shared animated command button. */
export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-control px-4 py-2 text-sm font-semibold transition-colors duration-hover ease-soft disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      data-motion-reduced={String(reducedMotion)}
      type={type}
      whileHover={reducedMotion ? undefined : interactionMotion.hover}
      whileTap={reducedMotion ? undefined : interactionMotion.tap}
      {...props}
    >
      {children}
    </motion.button>
  );
}
