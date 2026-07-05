import { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <article
      className={cn("rounded-panel border border-border bg-surface p-5 shadow-panel", className)}
      {...props}
    >
      {children}
    </article>
  );
}
