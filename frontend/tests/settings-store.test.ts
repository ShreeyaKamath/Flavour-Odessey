import { describe, expect, it } from "vitest";

import { useSettingsStore } from "@/stores/settings-store";

describe("settings store", () => {
  it("toggles between light and dark theme", () => {
    useSettingsStore.setState({ theme: "light", reducedMotion: false });

    useSettingsStore.getState().toggleTheme();

    expect(useSettingsStore.getState().theme).toBe("dark");
  });
});
