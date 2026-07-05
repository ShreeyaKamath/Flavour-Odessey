import type { components } from "@flavor/contracts/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { WorldMapScreen } from "@/features/world/world-map-screen";
import { apiClient } from "@/lib/api/client";

vi.mock("@/components/visual/foundation-scene", () => ({
  FoundationScene: () => <div>World visual</div>
}));

type Island = components["schemas"]["IslandSummary"];
type WorldResponse = components["schemas"]["WorldResponse"];

function island(
  key: string,
  name: string,
  unlocked: boolean,
  mapOrder: number
): Island {
  return {
    ambient: {
      description: "A quiet island soundscape.",
      palette: [],
      sounds: []
    },
    availability: unlocked ? "playable" : "coming_in_version_1",
    description: `${name} description`,
    emotion: unlocked ? "joy" : "future",
    id: `00000000-0000-0000-0000-00000000000${mapOrder}`,
    key,
    landmarks: unlocked
      ? [
          {
            description: "A meadow landmark.",
            key: "vanilla_windmill",
            name: "Vanilla Windmill"
          }
        ]
      : [],
    manifests: [],
    map_order: mapOrder,
    map_position: { x: mapOrder * 10, y: mapOrder * 10 },
    name,
    restoration_level: 0,
    restoration_state: "unrestored",
    unlocked
  };
}

const worldResponse: WorldResponse = {
  events: [],
  islands: [
    island("joy_meadow", "Joy Meadow", true, 0),
    island("wonder_woods", "Wonder Woods", false, 1),
    island("courage_cliffs", "Courage Cliffs", false, 2),
    island("hope_harbor", "Hope Harbor", false, 3),
    island("home_valley", "Home Valley", false, 4)
  ],
  weather: [
    {
      condition: "sunny",
      details: { label: "Warm breeze" },
      id: "10000000-0000-0000-0000-000000000001",
      intensity: 25,
      island_id: "20000000-0000-0000-0000-000000000001",
      island_key: "joy_meadow"
    }
  ]
};

function TestQueryProvider({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe("WorldMapScreen", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders Joy Meadow as the playable island", async () => {
    vi.spyOn(apiClient, "getWorld").mockResolvedValueOnce(worldResponse);

    render(<WorldMapScreen />, { wrapper: TestQueryProvider });

    expect(
      await screen.findByRole("heading", { name: "Joy Meadow" })
    ).toBeInTheDocument();
    expect(screen.getByText("Warm breeze")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Enter Joy Meadow" })
    ).toHaveAttribute("href", "/game?island=joy_meadow");
    expect(screen.getByText("Vanilla Windmill")).toBeInTheDocument();
  });

  it("shows locked islands without navigation", async () => {
    vi.spyOn(apiClient, "getWorld").mockResolvedValueOnce(worldResponse);

    render(<WorldMapScreen />, { wrapper: TestQueryProvider });

    expect(
      await screen.findByRole("heading", { name: "Wonder Woods" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Coming in Version 1")).toHaveLength(4);
    expect(
      screen.queryByRole("link", { name: /Wonder Woods/ })
    ).not.toBeInTheDocument();
  });

  it("renders loading and error states", async () => {
    vi.spyOn(apiClient, "getWorld").mockRejectedValueOnce(
      new Error("World service unavailable")
    );

    render(<WorldMapScreen />, { wrapper: TestQueryProvider });

    expect(screen.getByRole("status")).toHaveTextContent("Loading world map");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "World service unavailable"
    );
    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();
  });
});
