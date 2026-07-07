"use client";

import { ReactNode } from "react";

import { audioEvents } from "@/lib/audio/audio-events";

type MagicalTooltipProps = {
  children: ReactNode;
  label: string;
};

/** Wraps focusable content with a native tooltip and magical audio cue. */
export function MagicalTooltip({ children, label }: MagicalTooltipProps) {
  return (
    <span
      onFocus={() => audioEvents.publish("MagicalTooltipShown")}
      onMouseEnter={() => audioEvents.publish("MagicalTooltipShown")}
      title={label}
    >
      {children}
    </span>
  );
}
