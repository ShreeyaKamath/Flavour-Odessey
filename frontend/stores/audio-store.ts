import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AudioMixerChannel, AudioMixerSettings } from "@/lib/audio/types";
import { defaultAudioSettings } from "@/lib/audio/volume-mixer";

type AudioStore = AudioMixerSettings & {
  setEnabled: (enabled: boolean) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (channel: AudioMixerChannel, value: number) => void;
  toggleMuted: () => void;
};

export const audioStorageKey = "flavor-odyssey-audio";

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value));
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      ...defaultAudioSettings,
      setEnabled: (enabled) => set({ enabled }),
      setMuted: (muted) => set({ muted }),
      setVolume: (channel, value) => set({ [channel]: clampVolume(value) }),
      toggleMuted: () => set((state) => ({ muted: !state.muted }))
    }),
    {
      name: audioStorageKey,
      partialize: ({ ambient, enabled, master, music, muted, sfx }) => ({
        ambient,
        enabled,
        master,
        music,
        muted,
        sfx
      }),
      storage: createJSONStorage(() => localStorage)
    }
  )
);
