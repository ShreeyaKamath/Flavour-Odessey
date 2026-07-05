"use client";

import { ReactNode, useEffect } from "react";

import { useReducedMotionSetting } from "@/hooks/use-reduced-motion-setting";

type AccessibilityProviderProps = {
  children: ReactNode;
};

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const reducedMotion = useReducedMotionSetting();

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

  return <>{children}</>;
}
