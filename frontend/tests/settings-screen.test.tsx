import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { SettingsScreen } from "@/features/settings/settings-screen";
import { defaultAudioSettings } from "@/lib/audio/volume-mixer";
import { useAudioStore } from "@/stores/audio-store";

describe("SettingsScreen audio controls", () => {
  afterEach(() => {
    cleanup();
    act(() => {
      useAudioStore.setState(defaultAudioSettings);
    });
    localStorage.clear();
  });

  it("renders persisted mixer controls and updates their state", async () => {
    const user = userEvent.setup();
    render(<SettingsScreen />);

    const master = screen.getByRole("slider", {
      name: "Master volume"
    });
    expect(master).toHaveValue("1");
    fireEvent.change(master, { target: { value: "0.5" } });
    expect(useAudioStore.getState().master).toBe(0.5);

    await user.click(screen.getByRole("button", { name: "Mute audio" }));
    expect(screen.getByRole("button", { name: "Unmute audio" })).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "Enable audio" }));
    expect(master).toBeDisabled();
    expect(useAudioStore.getState().enabled).toBe(false);
  });
});
