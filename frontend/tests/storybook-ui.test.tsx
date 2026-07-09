import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GlowingBookmark } from "@/components/storybook/glowing-bookmark";
import { MagicalTooltip } from "@/components/storybook/magical-tooltip";
import { StorybookShell } from "@/components/storybook/storybook-shell";
import { audioEvents } from "@/lib/audio/audio-events";

vi.mock("next/navigation", () => ({
  usePathname: () => "/journal"
}));

describe("storybook UI", () => {
  it("renders the storybook shell with bookmark navigation", () => {
    const { container } = render(
      <StorybookShell
        description="A parchment test spread."
        eyebrow="Storybook"
        title="Journal of Memories"
      >
        <p>Memory page</p>
      </StorybookShell>
    );

    const shell = container.querySelector('[data-visual-element="storybook_shell"]');

    expect(
      screen.getByRole("heading", { level: 1, name: "Journal of Memories" })
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Storybook navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cookbook" })).toHaveAttribute("href", "/recipes");
    expect(shell).toHaveStyle({
      "--storybook-parchment-texture": 'url("/assets/ui/storybook/parchment-texture.svg")'
    });
  });

  it("publishes magical tooltip and bookmark audio events", async () => {
    const publish = vi.spyOn(audioEvents, "publish");
    const user = userEvent.setup();

    render(
      <>
        <MagicalTooltip label="Helpful ink">
          <button type="button">Hover clue</button>
        </MagicalTooltip>
        <GlowingBookmark label="Progress saved" />
      </>
    );

    await user.hover(screen.getByRole("button", { name: "Hover clue" }));
    expect(publish).toHaveBeenCalledWith("MagicalTooltipShown");

    await user.hover(screen.getByText("Progress saved"));
    expect(publish).toHaveBeenCalledWith("BookmarkSaved");
  });
});
