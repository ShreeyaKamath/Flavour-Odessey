import { describe, expect, it, vi } from "vitest";

import { AudioManager } from "@/lib/audio/audio-manager";
import { audioIds, audioManifest } from "@/lib/audio/manifest";
import type { AudioElementLike } from "@/lib/audio/types";

function createAudioElement(play: () => Promise<void> = () => Promise.resolve()): AudioElementLike {
  return {
    addEventListener: vi.fn(),
    currentTime: 0,
    loop: false,
    pause: vi.fn(),
    play,
    preload: "",
    volume: 1
  };
}

describe("AudioManager", () => {
  it("waits for unlock and applies effective bus volume", async () => {
    const elements: AudioElementLike[] = [];
    const manager = new AudioManager(audioManifest, () => {
      const element = createAudioElement();
      elements.push(element);
      return element;
    });
    manager.setMixerSettings({
      ambient: 1,
      enabled: true,
      master: 0.5,
      music: 1,
      muted: false,
      sfx: 0.4
    });

    expect(manager.sfx.play(audioIds.ui_click)).toBe(false);
    expect(elements).toHaveLength(0);
    await expect(manager.unlock()).resolves.toBe(true);
    expect(manager.sfx.play(audioIds.ui_click)).toBe(true);

    expect(elements[1].volume).toBeCloseTo(0.09);
  });

  it("does not crash when browser playback rejects", async () => {
    let call = 0;
    const manager = new AudioManager(audioManifest, () => {
      call += 1;
      return createAudioElement(
        call === 1 ? () => Promise.resolve() : () => Promise.reject(new Error("Playback blocked"))
      );
    });

    await manager.unlock();

    expect(() => manager.sfx.play(audioIds.crafting_sparkle)).not.toThrow();
    await Promise.resolve();
    expect(manager.playAsset("missing_audio", "sfx")).toBe(false);
  });

  it("stops playback when audio is disabled completely", async () => {
    const effect = createAudioElement();
    let call = 0;
    const manager = new AudioManager(audioManifest, () => {
      call += 1;
      return call === 1 ? createAudioElement() : effect;
    });
    await manager.unlock();
    manager.sfx.play(audioIds.ui_click);

    manager.setMixerSettings({
      ambient: 1,
      enabled: false,
      master: 1,
      music: 1,
      muted: false,
      sfx: 1
    });

    expect(effect.pause).toHaveBeenCalled();
    expect(manager.sfx.play(audioIds.ui_click)).toBe(false);
  });
});
