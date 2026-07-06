import { afterEach, describe, expect, it } from "vitest";

import { defaultAudioSettings } from "@/lib/audio/volume-mixer";
import { audioStorageKey, useAudioStore } from "@/stores/audio-store";

describe("audio store", () => {
  afterEach(() => {
    useAudioStore.setState(defaultAudioSettings);
    localStorage.clear();
  });

  it("updates mixer volumes and mute state", () => {
    useAudioStore.getState().setVolume("music", 0.35);
    useAudioStore.getState().setVolume("sfx", 2);
    useAudioStore.getState().toggleMuted();

    expect(useAudioStore.getState().music).toBe(0.35);
    expect(useAudioStore.getState().sfx).toBe(1);
    expect(useAudioStore.getState().muted).toBe(true);
  });

  it("persists and rehydrates mixer preferences", async () => {
    localStorage.clear();
    useAudioStore.getState().setVolume("ambient", 0.4);
    useAudioStore.getState().setMuted(true);
    useAudioStore.getState().setEnabled(false);
    const saved = localStorage.getItem(audioStorageKey);

    expect(saved).not.toBeNull();
    useAudioStore.setState(defaultAudioSettings);
    localStorage.setItem(audioStorageKey, saved!);
    await useAudioStore.persist.rehydrate();

    expect(useAudioStore.getState()).toMatchObject({
      ambient: 0.4,
      enabled: false,
      muted: true
    });
  });
});
