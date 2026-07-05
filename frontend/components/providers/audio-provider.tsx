"use client";

import { ReactNode, createContext, useContext } from "react";

import { audioManager } from "@/lib/audio/audio-manager";

const AudioContext = createContext(audioManager);

type AudioProviderProps = {
  children: ReactNode;
};

/** Exposes the shared audio manager without starting playback. */
export function AudioProvider({ children }: AudioProviderProps) {
  return <AudioContext.Provider value={audioManager}>{children}</AudioContext.Provider>;
}

export function useAudioManager() {
  return useContext(AudioContext);
}
