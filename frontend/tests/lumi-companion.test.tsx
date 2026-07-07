import type { components } from "@flavor/contracts/api";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LumiFloatingCompanion } from "@/components/lumi/lumi-floating-companion";
import { LumiInteractionPanel } from "@/components/lumi/lumi-interaction-panel";
import { LumiManager } from "@/lib/lumi/lumi-manager";
import type { LumiState } from "@/lib/lumi/lumi-types";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

vi.mock("@/hooks/use-motion-preference", () => ({
  useMotionPreference: () => true
}));

type GameState = components["schemas"]["GameStateResponse"];

function lumiState(overrides: Partial<LumiState> = {}): LumiState {
  return {
    emotion: "happy",
    lastEvent: "idle",
    message: "I am right here, floating beside the next bright idea.",
    mode: "idle",
    sleeping: false,
    ...overrides
  };
}

function gameState(overrides: Partial<GameState> = {}): GameState {
  return {
    dialogue: [],
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
    started: true,
    ...overrides
  };
}

function world(overrides: Partial<LivingWorldSnapshot> = {}): LivingWorldSnapshot {
  return {
    ambientColor: "#a9c7d8",
    audioAmbience: "weather_rain",
    cloudCover: 1,
    condition: "rain",
    conditionLabel: "Rain",
    fireflyIntensity: 0,
    flowerSway: 1.15,
    fogDensity: 0.36,
    grassSway: 1.2,
    lightingBlend: 0.38,
    lumiReaction: "Lumi tucks beneath a leaf.",
    npcRoutine: "Runs indoors, reads, and drinks hot chocolate.",
    particleColor: "#b7ddff",
    rainIntensity: 1,
    season: "joy_meadow_spring",
    seasonLabel: "Joy Meadow spring",
    skyBottom: "#9eb8c8",
    skyTop: "#566f86",
    timeLabel: "Afternoon",
    timeOfDay: "afternoon",
    transitionProgress: 0.5,
    waterReflection: 0.9,
    windStrength: 0.86,
    ...overrides
  };
}

describe("Lumi companion", () => {
  it("renders the floating companion with accessible emotion and controls", async () => {
    const onAsk = vi.fn();
    const onToggleSleep = vi.fn();
    const user = userEvent.setup();

    render(
      <LumiFloatingCompanion
        hint="Collect the next glowing bloom."
        onAsk={onAsk}
        onToggleSleep={onToggleSleep}
        state={lumiState({ emotion: "excited", message: "That ingredient lit up!" })}
        world={world()}
      />
    );

    expect(screen.getByLabelText("Lumi companion, excited")).toBeInTheDocument();
    expect(screen.getByLabelText("Lumi companion, excited")).toHaveAttribute(
      "data-weather",
      "rain"
    );
    expect(screen.getByText("That ingredient lit up!")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ask Lumi for contextual guidance" }));
    expect(onAsk).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "Let Lumi rest" }));
    expect(onToggleSleep).toHaveBeenCalledWith("sleep");
  });

  it("shows generated hints, fallback labels, and AI errors without crashing", () => {
    render(
      <LumiInteractionPanel
        aiError={new Error("Companion provider unavailable")}
        aiPending={false}
        aiResponse={{
          companion_id: "lumi",
          event: "hint",
          fallback_used: true,
          provider: "deterministic-fallback",
          response: "Gather both meadow blooms before you craft."
        }}
        hint="Collect the next glowing bloom."
        memories={[
          {
            event: "ingredient_collected",
            message: "That ingredient lit up!",
            occurredAt: "2026-07-05T10:00:00Z"
          }
        ]}
        memorySummary="That ingredient lit up!"
        onAskHint={vi.fn()}
        state={lumiState({ emotion: "thoughtful", mode: "thinking" })}
      />
    );

    expect(screen.getByText("Gather both meadow blooms before you craft.")).toBeInTheDocument();
    expect(screen.getByText("Deterministic fallback")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Companion provider unavailable");
  });

  it("derives deterministic contextual hints from player progress", () => {
    const manager = new LumiManager();
    const context = manager.context(gameState(), undefined);

    expect(manager.hints.nextHint(context)).toContain("Vanilla Orchid");

    const readyState = gameState({
      inventory: gameState().inventory.map((item) => ({
        ...item,
        collected: true,
        quantity: 1
      })),
      recipe: {
        ...gameState().recipe,
        can_craft: true
      }
    });

    expect(manager.hints.nextHint(manager.context(readyState, undefined))).toContain(
      "Golden Vanilla Bloom"
    );
  });

  it("uses weather-aware Lumi hints when weather is the most important context", () => {
    const manager = new LumiManager();
    const readyState = gameState({
      inventory: gameState().inventory.map((item) => ({
        ...item,
        collected: true,
        quantity: 1
      })),
      recipe: {
        ...gameState().recipe,
        crafted: true
      }
    });

    expect(
      manager.hints.nextHint(manager.context(readyState, undefined, undefined, world()))
    ).toContain("Rain");
  });
});
