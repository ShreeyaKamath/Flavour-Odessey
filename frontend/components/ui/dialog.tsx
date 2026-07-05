"use client";

import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type DialogProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function Dialog({ children, isOpen, onClose, title }: DialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-overlay flex items-center justify-center bg-foreground/30 p-4"
      role="dialog"
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-panel border border-border bg-surface p-6 shadow-panel"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl text-foreground">{title}</h2>
          <Button aria-label="Close dialog" onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
        <div className="mt-4 text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
