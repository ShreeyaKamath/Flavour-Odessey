import type { components } from "@flavor/contracts/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GameplayScreen } from "@/features/game/gameplay-screen";
import { apiClient } from "@/lib/api/client";
import { audioEvents } from "@/lib/audio/audio-events";

vi.mock("@/components/world/joy-meadow-environment", () => ({
  JoyMeadowEnvironment: () => <div>Living Joy Meadow</div>
}));

vi.mock("@/components/crafting/recipe-presentation", () => ({
  RecipePresentation: ({ phase }: { phase: string }) => (
    <div data-testid="recipe-presentation">{phase}</div>
  )
}));

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
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("GameplayScreen", () => {
  beforeEach(() => {
    vi.spyOn(apiClient, "aiCompanionRespond").mockResolvedValue({
      companion_id: "lumi",
      event: "hint",
      fallback_used: false,
      provider: "mock",
      response: "A little patience can help the meadow bloom."
    });
  });

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
    expect(screen.getByRole("heading", { name: "Inventory" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Journal of Memories" })).toBeInTheDocument();
  });

  it("shows loading and state-loading errors", async () => {
    vi.spyOn(apiClient, "getGameState").mockRejectedValueOnce(
      new Error("Gameplay state unavailable")
    );

    render(<GameplayScreen />, { wrapper: TestQueryProvider });

    expect(screen.getByRole("status")).toHaveTextContent("Loading Joy Meadow");
    expect(await screen.findByRole("alert")).toHaveTextContent("Gameplay state unavailable");
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
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
    vi.spyOn(apiClient, "collectInventoryIngredient").mockResolvedValueOnce(collected);
    const audio = vi.spyOn(audioEvents, "publish");
    const user = userEvent.setup();

    render(<GameplayScreen />, { wrapper: TestQueryProvider });
    await user.click(await screen.findByRole("button", { name: "Collect Vanilla Orchid" }));

    expect(apiClient.collectInventoryIngredient).toHaveBeenCalledWith({
      ingredient_id: "vanilla_orchid"
    });
    expect(audio).toHaveBeenCalledWith("IngredientCollected");
    const collectedButtons = await screen.findAllByRole("button", {
      name: "Collected"
    });
    expect(collectedButtons).toHaveLength(2);
    expect(collectedButtons.every((button) => button.hasAttribute("disabled"))).toBe(true);
  });

  it("shows action errors without discarding the loaded state", async () => {
    vi.spyOn(apiClient, "getGameState").mockResolvedValueOnce(gameState());
    vi.spyOn(apiClient, "collectInventoryIngredient").mockRejectedValueOnce(
      new Error("The flower slipped away")
    );
    const user = userEvent.setup();

    render(<GameplayScreen />, { wrapper: TestQueryProvider });
    await user.click(await screen.findByRole("button", { name: "Collect Vanilla Orchid" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("The flower slipped away");
    expect(screen.getByText("Lumi")).toBeInTheDocument();
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
    const audio = vi.spyOn(audioEvents, "publish");
    const user = userEvent.setup();

    render(<GameplayScreen />, { wrapper: TestQueryProvider });
    await user.click(
      await screen.findByRole("checkbox", {
        name: /Vanilla Orchid/
      })
    );
    await user.click(
      screen.getByRole("checkbox", {
        name: /Honey Bloom/
      })
    );
    await user.click(
      await screen.findByRole("button", {
        name: "Begin magical crafting"
      })
    );

    expect(apiClient.craftRecipe).toHaveBeenCalledWith({
      recipe_id: "golden_vanilla_bloom"
    });
    expect(audio).toHaveBeenCalledWith("CraftingMagicCharged");
    expect(audio).toHaveBeenCalledWith("RecipeCrafted");
    expect(
      await screen.findByRole("dialog", { name: "Magical crafting sequence" })
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Ingredients are orbiting");
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
    expect(screen.getByText("The meadow remembered how to shine.")).toBeInTheDocument();
  });

  it("publishes restoration, quest, and journal audio events", async () => {
    const initial = gameState();
    initial.quest.can_complete = true;
    initial.quest.crafted = true;
    initial.recipe.crafted = true;
    const restored = structuredClone(initial);
    restored.island.restoration_level = 100;
    restored.island.restored = true;
    restored.quest.can_complete = false;
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
    vi.spyOn(apiClient, "getGameState").mockResolvedValueOnce(initial);
    vi.spyOn(apiClient, "completeQuest").mockResolvedValueOnce(restored);
    const audio = vi.spyOn(audioEvents, "publish");
    const user = userEvent.setup();

    render(<GameplayScreen />, { wrapper: TestQueryProvider });
    await user.click(await screen.findByRole("button", { name: "Restore Joy Meadow" }));

    expect(audio).toHaveBeenCalledWith("QuestCompleted");
    expect(audio).toHaveBeenCalledWith("EmotionRestored");
    expect(audio).toHaveBeenCalledWith("JournalUpdated");
  });

  it("shows NPC chat loading and then displays generated dialogue", async () => {
    vi.spyOn(apiClient, "getGameState").mockResolvedValueOnce(gameState());
    let resolveChat: ((value: components["schemas"]["AINpcChatResponse"]) => void) | undefined;
    vi.spyOn(apiClient, "aiNpcChat").mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveChat = resolve;
        })
    );
    const user = userEvent.setup();

    render(<GameplayScreen />, { wrapper: TestQueryProvider });
    await user.type(
      await screen.findByLabelText("Speak with the Meadow Keeper"),
      "How can I help?"
    );
    await user.click(screen.getByRole("button", { name: "Ask" }));

    expect(screen.getByRole("button", { name: "Listening..." })).toBeDisabled();
    resolveChat?.({
      fallback_used: false,
      importance: 0.6,
      memory_written: true,
      mood: "hopeful",
      npc_id: "joy_meadow_keeper",
      provider: "mock",
      reply: "Carry the golden bloom gently, and Joy will remember you."
    });

    expect(
      await screen.findByText("Carry the golden bloom gently, and Joy will remember you.")
    ).toBeInTheDocument();
  });

  it("labels deterministic fallback companion text", async () => {
    vi.mocked(apiClient.aiCompanionRespond).mockResolvedValueOnce({
      companion_id: "lumi",
      event: "hint",
      fallback_used: true,
      provider: "deterministic-fallback",
      response: "Gather both meadow blooms before you begin."
    });
    vi.spyOn(apiClient, "getGameState").mockResolvedValueOnce(gameState());
    const user = userEvent.setup();

    render(<GameplayScreen />, { wrapper: TestQueryProvider });
    await user.click(await screen.findByRole("button", { name: "Ask Lumi for a hint" }));

    expect(
      await screen.findByText("Gather both meadow blooms before you begin.")
    ).toBeInTheDocument();
    expect(screen.getByText("Deterministic fallback")).toBeInTheDocument();
  });
});
