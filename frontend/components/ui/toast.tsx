"use client";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";

export function Toast() {
  const toasts = useUiStore((state) => state.toasts);
  const dismissToast = useUiStore((state) => state.dismissToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-toast flex max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          className="rounded-panel border border-border bg-surface-raised p-4 text-sm text-foreground shadow-panel"
          key={toast.id}
          role="status"
        >
          <div className="flex items-center gap-3">
            <p className="flex-1">{toast.message}</p>
            <Button
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
              variant="ghost"
            >
              Dismiss
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
