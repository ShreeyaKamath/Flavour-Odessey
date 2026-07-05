"use client";

import { useEffect, useState } from "react";

import { useSettingsStore } from "@/stores/settings-store";

export function useReducedMotionSetting() {
  const appReducedMotion = useSettingsStore((state) => state.reducedMotion);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => setSystemReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return appReducedMotion || systemReducedMotion;
}
