import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CinematicMoment } from "@/components/cinematics/cinematic-moment";
import { audioEvents } from "@/lib/audio/audio-events";

describe("cinematic overlay", () => {
  it("opens an accessible cinematic and supports skipping", async () => {
    const publish = vi.spyOn(audioEvents, "publish");
    const user = userEvent.setup();

    render(<CinematicMoment label="Play intro" sceneId="opening" />);

    await user.click(screen.getByRole("button", { name: "Play Opening Cinematic" }));
    expect(screen.getByRole("dialog", { name: "Opening Cinematic cinematic" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Skip Opening Cinematic" })).toBeInTheDocument();
    expect(publish).toHaveBeenCalledWith("CinematicStarted");

    await user.click(screen.getByRole("button", { name: "Skip Opening Cinematic" }));
    expect(publish).toHaveBeenCalledWith("CinematicSkipped");
  });
});
