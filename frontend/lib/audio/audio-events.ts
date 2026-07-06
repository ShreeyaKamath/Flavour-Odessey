import { audioIds, type AudioId } from "@/lib/audio/manifest";

export type AudioEventName =
  | "UIHovered"
  | "UIClicked"
  | "IngredientCollected"
  | "RecipeCrafted"
  | "EmotionRestored"
  | "QuestCompleted"
  | "JournalUpdated";

type AudioEventListener = (event: AudioEventName) => void;

export const audioEventIds: Record<AudioEventName, AudioId> = {
  EmotionRestored: audioIds.restoration_joy,
  IngredientCollected: audioIds.ingredient_collect,
  JournalUpdated: audioIds.journal_reveal,
  QuestCompleted: audioIds.quest_complete,
  RecipeCrafted: audioIds.crafting_sparkle,
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
