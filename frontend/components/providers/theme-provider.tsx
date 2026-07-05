"use client";

import { ReactNode, useEffect } from "react";

import { useSettingsStore } from "@/stores/settings-store";

type ThemeProviderProps = {
  children: ReactNode;
};

/** Mirrors the selected theme onto the document element. */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
}
