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
