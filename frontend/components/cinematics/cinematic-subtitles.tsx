"use client";

import type { CinematicFrame } from "@/lib/cinematics";

/** Displays cinematic narration with speaker, emotion, portrait, and live subtitles. */
export function CinematicSubtitles({ frame }: { frame: CinematicFrame }) {
  if (!frame.narration) {
    return null;
  }

  return (
    <div className="absolute inset-x-4 bottom-8 z-20 mx-auto max-w-3xl rounded-panel border border-border bg-background/90 p-4 shadow-panel backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div
          aria-label={`${frame.narration.speaker} portrait`}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-accent/15 font-display font-semibold text-accent shadow-glow"
          role="img"
        >
          {frame.narration.speaker.slice(0, 1)}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {frame.narration.speaker} - {frame.narration.emotion}
          </p>
          <p aria-live="polite" className="mt-2 min-h-12 leading-7 text-foreground">
            {frame.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
