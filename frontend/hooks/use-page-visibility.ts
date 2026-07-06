"use client";

import { useEffect, useState } from "react";

/** Reports whether animation work should run for the current browser tab. */
export function usePageVisibility() {
  const [visible, setVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState !== "hidden"
  );

  useEffect(() => {
    const updateVisibility = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return visible;
}
