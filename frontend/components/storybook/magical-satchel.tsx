"use client";

import { ReactNode } from "react";

import { FantasyPanel } from "@/components/storybook/fantasy-panel";
import { audioEvents } from "@/lib/audio/audio-events";

type MagicalSatchelProps = {
  children: ReactNode;
  titleId?: string;
  title?: string;
};

/** Frames inventory content as a stitched magical satchel. */
export function MagicalSatchel({
  children,
  title = "Magical Satchel",
  titleId
}: MagicalSatchelProps) {
  return (
    <FantasyPanel
      className="border-dashed"
      data-visual-element="satchel_icon"
      onMouseEnter={() => audioEvents.publish("SatchelOpened")}
      style={{
        backgroundImage:
          "var(--storybook-ribbon-texture), var(--storybook-parchment-texture), linear-gradient(135deg, rgb(var(--storybook-parchment)), rgb(var(--storybook-parchment-deep) / 0.72))",
        backgroundPosition: "right top, center, center",
        backgroundRepeat: "no-repeat, repeat, no-repeat",
        backgroundSize: "5rem 100%, 18rem 18rem, auto"
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="storybook-ink font-display text-2xl font-semibold" id={titleId}>
          {title}
        </h2>
        <span aria-hidden="true" className="h-8 w-8 rounded-full border-4 border-primary/40" />
      </div>
      {children}
    </FantasyPanel>
  );
}
