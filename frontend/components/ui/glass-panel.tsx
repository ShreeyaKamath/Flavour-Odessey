import { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlassPanel({ children, className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-panel border border-border bg-surface/85 p-6 shadow-panel backdrop-blur-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
