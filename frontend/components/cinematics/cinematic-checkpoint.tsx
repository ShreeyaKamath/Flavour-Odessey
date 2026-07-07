"use client";

import { GlowingBookmark } from "@/components/storybook/glowing-bookmark";
import type { CinematicId } from "@/lib/cinematics";

/** Marks a story checkpoint unlocked by a major cinematic beat. */
export function CinematicCheckpoint({ label, sceneId }: { label: string; sceneId: CinematicId }) {
  return (
    <div data-cinematic-checkpoint={sceneId}>
      <GlowingBookmark label={label} sublabel="Cinematic checkpoint" />
    </div>
  );
}
