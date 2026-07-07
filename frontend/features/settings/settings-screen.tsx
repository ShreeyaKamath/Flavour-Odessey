"use client";

import { VolumeControl } from "@/components/audio/volume-control";
import { CrystalSettingsPanel } from "@/components/storybook/crystal-settings-panel";
import { MagicalTooltip } from "@/components/storybook/magical-tooltip";
import { StorybookShell } from "@/components/storybook/storybook-shell";
import { Button } from "@/components/ui/button";
import { useAudioStore } from "@/stores/audio-store";
import { useSettingsStore } from "@/stores/settings-store";

/** Renders theme, accessibility, and persisted audio mixer controls. */
export function SettingsScreen() {
  const ambient = useAudioStore((state) => state.ambient);
  const audioEnabled = useAudioStore((state) => state.enabled);
  const master = useAudioStore((state) => state.master);
  const music = useAudioStore((state) => state.music);
  const muted = useAudioStore((state) => state.muted);
  const setAudioEnabled = useAudioStore((state) => state.setEnabled);
  const setVolume = useAudioStore((state) => state.setVolume);
  const sfx = useAudioStore((state) => state.sfx);
  const toggleMuted = useAudioStore((state) => state.toggleMuted);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const setReducedMotion = useSettingsStore((state) => state.setReducedMotion);
  const theme = useSettingsStore((state) => state.theme);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);

  return (
    <StorybookShell
      description="Adjust visual accessibility and the independent sound layers used throughout the adventure."
      eyebrow="Settings"
      title="Crystal menu"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <CrystalSettingsPanel title="Theme">
          <p className="mt-2 text-sm text-muted-foreground">Current theme: {theme}</p>
          <MagicalTooltip label="Switch between parchment day ink and moonlit ink.">
            <Button className="mt-4" onClick={toggleTheme} variant="secondary">
              Toggle theme
            </Button>
          </MagicalTooltip>
        </CrystalSettingsPanel>
        <CrystalSettingsPanel title="Motion">
          <label className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <input
              checked={reducedMotion}
              className="h-4 w-4"
              onChange={(event) => setReducedMotion(event.target.checked)}
              type="checkbox"
            />
            Reduce motion
          </label>
        </CrystalSettingsPanel>
        <CrystalSettingsPanel className="sm:col-span-2" title="Audio mixer">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mt-2 text-sm text-muted-foreground">
                Sound preferences are saved in this browser.
              </p>
            </div>
            <Button disabled={!audioEnabled} onClick={toggleMuted} variant="secondary">
              {muted ? "Unmute audio" : "Mute audio"}
            </Button>
          </div>

          <label className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
            <input
              checked={audioEnabled}
              className="h-4 w-4"
              onChange={(event) => setAudioEnabled(event.target.checked)}
              type="checkbox"
            />
            Enable audio
          </label>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <VolumeControl
              disabled={!audioEnabled}
              label="Master"
              onChange={(value) => setVolume("master", value)}
              value={master}
            />
            <VolumeControl
              disabled={!audioEnabled}
              label="Music"
              onChange={(value) => setVolume("music", value)}
              value={music}
            />
            <VolumeControl
              disabled={!audioEnabled}
              label="Sound effects"
              onChange={(value) => setVolume("sfx", value)}
              value={sfx}
            />
            <VolumeControl
              disabled={!audioEnabled}
              label="Ambience"
              onChange={(value) => setVolume("ambient", value)}
              value={ambient}
            />
          </div>
        </CrystalSettingsPanel>
      </div>
    </StorybookShell>
  );
}
