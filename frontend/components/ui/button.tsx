"use client";

import { HTMLMotionProps, motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

import { motionTokens } from "@/lib/design-tokens";
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

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-control px-4 py-2 text-sm font-semibold transition-colors duration-hover ease-soft disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      type={type}
      whileHover={shouldReduceMotion ? undefined : { scale: motionTokens.hoverScale }}
      whileTap={shouldReduceMotion ? undefined : { scale: motionTokens.pressScale }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
