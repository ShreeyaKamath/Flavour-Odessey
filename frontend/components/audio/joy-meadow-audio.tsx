"use client";

import { useEffect } from "react";

import { useAudioManager } from "@/components/providers/audio-provider";
import { audioIds } from "@/lib/audio/manifest";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type JoyMeadowAudioProps = {
  active: boolean;
  world: LivingWorldSnapshot;
};

/** Requests Joy Meadow music and ambience while its scene is active. */
export function JoyMeadowAudio({ active, world }: JoyMeadowAudioProps) {
  const manager = useAudioManager();

  useEffect(() => {
    if (!active) {
      return;
    }

    manager.music.play(audioIds.joy_meadow_music);
    manager.ambient.enter(world.audioAmbience ?? audioIds.joy_meadow_ambience);
    return () => {
      manager.music.stop();
      manager.ambient.leave();
    };
  }, [active, manager, world.audioAmbience]);

  return null;
}
