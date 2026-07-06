"use client";

import { ReactNode, createContext, useContext, useEffect } from "react";

import { audioEvents, audioEventIds } from "@/lib/audio/audio-events";
import { AudioManager, audioManager } from "@/lib/audio/audio-manager";
import { audioManifest } from "@/lib/audio/manifest";
import { useAudioStore } from "@/stores/audio-store";

const AudioContext = createContext(audioManager);

type AudioProviderProps = {
  children: ReactNode;
  manager?: AudioManager;
};

/** Connects persisted mixer settings, audio events, and autoplay unlock. */
export function AudioProvider({ children, manager = audioManager }: AudioProviderProps) {
  const ambient = useAudioStore((state) => state.ambient);
  const enabled = useAudioStore((state) => state.enabled);
  const master = useAudioStore((state) => state.master);
  const music = useAudioStore((state) => state.music);
  const muted = useAudioStore((state) => state.muted);
  const sfx = useAudioStore((state) => state.sfx);

  useEffect(() => {
    manager.setMixerSettings({
      ambient,
      enabled,
      master,
      music,
      muted,
      sfx
    });
  }, [ambient, enabled, manager, master, music, muted, sfx]);

  useEffect(() => {
    let mounted = true;
    const removeUnlockListeners = () => {
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("pointerdown", unlock);
    };
    const unlock = () => {
      void manager.unlock().then((unlocked) => {
        if (mounted && unlocked) {
          removeUnlockListeners();
        }
      });
    };

    window.addEventListener("keydown", unlock);
    window.addEventListener("pointerdown", unlock);
    return () => {
      mounted = false;
      removeUnlockListeners();
      manager.dispose();
    };
  }, [manager]);

  useEffect(
    () =>
      audioEvents.subscribe((event) => {
        const audioId = audioEventIds[event];
        const asset = audioManifest.assets[audioId];
        if (asset?.bus === "sfx") {
          manager.sfx.play(audioId);
        }
      }),
    [manager]
  );

  return <AudioContext.Provider value={manager}>{children}</AudioContext.Provider>;
}

/** Returns the manager owned by the nearest audio provider. */
export function useAudioManager() {
  return useContext(AudioContext);
}
