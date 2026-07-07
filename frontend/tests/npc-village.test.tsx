import type { components } from "@flavor/contracts/api";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NpcVillage } from "@/components/npcs/npc-village";

vi.mock("@/hooks/use-motion-preference", () => ({
  useMotionPreference: () => true
}));

type NpcState = components["schemas"]["NpcStateResponse"];

function npc(overrides: Partial<NpcState> = {}): NpcState {
  return {
    age_group: "adult",
    animation_state: "idle_breathing",
    current_activity: "Talk to Lumi",
    current_goal: "Share a warm meadow memory",
    current_location: "Recipe Shrine",
    current_mood: "happy",
    daily_schedule: [
      {
        activity: "Talk to Lumi",
        label: "Afternoon",
        location: "Recipe Shrine",
        starts_at: "15:00"
      }
    ],
    emotion_icon: "sun",
    energy_level: 75,
    favorite_flavor: "Golden Vanilla Bloom",
    favorite_flower: "Vanilla Orchid",
    favorite_weather: "Warm breeze",
    gift_preferences: {
      avoids: ["wilted_petal"],
      likes: ["honey_bloom"],
      loves: ["golden_vanilla_bloom"]
    },
    id: "30000000-0000-0000-0000-000000000001",
    lumi_reaction: "waves to Lumi",
    memory_summary: "No shared memories yet.",
    movement: {
      from_location: "Recipe Shrine",
      no_teleporting: true,
      progress: 0.5,
      to_location: "Journal Tree"
    },
    name: "Meadow Keeper",
    npc_id: "joy_meadow_keeper",
    occupation: "Meadow Keeper",
    personality: ["patient", "hopeful"],
    portrait: "npc.joy_meadow_keeper.portrait",
    relationship: {
      conversation_history: [],
      friendship_level: 1,
      friendship_xp: 25,
      memory_highlights: ["Player promised to restore Joy."],
      milestones: ["Friendly Neighbor"],
      relationship_status: "friendly neighbor",
      trust_level: 0,
      trust_xp: 8
    },
    speech_bubble: "The meadow is listening.",
    speech_speed: "normal",
    thought_bubble: "The first scoop is closer than the flowers know.",
    voice_style: "gentle, ceremonial, brief",
    ...overrides
  };
}

describe("NpcVillage", () => {
  it("renders animated NPC portraits and relationship details", async () => {
    render(
      <NpcVillage
        chatPending={false}
        giftPending={false}
        npcs={[
          npc(),
          npc({
            current_mood: "excited",
            id: "30000000-0000-0000-0000-000000000002",
            name: "Maribel Crumb",
            npc_id: "joy_meadow_baker",
            occupation: "Village Baker"
          })
        ]}
        onGift={vi.fn()}
        onSendMessage={vi.fn()}
      />
    );

    expect(screen.getByRole("heading", { name: "Meadow voices" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Meadow Keeper portrait/ })).toBeInTheDocument();
    expect(screen.getAllByText("friendly neighbor · Friendship 1").length).toBeGreaterThan(0);
    expect(await screen.findByText("The meadow is listening.")).toBeInTheDocument();
  });

  it("submits conversation choices for the selected NPC", async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn();
    render(
      <NpcVillage
        chatPending={false}
        giftPending={false}
        npcs={[npc()]}
        onGift={vi.fn()}
        onSendMessage={onSendMessage}
      />
    );

    await user.type(screen.getByLabelText("Speak with Meadow Keeper"), "Do you remember me?");
    await user.click(screen.getByRole("button", { name: "Ask" }));

    expect(onSendMessage).toHaveBeenCalledWith("joy_meadow_keeper", "Do you remember me?");
  });

  it("shows generated dialogue, memories, and gift reactions", async () => {
    render(
      <NpcVillage
        chatPending={false}
        chatResponse={{
          fallback_used: false,
          importance: 4,
          memory_written: true,
          mood: "happy",
          npc_id: "joy_meadow_keeper",
          provider: "mock",
          relationship: {
            conversation_history: [
              {
                mood: "curious",
                occurred_at: "2026-07-07T10:00:00Z",
                speaker: "player",
                text: "I brought the first memory."
              }
            ],
            friendship_level: 1,
            friendship_xp: 28,
            memory_highlights: ["I brought the first memory."],
            milestones: ["Friendly Neighbor"],
            relationship_status: "friendly neighbor",
            trust_level: 0,
            trust_xp: 10
          },
          reply: "Then let us keep it glowing."
        }}
        giftPending={false}
        giftReaction="Meadow Keeper treasures the Golden Vanilla Bloom."
        npcs={[npc()]}
        onGift={vi.fn()}
        onSendMessage={vi.fn()}
      />
    );

    expect(await screen.findByText("Then let us keep it glowing.")).toBeInTheDocument();
    expect(screen.getAllByText("I brought the first memory.").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Meadow Keeper treasures the Golden Vanilla Bloom.")
    ).toBeInTheDocument();
  });

  it("switches emotion state when another NPC is selected", async () => {
    const user = userEvent.setup();
    render(
      <NpcVillage
        chatPending={false}
        giftPending={false}
        npcs={[
          npc(),
          npc({
            current_mood: "surprised",
            emotion_icon: "star",
            id: "30000000-0000-0000-0000-000000000003",
            name: "Pip Puddlejump",
            npc_id: "joy_meadow_child_explorer",
            occupation: "Child Explorer",
            speech_bubble: "I saw the bridge wink!"
          })
        ]}
        onGift={vi.fn()}
        onSendMessage={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /Pip Puddlejump/ }));

    await waitFor(() => {
      expect(screen.getByText("surprised · idle_breathing")).toBeInTheDocument();
    });
    expect(await screen.findByText("I saw the bridge wink!")).toBeInTheDocument();
  });
});
