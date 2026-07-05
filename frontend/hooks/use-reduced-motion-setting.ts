"use client";

import { useEffect } from "react";

import { useSettingsStore } from "@/stores/settings-store";

export function useReducedMotionSetting() {
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const setReducedMotion = useSettingsStore((state) => state.setReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setReducedMotion]);

  return reducedMotion;
}
