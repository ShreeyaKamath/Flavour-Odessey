import { ReactNode } from "react";

import { FantasyPanel } from "@/components/storybook/fantasy-panel";
import { audioEvents } from "@/lib/audio/audio-events";
import { cn } from "@/utils/cn";

type CrystalSettingsPanelProps = {
  children: ReactNode;
  className?: string;
  title: string;
};

/** Frames settings controls as a crystal menu shard. */
export function CrystalSettingsPanel({ children, className, title }: CrystalSettingsPanelProps) {
  return (
    <FantasyPanel
      className={cn(
        "bg-[radial-gradient(circle_at_top_right,rgb(var(--storybook-crystal)/0.24),transparent_14rem),linear-gradient(135deg,rgb(var(--storybook-parchment)),rgb(var(--color-surface)/0.86))]",
        className
      )}
      data-visual-element="crystal_panel"
      onMouseEnter={() => audioEvents.publish("CrystalSelected")}
    >
      <h2 className="storybook-ink font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </FantasyPanel>
  );
}
