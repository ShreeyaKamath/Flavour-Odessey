export type AppEventType =
  | "QuestCompleted"
  | "RecipeCrafted"
  | "EmotionRestored"
  | "WeatherChanged"
  | "CompanionReacted"
  | "SettingsUpdated";

export type AppEvent<TPayload = unknown> = {
  type: AppEventType;
  payload: TPayload;
};

type EventHandler<TPayload = unknown> = (event: AppEvent<TPayload>) => void;

class EventBus {
  private handlers = new Map<AppEventType, Set<EventHandler>>();

  subscribe<TPayload>(type: AppEventType, handler: EventHandler<TPayload>) {
    const handlers = this.handlers.get(type) ?? new Set<EventHandler>();
    handlers.add(handler as EventHandler);
    this.handlers.set(type, handlers);

    return () => {
      handlers.delete(handler as EventHandler);
    };
  }

  publish<TPayload>(event: AppEvent<TPayload>) {
    this.handlers.get(event.type)?.forEach((handler) => handler(event));
  }
}

export const eventBus = new EventBus();
