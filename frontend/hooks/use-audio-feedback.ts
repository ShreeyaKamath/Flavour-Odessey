"use client";

import { useCallback } from "react";

import { audioEvents, type AudioEventName } from "@/lib/audio/audio-events";

/** Publishes UI audio intents without exposing playback services to controls. */
export function useAudioFeedback() {
  const publish = useCallback((event: AudioEventName) => {
    audioEvents.publish(event);
  }, []);

  return {
    click: () => publish("UIClicked"),
    hover: () => publish("UIHovered")
  };
}
