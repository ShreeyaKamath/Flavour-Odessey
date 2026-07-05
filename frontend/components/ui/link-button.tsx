"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { interactionMotion } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

type LinkButtonVariant = "primary" | "secondary" | "ghost";

const MotionLink = motion.create(Link);

type LinkButtonProps = Omit<ComponentProps<typeof MotionLink>, "children" | "href"> & {
  children: ReactNode;
  href: string;
  variant?: LinkButtonVariant;
};

const variants: Record<LinkButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-glow hover:bg-primary/90",
  secondary: "border border-border bg-surface text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted"
};

/** Renders a Next.js link with shared button styling and motion. */
export function LinkButton({
  children,
  className,
  href,
  variant = "primary",
  ...props
}: LinkButtonProps) {
  const reducedMotion = useMotionPreference();

  return (
    <MotionLink
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-control px-4 py-2 text-sm font-semibold transition-colors duration-hover ease-soft",
        variants[variant],
        className
      )}
      data-motion-reduced={String(reducedMotion)}
      href={href}
      whileHover={reducedMotion ? undefined : interactionMotion.hover}
      whileTap={reducedMotion ? undefined : interactionMotion.tap}
      {...props}
    >
      {children}
    </MotionLink>
  );
}
