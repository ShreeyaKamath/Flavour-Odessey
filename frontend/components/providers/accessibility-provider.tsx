"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode, useEffect } from "react";

import { useReducedMotionSetting } from "@/hooks/use-reduced-motion-setting";

type AccessibilityProviderProps = {
  children: ReactNode;
};

/** Synchronizes system and app accessibility motion preferences. */
export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const reducedMotion = useReducedMotionSetting();

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

  return <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>{children}</MotionConfig>;
}
