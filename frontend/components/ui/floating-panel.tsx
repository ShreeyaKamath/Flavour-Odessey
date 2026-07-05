import { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type FloatingPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function FloatingPanel({ children, className, ...props }: FloatingPanelProps) {
  return (
    <div
      className={cn(
        "animate-float rounded-panel border border-border bg-surface-raised p-4 shadow-panel",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
