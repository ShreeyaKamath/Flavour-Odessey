"use client";

import { ReactNode, useId } from "react";

type TooltipProps = {
  children: ReactNode;
  label: string;
};

export function Tooltip({ children, label }: TooltipProps) {
  const id = useId();

  return (
    <span className="group relative inline-flex">
      <span aria-describedby={id}>{children}</span>
      <span
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-control bg-foreground px-2 py-1 text-xs text-background shadow-panel group-hover:block group-focus-within:block"
        id={id}
        role="tooltip"
      >
        {label}
      </span>
    </span>
  );
}
