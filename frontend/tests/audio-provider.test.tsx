import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AudioProvider } from "@/components/providers/audio-provider";
import { audioEvents } from "@/lib/audio/audio-events";
import { AudioManager } from "@/lib/audio/audio-manager";
import { audioManifest } from "@/lib/audio/manifest";
import type { AudioElementLike } from "@/lib/audio/types";
import { defaultAudioSettings } from "@/lib/audio/volume-mixer";
import { useAudioStore } from "@/stores/audio-store";

describe("AudioProvider", () => {
  afterEach(() => {
    cleanup();
    useAudioStore.setState(defaultAudioSettings);
    localStorage.clear();
  });

  it("unlocks on first interaction and routes audio events", async () => {
    const elements: AudioElementLike[] = [];
    const manager = new AudioManager(audioManifest, () => {
      const element: AudioElementLike = {
        addEventListener: vi.fn(),
        currentTime: 0,
        loop: false,
        pause: vi.fn(),
        play: vi.fn().mockResolvedValue(undefined),
        preload: "",
        volume: 1
      };
      elements.push(element);
      return element;
    });
    render(
      <AudioProvider manager={manager}>
        <div>Audio test</div>
      </AudioProvider>
    );

    expect(manager.isUnlocked()).toBe(false);
    fireEvent.pointerDown(window);
    await waitFor(() => expect(manager.isUnlocked()).toBe(true));
    audioEvents.publish("UIClicked");

    expect(elements).toHaveLength(2);
    expect(elements[1].play).toHaveBeenCalled();
  });
});
