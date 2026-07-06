"use client";

import { useEffect } from "react";

import { useAudioManager } from "@/components/providers/audio-provider";
import { audioIds } from "@/lib/audio/manifest";

type JoyMeadowAudioProps = {
  active: boolean;
};

/** Requests Joy Meadow music and ambience while its scene is active. */
export function JoyMeadowAudio({ active }: JoyMeadowAudioProps) {
  const manager = useAudioManager();

  useEffect(() => {
    if (!active) {
      return;
    }

    manager.music.play(audioIds.joy_meadow_music);
    manager.ambient.enter(audioIds.joy_meadow_ambience);
    return () => {
      manager.music.stop();
      manager.ambient.leave();
    };
  }, [active, manager]);

  return null;
}
