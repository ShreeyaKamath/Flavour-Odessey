import type { LumiContext } from "@/lib/lumi/lumi-types";

/** Selects concise deterministic Lumi hints from the current Joy Meadow context. */
export class LumiHintController {
  nextHint(context: LumiContext) {
    const { game } = context;
    const missingIngredients = game.inventory.filter((item) => !item.collected);

    if (!game.started) {
      return "Tap into Joy Meadow first. I will float beside you once we arrive.";
    }

    if (context.companionResponse?.response) {
      return context.companionResponse.response;
    }

    if (missingIngredients.length) {
      return `I sense ${missingIngredients[0].name} nearby. It is the next glow in our path.`;
    }

    if (game.quest.status === "not_started") {
      return "The first quest is ready. Let us ask the meadow what it needs.";
    }

    if (game.recipe.can_craft && !game.recipe.crafted) {
      return "The satchel is ready. Golden Vanilla Bloom can wake from those ingredients now.";
    }

    if (context.craftingActive) {
      return "Choose both starter ingredients, then let Golden Vanilla Bloom gather gently.";
    }

    if (game.quest.can_complete) {
      return "Joy is close. Restore the meadow while the recipe is still shining.";
    }

    if (game.island.restored) {
      return "The meadow is bright again. The Journal of Memories is waiting for the story.";
    }

    if (context.npcNearby && context.currentNpcName) {
      return `${context.currentNpcName} has a meadow memory nearby. A kind question may open it.`;
    }

    return `The ${context.weather} air feels ${context.timeOfDay.replace("_", " ")}. I will watch for the next sparkle.`;
  }
}
