"use client";

import type { components } from "@flavor/contracts/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

type GameState = components["schemas"]["GameStateResponse"];
type IngredientId =
  components["schemas"]["InventoryCollectRequest"]["ingredient_id"];

export const gameStateQueryKey = ["game", "state"] as const;

export function useGameplay() {
  const queryClient = useQueryClient();
  const state = useQuery({
    queryFn: () => apiClient.getGameState(),
    queryKey: gameStateQueryKey
  });

  function updateState(nextState: GameState) {
    queryClient.setQueryData(gameStateQueryKey, nextState);
    void queryClient.invalidateQueries({ queryKey: ["world"] });
  }

  const start = useMutation({
    mutationFn: () => apiClient.startGame({ island_id: "joy_meadow" }),
    onSuccess: updateState
  });
  const collect = useMutation({
    mutationFn: (ingredientId: IngredientId) =>
      apiClient.collectInventoryIngredient({ ingredient_id: ingredientId }),
    onSuccess: updateState
  });
  const startQuest = useMutation({
    mutationFn: () => apiClient.startQuest({ quest_id: "joy_first_recipe" }),
    onSuccess: updateState
  });
  const craft = useMutation({
    mutationFn: () =>
      apiClient.craftRecipe({ recipe_id: "golden_vanilla_bloom" }),
    onSuccess: updateState
  });
  const restore = useMutation({
    mutationFn: () =>
      apiClient.completeQuest({ quest_id: "joy_first_recipe" }),
    onSuccess: updateState
  });

  const mutations = [start, collect, startQuest, craft, restore];
  const mutationError = mutations.find((mutation) => mutation.error)?.error;

  return {
    collectIngredient: collect.mutate,
    craftRecipe: craft.mutate,
    error: mutationError,
    isActing: mutations.some((mutation) => mutation.isPending),
    restoreJoy: restore.mutate,
    startGame: start.mutate,
    startQuest: startQuest.mutate,
    state
  };
}
