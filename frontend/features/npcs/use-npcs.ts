"use client";

import type { components } from "@flavor/contracts/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";
import { audioEvents } from "@/lib/audio/audio-events";

export type NpcState = components["schemas"]["NpcStateResponse"];
export type NpcId = components["schemas"]["AINpcChatRequest"]["npc_id"];

export const npcsQueryKey = ["npcs", "joy_meadow"] as const;

/** Loads and updates the player-scoped Joy Meadow NPC ecosystem. */
export function useNpcs(enabled = true) {
  const queryClient = useQueryClient();
  const npcs = useQuery({
    enabled,
    queryFn: () => apiClient.listNpcs(),
    queryKey: npcsQueryKey
  });

  const gift = useMutation({
    mutationFn: ({ giftId, npcId }: { giftId: string; npcId: NpcId }) =>
      apiClient.giveNpcGift(npcId, { gift_id: giftId }),
    onSuccess: () => {
      audioEvents.publish("NPCGreeting");
      void queryClient.invalidateQueries({ queryKey: npcsQueryKey });
    }
  });

  return {
    gift,
    npcs
  };
}
