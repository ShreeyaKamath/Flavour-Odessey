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

  it("registers replaceable production audio slots with silent fallbacks", () => {
    const requestedAssets = [
      audioIds.joy_meadow_music,
      audioIds.golden_hour_theme,
      audioIds.night_theme,
      audioIds.weather_birds,
      audioIds.weather_wind,
      audioIds.weather_rain,
      audioIds.joy_meadow_ambience,
      audioIds.weather_night,
      audioIds.ui_click,
      audioIds.page_flip,
      audioIds.craft_success,
      audioIds.lumi_hint,
      audioIds.quest_complete,
      audioIds.restoration_joy
    ];

    expect(audioManifest.sources.silent_placeholder.generated).toBe(true);
    expect(audioManifest.sources.music_joy_meadow_theme.src).toBe(
      "/audio/music/joy-meadow-theme.ogg"
    );
    expect(audioManifest.sources.ambient_river.src).toBe("/audio/ambience/river.ogg");
    expect(audioManifest.sources.sfx_restore_joy.src).toBe("/audio/sfx/restore-joy.ogg");
    expect(requestedAssets.every((audioId) => audioManifest.assets[audioId].fallback_source)).toBe(
      true
    );
  });

  it("falls back to silent placeholder when a real audio file cannot play", async () => {
    const sources: string[] = [];
    let call = 0;
    const manager = new AudioManager(audioManifest, (source) => {
      sources.push(source);
      call += 1;
      return createAudioElement(
        call === 2 ? () => Promise.reject(new Error("Missing file")) : undefined
      );
    });

    await manager.unlock();
    expect(manager.sfx.play(audioIds.ui_click)).toBe(true);
    await Promise.resolve();

    expect(sources).toEqual([
      audioManifest.sources.silent_placeholder.src,
      audioManifest.sources.sfx_button_click.src,
      audioManifest.sources.silent_placeholder.src
    ]);
  });

  it("uses the silent source to unlock even when production sources are listed first", async () => {
    const sources: string[] = [];
    const reorderedManifest = {
      ...audioManifest,
      sources: {
        sfx_button_click: audioManifest.sources.sfx_button_click,
        ...audioManifest.sources
      }
    };
    const manager = new AudioManager(reorderedManifest, (source) => {
      sources.push(source);
      return createAudioElement();
    });

    await expect(manager.unlock()).resolves.toBe(true);
    expect(sources).toEqual([audioManifest.sources.silent_placeholder.src]);
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
