import { create } from "zustand";

export type ThemeMode = "light" | "dark";

type SettingsState = {
  reducedMotion: boolean;
  theme: ThemeMode;
  setReducedMotion: (value: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  reducedMotion: false,
  theme: "light",
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }))
}));
