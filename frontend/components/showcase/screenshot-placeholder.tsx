import { Card } from "@/components/ui/card";
import type { ScreenshotSlot } from "@/lib/branding/project-branding";

type ScreenshotPlaceholderProps = {
  slot: ScreenshotSlot;
};

/** Provides a capture-ready placeholder for portfolio screenshots. */
export function ScreenshotPlaceholder({ slot }: ScreenshotPlaceholderProps) {
  return (
    <Card aria-label={`${slot.title} screenshot placeholder`} className="min-h-48">
      <div className="storybook-border storybook-parchment flex min-h-32 items-center justify-center rounded-panel p-4 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Screenshot slot
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold storybook-ink">{slot.title}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{slot.description}</p>
      <p className="mt-2 text-xs font-semibold text-muted-foreground">Route: {slot.route}</p>
    </Card>
  );
}
