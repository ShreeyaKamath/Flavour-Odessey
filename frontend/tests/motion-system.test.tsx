import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IngredientMotion, JournalMotion, JoyMeadowScene } from "@/features/game/gameplay-motion";
import { useSettingsStore } from "@/stores/settings-store";

describe("motion system", () => {
  afterEach(() => {
    cleanup();
    act(() => {
      useSettingsStore.setState({ reducedMotion: false });
    });
  });

  it("disables shared component motion for the app preference", () => {
    useSettingsStore.setState({ reducedMotion: true });

    render(
      <>
        <Button>Continue</Button>
        <Card>Meadow card</Card>
        <Skeleton data-testid="skeleton" />
      </>
    );

    expect(screen.getByRole("button", { name: "Continue" })).toHaveAttribute(
      "data-motion-reduced",
      "true"
    );
    expect(screen.getByText("Meadow card")).toHaveAttribute("data-motion-reduced", "true");
    expect(screen.getByTestId("skeleton")).toHaveAttribute("data-motion-reduced", "true");
  });

  it("keeps gameplay effects static when reduced motion is enabled", () => {
    useSettingsStore.setState({ reducedMotion: true });
    const { container } = render(
      <>
        <JoyMeadowScene restored>Meadow</JoyMeadowScene>
        <IngredientMotion collected>Ingredient</IngredientMotion>
        <JournalMotion>Journal</JournalMotion>
      </>
    );

    const effects = container.querySelectorAll("[data-motion-effect]");
    expect(effects).toHaveLength(3);
    effects.forEach((effect) => {
      expect(effect).toHaveAttribute("data-motion-reduced", "true");
    });
    expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(0);
  });
});
