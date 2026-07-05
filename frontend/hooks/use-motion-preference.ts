"use client";

import { useReducedMotion } from "framer-motion";

import { useSettingsStore } from "@/stores/settings-store";

export function useMotionPreference() {
  const appReducedMotion = useSettingsStore((state) => state.reducedMotion);
  const systemReducedMotion = useReducedMotion();

  return appReducedMotion || Boolean(systemReducedMotion);
}
