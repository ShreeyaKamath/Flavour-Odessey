"use client";

import { ReactNode } from "react";

import { MagicalPage } from "@/components/storybook/magical-page";
import { audioEvents } from "@/lib/audio/audio-events";

type EnchantedCookbookProps = {
  children: ReactNode;
};

/** Frames recipes and crafting lore as an enchanted cookbook spread. */
export function EnchantedCookbook({ children }: EnchantedCookbookProps) {
  return (
    <div onMouseEnter={() => audioEvents.publish("BookOpened")}>
      <MagicalPage eyebrow="Enchanted cookbook" title="Golden Vanilla Bloom">
        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-panel border border-border bg-surface/70 p-4">
            <p className="text-sm font-semibold text-accent">Book tabs</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Heart Flavor, Ingredients, Lore, Memory
            </p>
          </div>
          <div>{children}</div>
        </div>
      </MagicalPage>
    </div>
  );
}
