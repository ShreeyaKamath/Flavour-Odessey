"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenShell } from "@/features/screens/screen-shell";
import { useSettingsStore } from "@/stores/settings-store";

/** Renders theme and reduced-motion controls. */
export function SettingsScreen() {
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const setReducedMotion = useSettingsStore((state) => state.setReducedMotion);
  const theme = useSettingsStore((state) => state.theme);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);

  return (
    <ScreenShell
      description="Theme and reduced-motion controls demonstrate the settings architecture without persisting player preferences yet."
      eyebrow="Settings"
      title="Settings foundation"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-foreground">Theme</h2>
          <p className="mt-2 text-sm text-muted-foreground">Current theme: {theme}</p>
          <Button className="mt-4" onClick={toggleTheme} variant="secondary">
            Toggle theme
          </Button>
        </Card>
        <Card>
          <h2 className="font-semibold text-foreground">Motion</h2>
          <label className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <input
              checked={reducedMotion}
              className="h-4 w-4"
              onChange={(event) => setReducedMotion(event.target.checked)}
              type="checkbox"
            />
            Reduce motion
          </label>
        </Card>
      </div>
    </ScreenShell>
  );
}
