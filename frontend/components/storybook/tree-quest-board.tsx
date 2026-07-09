"use client";

import { ReactNode } from "react";

import { FantasyPanel } from "@/components/storybook/fantasy-panel";
import { audioEvents } from "@/lib/audio/audio-events";

type TreeQuestBoardProps = {
  children: ReactNode;
};

/** Presents quest content as a carved notice board from Joy Meadow's trees. */
export function TreeQuestBoard({ children }: TreeQuestBoardProps) {
  return (
    <FantasyPanel
      className="bg-[linear-gradient(135deg,rgb(var(--storybook-parchment-deep)/0.86),rgb(var(--storybook-parchment)/0.7))]"
      data-visual-element="wood_panel"
      onMouseEnter={() => audioEvents.publish("PageFlipped")}
      style={{
        backgroundImage:
          "var(--storybook-wood-texture), linear-gradient(135deg, rgb(var(--storybook-parchment-deep) / 0.86), rgb(var(--storybook-parchment) / 0.7))",
        backgroundSize: "18rem 18rem, auto"
      }}
    >
      <div className="mb-4 flex items-center gap-3">
        <span aria-hidden="true" className="h-7 w-7 rounded-full bg-primary/25" />
        <h2 className="storybook-ink font-display text-2xl font-semibold">Tree Quest Board</h2>
      </div>
      {children}
    </FantasyPanel>
  );
}
