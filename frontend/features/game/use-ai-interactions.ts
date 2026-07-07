"use client";

import type { components } from "@flavor/contracts/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { gameStateQueryKey } from "@/features/game/use-gameplay";
import { apiClient } from "@/lib/api/client";

type CompanionEvent = components["schemas"]["AICompanionRespondRequest"]["event"];
type NpcId = components["schemas"]["AINpcChatRequest"]["npc_id"];

export function useAIInteractions() {
  const queryClient = useQueryClient();

  const npcChat = useMutation({
    mutationFn: ({ message, npcId }: { message: string; npcId: NpcId }) =>
      apiClient.aiNpcChat({
        message,
        npc_id: npcId
      })
  });
  const companion = useMutation({
    mutationFn: (event: CompanionEvent) => apiClient.aiCompanionRespond({ event })
  });
  const recipe = useMutation({
    mutationFn: () =>
      apiClient.aiRecipeDescribe({
        recipe_id: "golden_vanilla_bloom"
      })
  });
  const journal = useMutation({
    mutationFn: () =>
      apiClient.aiJournalStory({
        island_id: "joy_meadow"
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: gameStateQueryKey })
  });

  return {
    companion,
    journal,
    npcChat,
    recipe
  };
}
