import type { components } from "@flavor/contracts/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GameplayScreen } from "@/features/game/gameplay-screen";
import { apiClient } from "@/lib/api/client";

type GameState = components["schemas"]["GameStateResponse"];

function gameState(): GameState {
  return {
    dialogue: [
      {
        character_id: "lumi",
        character_name: "Lumi",
        role: "companion",
        text: "The meadow still remembers joy."
      },
      {
        character_id: "joy_meadow_keeper",
        character_name: "Meadow Keeper",
        role: "npc",
        text: "The first blooms are waiting."
      }
    ],
    inventory: [
      {
        collected: false,
        ingredient_id: "vanilla_orchid",
        name: "Vanilla Orchid",
        quantity: 0
      },
      {
        collected: true,
        ingredient_id: "honey_bloom",
        name: "Honey Bloom",
        quantity: 1
      }
    ],
    island: {
      island_id: "joy_meadow",
      name: "Joy Meadow",
      restoration_level: 0,
      restored: false
    },
    journal: [],
    quest: {
      can_complete: false,
      collected_ingredients: ["honey_bloom"],
      crafted: false,
      description: "Gather the meadow blooms and restore Joy.",
      quest_id: "joy_first_recipe",
      recipe_id: "golden_vanilla_bloom",
      required_ingredients: ["vanilla_orchid", "honey_bloom"],
      status: "active",
      title: "Restore the First Scoop"
    },
    recipe: {
      ability: "joy_restoration",
      can_craft: false,
      crafted: false,
      emotion: "joy",
      lore: "A golden scoop that remembers sunlight.",
      name: "Golden Vanilla Bloom",
      recipe_id: "golden_vanilla_bloom",
      required_ingredients: ["vanilla_orchid", "honey_bloom"]
    },
    save: {
      last_event: "QuestStarted",
      last_saved_at: "2026-07-05T10:00:00Z",
      status: "saved"
    },
    started: true
  };
}

function TestQueryProvider({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe("GameplayScreen", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the Joy Meadow gameplay sections", async () => {
    vi.spyOn(apiClient, "getGameState").mockResolvedValueOnce(gameState());

    render(<GameplayScreen islandId="joy_meadow" />, {
      wrapper: TestQueryProvider
    });

    expect(
      await screen.findByRole("heading", { name: "Restore the first scoop" })
    ).toBeInTheDocument();
    expect(screen.getByText("Lumi")).toBeInTheDocument();
    expect(screen.getByText("Meadow Keeper")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Inventory" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Journal of Memories" })
    ).toBeInTheDocument();
  });

  it("collects a starter ingredient and updates the screen", async () => {
    const initial = gameState();
    const collected = gameState();
    collected.inventory[0] = {
      ...collected.inventory[0],
      collected: true,
      quantity: 1
    };
    vi.spyOn(apiClient, "getGameState").mockResolvedValueOnce(initial);
    vi.spyOn(apiClient, "collectInventoryIngredient").mockResolvedValueOnce(
      collected
    );
    const user = userEvent.setup();

    render(<GameplayScreen />, { wrapper: TestQueryProvider });
    await user.click(
      await screen.findByRole("button", { name: "Collect Vanilla Orchid" })
    );

    expect(apiClient.collectInventoryIngredient).toHaveBeenCalledWith({
      ingredient_id: "vanilla_orchid"
    });
    const collectedButtons = await screen.findAllByRole("button", {
      name: "Collected"
    });
    expect(collectedButtons).toHaveLength(2);
    expect(collectedButtons.every((button) => button.hasAttribute("disabled"))).toBe(
      true
    );
  });

  it("crafts Golden Vanilla Bloom when the ingredients are ready", async () => {
    const initial = gameState();
    initial.inventory = initial.inventory.map((item) => ({
      ...item,
      collected: true,
      quantity: 1
    }));
    initial.recipe.can_craft = true;
    const crafted = structuredClone(initial);
    crafted.inventory = crafted.inventory.map((item) => ({
      ...item,
      quantity: 0
    }));
    crafted.recipe.can_craft = false;
    crafted.recipe.crafted = true;
    crafted.quest.can_complete = true;
    crafted.quest.crafted = true;
    vi.spyOn(apiClient, "getGameState").mockResolvedValueOnce(initial);
    vi.spyOn(apiClient, "craftRecipe").mockResolvedValueOnce(crafted);
    const user = userEvent.setup();

    render(<GameplayScreen />, { wrapper: TestQueryProvider });
    await user.click(
      await screen.findByRole("button", {
        name: "Craft Golden Vanilla Bloom"
      })
    );

    expect(apiClient.craftRecipe).toHaveBeenCalledWith({
      recipe_id: "golden_vanilla_bloom"
    });
    expect(
      await screen.findByRole("button", {
        name: "Golden Vanilla Bloom crafted"
      })
    ).toBeDisabled();
  });

  it("shows the restored journal memory", async () => {
    const restored = gameState();
    restored.island = {
      ...restored.island,
      restoration_level: 100,
      restored: true
    };
    restored.quest.status = "completed";
    restored.journal = [
      {
        content: "The meadow remembered how to shine.",
        created_at: "2026-07-05T10:30:00Z",
        emotion: "joy",
        id: "10000000-0000-0000-0000-000000000001",
        recipe_name: "Golden Vanilla Bloom",
        title: "The Day Joy Returned"
      }
    ];
    vi.spyOn(apiClient, "getGameState").mockResolvedValueOnce(restored);

    render(<GameplayScreen />, { wrapper: TestQueryProvider });

    expect(
      await screen.findByRole("heading", { name: "The Day Joy Returned" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("The meadow remembered how to shine.")
    ).toBeInTheDocument();
  });
});
