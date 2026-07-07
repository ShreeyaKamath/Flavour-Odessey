import { audioIds, type AudioId } from "@/lib/audio/manifest";

export type AudioEventName =
  | "UIHovered"
  | "UIClicked"
  | "IngredientCollected"
  | "IngredientHovered"
  | "CraftingMagicCharged"
  | "RecipeCrafted"
  | "LumiCelebrated"
  | "LumiHovered"
  | "LumiBlinked"
  | "LumiHinted"
  | "LumiExcited"
  | "LumiSlept"
  | "RecipePageFlipped"
  | "NPCFootstep"
  | "NPCGreeting"
  | "NPCLaugh"
  | "NPCSurprised"
  | "NPCCelebrated"
  | "NPCWaved"
  | "ConversationOpened"
  | "ConversationClosed"
  | "EmotionRestored"
  | "QuestCompleted"
  | "JournalUpdated";

type AudioEventListener = (event: AudioEventName) => void;

export const audioEventIds: Record<AudioEventName, AudioId> = {
  CraftingMagicCharged: audioIds.crafting_magic_charge,
  EmotionRestored: audioIds.restoration_joy,
  IngredientCollected: audioIds.ingredient_collect,
  IngredientHovered: audioIds.ingredient_hover,
  JournalUpdated: audioIds.journal_reveal,
  LumiCelebrated: audioIds.lumi_celebrate,
  LumiBlinked: audioIds.lumi_blink,
  LumiExcited: audioIds.lumi_excited,
  LumiHinted: audioIds.lumi_hint,
  LumiHovered: audioIds.lumi_hover,
  LumiSlept: audioIds.lumi_sleep,
  NPCCelebrated: audioIds.npc_celebrate,
  NPCFootstep: audioIds.npc_footstep,
  NPCGreeting: audioIds.npc_greeting,
  NPCLaugh: audioIds.npc_laugh,
  NPCSurprised: audioIds.npc_surprised,
  NPCWaved: audioIds.npc_wave,
  QuestCompleted: audioIds.quest_complete,
  RecipeCrafted: audioIds.craft_success,
  RecipePageFlipped: audioIds.recipe_page_flip,
  ConversationClosed: audioIds.conversation_close,
  ConversationOpened: audioIds.conversation_open,
  UIClicked: audioIds.ui_click,
  UIHovered: audioIds.ui_hover
};

class AudioEventBus {
  private readonly listeners = new Set<AudioEventListener>();

  publish(event: AudioEventName) {
    this.listeners.forEach((listener) => listener(event));
  }

  subscribe(listener: AudioEventListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const audioEvents = new AudioEventBus();
