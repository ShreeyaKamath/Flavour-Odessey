import Link from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type LinkButtonVariant = "primary" | "secondary" | "ghost";

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: LinkButtonVariant;
};

const variants: Record<LinkButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-glow hover:bg-primary/90",
  secondary: "border border-border bg-surface text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted"
};

export function LinkButton({
  children,
  className,
  href,
  variant = "primary",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-control px-4 py-2 text-sm font-semibold transition-colors duration-hover ease-soft",
        variants[variant],
        className
      )}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
