import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CraftingDirector } from "@/components/crafting/crafting-director";
import { audioEvents } from "@/lib/audio/audio-events";

vi.mock("@/components/crafting/recipe-presentation", () => ({
  RecipePresentation: ({ phase }: { phase: string }) => (
    <div
      aria-label="Golden Vanilla Bloom three-dimensional presentation"
      data-testid="recipe-presentation"
      role="img"
    >
      {phase}
    </div>
  )
}));

vi.mock("@/hooks/use-motion-preference", () => ({
  useMotionPreference: () => true
}));

const ingredients = [
  { ingredient_id: "vanilla_orchid", quantity: 1 },
  { ingredient_id: "honey_bloom", quantity: 1 }
];

function renderDirector(onCraft: Parameters<typeof CraftingDirector>[0]["onCraft"]) {
  const onLumiReaction = vi.fn();
  const result = render(
    <CraftingDirector
      canCraft
      crafted={false}
      disabled={false}
      emotion="joy"
      ingredients={ingredients}
      lore="A golden scoop that remembers sunlight."
      onCraft={onCraft}
      onLumiReaction={onLumiReaction}
      recipeName="Golden Vanilla Bloom"
      restored={false}
    />
  );
  return { ...result, onLumiReaction };
}

describe("CraftingDirector", () => {
  it("requires ingredient choices and reveals the server-approved recipe", async () => {
    const onCraft = vi.fn(({ onSuccess }) => onSuccess());
    const audio = vi.spyOn(audioEvents, "publish");
    const user = userEvent.setup();
    const { onLumiReaction } = renderDirector(onCraft);

    const begin = screen.getByRole("button", { name: "Begin magical crafting" });
    expect(begin).toBeDisabled();

    await user.click(screen.getByRole("checkbox", { name: /Vanilla Orchid/ }));
    await user.click(screen.getByRole("checkbox", { name: /Honey Bloom/ }));
    expect(begin).toBeEnabled();
    await user.click(begin);

    expect(onCraft).toHaveBeenCalledOnce();
    expect(onLumiReaction).toHaveBeenCalledWith("crafting_started");
    expect(audio).toHaveBeenCalledWith("CraftingMagicCharged");
    expect(screen.getByRole("dialog", { name: "Magical crafting sequence" })).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Return to Joy Meadow" })).toBeInTheDocument();
    expect(onLumiReaction).toHaveBeenCalledWith("recipe_crafted");
    expect(audio).toHaveBeenCalledWith("LumiCelebrated");
    expect(audio).toHaveBeenCalledWith("RecipePageFlipped");
    expect(screen.getByText("This memory will bloom when Joy Meadow is restored.")).toBeVisible();
  });

  it("returns to ingredient selection when the craft request fails", async () => {
    const onCraft = vi.fn(({ onError }) => onError());
    const user = userEvent.setup();
    renderDirector(onCraft);

    await user.click(screen.getByRole("checkbox", { name: /Vanilla Orchid/ }));
    await user.click(screen.getByRole("checkbox", { name: /Honey Bloom/ }));
    await user.click(screen.getByRole("button", { name: "Begin magical crafting" }));

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Magical crafting sequence" })
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "Begin magical crafting" })).toBeEnabled();
  });

  it("shows persistent recipe and journal state after a reload", () => {
    render(
      <CraftingDirector
        canCraft={false}
        crafted
        disabled={false}
        emotion="joy"
        ingredients={ingredients}
        journalMemory={{
          content: "The meadow remembered how to shine.",
          title: "The Day Joy Returned"
        }}
        lore="A golden scoop that remembers sunlight."
        onCraft={vi.fn()}
        recipeName="Golden Vanilla Bloom"
        restored
      />
    );

    expect(screen.getByRole("img", { name: /three-dimensional presentation/ })).toBeInTheDocument();
    expect(screen.getByText("Emotion restored: joy")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Day Joy Returned" })).toBeInTheDocument();
  });
});
