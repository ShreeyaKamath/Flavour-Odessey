"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AmbientMotion,
  CraftingMotion,
  GameplaySkeleton,
  IngredientMotion,
  JournalMotion,
  JoyMeadowScene
} from "@/features/game/gameplay-motion";
import { useAIInteractions } from "@/features/game/use-ai-interactions";
import { useGameplay } from "@/features/game/use-gameplay";

type GameplayScreenProps = {
  islandId?: string;
};

function formatSavedAt(value: string | null | undefined) {
  if (!value) {
    return "Not saved yet";
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

/** Renders the authenticated Joy Meadow vertical slice. */
export function GameplayScreen({ islandId = "joy_meadow" }: GameplayScreenProps) {
  const gameplay = useGameplay();
  const ai = useAIInteractions();
  const [npcMessage, setNpcMessage] = useState("");

  function submitNpcMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = npcMessage.trim();
    if (!message) {
      return;
    }
    ai.npcChat.mutate(message);
  }

  if (islandId !== "joy_meadow") {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center" role="alert">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          This island is still beyond the map
        </h1>
        <p className="mt-3 text-muted-foreground">
          Joy Meadow is the only playable island in this adventure.
        </p>
      </div>
    );
  }

  if (gameplay.state.isPending) {
    return <GameplaySkeleton />;
  }

  if (gameplay.state.isError) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center" role="alert">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Joy Meadow could not be reached
        </h1>
        <p className="mt-3 text-danger">{gameplay.state.error.message}</p>
        <Button className="mt-6" onClick={() => void gameplay.state.refetch()} variant="secondary">
          Try again
        </Button>
      </div>
    );
  }

  const state = gameplay.state.data;
  const questActive = state.quest.status === "active";

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Joy Meadow</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">
            Restore the first scoop
          </h1>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">
            {state.save.status === "saved" ? "Progress saved" : "Not saved"}
          </p>
          <p>{formatSavedAt(state.save.last_saved_at)}</p>
        </div>
      </header>

      <JoyMeadowScene restored={state.island.restored}>
        <Image
          alt="A quiet storybook meadow with a vanilla windmill, crystal trees, and golden falls"
          className="object-cover"
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          src="/images/joy_meadow_placeholder.png"
        />
        <div className="absolute inset-x-0 bottom-0 bg-background/90 px-5 py-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">
                {state.island.restored ? "Joy has returned" : "The meadow is waiting"}
              </p>
              <p className="text-sm text-muted-foreground">
                Restoration {state.island.restoration_level}%
              </p>
            </div>
            {!state.started ? (
              <Button disabled={gameplay.isActing} onClick={() => gameplay.startGame()}>
                Enter Joy Meadow
              </Button>
            ) : null}
          </div>
        </div>
      </JoyMeadowScene>

      {gameplay.error ? (
        <p className="mt-4 text-sm text-danger" role="alert">
          {gameplay.error.message}
        </p>
      ) : null}

      {state.started ? (
        <div className="mt-8 space-y-10">
          <section aria-labelledby="dialogue-title">
            <h2 className="font-display text-2xl font-semibold text-foreground" id="dialogue-title">
              Meadow voices
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {state.dialogue.map((line) => {
                const dialogueCard = (
                  <Card>
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {line.role}
                    </p>
                    <h3 className="mt-1 font-semibold text-foreground">{line.character_name}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{line.text}</p>
                  </Card>
                );
                return line.role === "companion" ? (
                  <AmbientMotion key={line.character_id}>{dialogueCard}</AmbientMotion>
                ) : (
                  <div key={line.character_id}>{dialogueCard}</div>
                );
              })}
            </div>
            <div className="mt-4 grid gap-4 border-y border-border py-5 lg:grid-cols-2">
              <form onSubmit={submitNpcMessage}>
                <label className="text-sm font-semibold text-foreground" htmlFor="npc-message">
                  Speak with the Meadow Keeper
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    className="min-h-11 flex-1 rounded-control border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-accent"
                    id="npc-message"
                    maxLength={500}
                    onChange={(event) => setNpcMessage(event.target.value)}
                    placeholder="Ask about restoring Joy"
                    value={npcMessage}
                  />
                  <Button disabled={!npcMessage.trim() || ai.npcChat.isPending} type="submit">
                    {ai.npcChat.isPending ? "Listening..." : "Ask"}
                  </Button>
                </div>
                {ai.npcChat.data ? (
                  <AIResponse
                    fallbackUsed={ai.npcChat.data.fallback_used}
                    text={ai.npcChat.data.reply}
                  />
                ) : null}
                {ai.npcChat.error ? <AIError message={ai.npcChat.error.message} /> : null}
              </form>

              <div>
                <p className="text-sm font-semibold text-foreground">Lumi&apos;s guidance</p>
                <Button
                  className="mt-2"
                  disabled={ai.companion.isPending}
                  onClick={() => ai.companion.mutate("hint")}
                  variant="secondary"
                >
                  {ai.companion.isPending ? "Lumi is thinking..." : "Ask Lumi for a hint"}
                </Button>
                {ai.companion.data ? (
                  <AIResponse
                    fallbackUsed={ai.companion.data.fallback_used}
                    text={ai.companion.data.response}
                  />
                ) : null}
                {ai.companion.error ? <AIError message={ai.companion.error.message} /> : null}
              </div>
            </div>
          </section>

          <section aria-labelledby="ingredients-title">
            <h2
              className="font-display text-2xl font-semibold text-foreground"
              id="ingredients-title"
            >
              Starter ingredients
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {state.inventory.map((item) => (
                <IngredientMotion collected={item.collected} key={item.ingredient_id}>
                  <Card>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          In satchel: {item.quantity}
                        </p>
                      </div>
                      <Button
                        disabled={item.collected || gameplay.isActing}
                        onClick={() =>
                          gameplay.collectIngredient(item.ingredient_id, {
                            onSuccess: () => ai.companion.mutate("ingredient_collected")
                          })
                        }
                        variant="secondary"
                      >
                        {item.collected ? "Collected" : `Collect ${item.name}`}
                      </Button>
                    </div>
                  </Card>
                </IngredientMotion>
              ))}
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-2">
            <section aria-labelledby="quest-title" className="border-y border-border py-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">Quest</p>
              <h2
                className="mt-2 font-display text-2xl font-semibold text-foreground"
                id="quest-title"
              >
                {state.quest.title}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">{state.quest.description}</p>
              <p className="mt-4 text-sm font-semibold capitalize text-foreground">
                Status: {state.quest.status.replace("_", " ")}
              </p>
              {state.quest.status === "not_started" ? (
                <Button
                  className="mt-5"
                  disabled={gameplay.isActing}
                  onClick={() => gameplay.startQuest()}
                >
                  Start quest
                </Button>
              ) : null}
              {state.quest.can_complete ? (
                <Button
                  className="mt-5"
                  disabled={gameplay.isActing}
                  onClick={() =>
                    gameplay.restoreJoy(undefined, {
                      onSuccess: () => ai.companion.mutate("joy_restored")
                    })
                  }
                >
                  Restore Joy Meadow
                </Button>
              ) : null}
            </section>

            <CraftingMotion crafted={state.recipe.crafted}>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                Heart Flavor
              </p>
              <h2
                className="mt-2 font-display text-2xl font-semibold text-foreground"
                id="recipe-title"
              >
                {state.recipe.name}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">{state.recipe.lore}</p>
              <p className="mt-4 text-sm text-muted-foreground">Vanilla Orchid + Honey Bloom</p>
              <Button
                className="mt-5"
                disabled={!questActive || !state.recipe.can_craft || gameplay.isActing}
                onClick={() =>
                  gameplay.craftRecipe(undefined, {
                    onSuccess: () => ai.companion.mutate("recipe_crafted")
                  })
                }
                variant={state.recipe.crafted ? "secondary" : "primary"}
              >
                {state.recipe.crafted
                  ? "Golden Vanilla Bloom crafted"
                  : "Craft Golden Vanilla Bloom"}
              </Button>
              <Button
                className="ml-2 mt-5"
                disabled={ai.recipe.isPending}
                onClick={() => ai.recipe.mutate()}
                variant="ghost"
              >
                {ai.recipe.isPending ? "Remembering flavor..." : "Describe flavor"}
              </Button>
              {ai.recipe.data ? (
                <AIResponse
                  fallbackUsed={ai.recipe.data.fallback_used}
                  text={ai.recipe.data.lore}
                />
              ) : null}
              {ai.recipe.error ? <AIError message={ai.recipe.error.message} /> : null}
            </CraftingMotion>
          </div>

          <section aria-labelledby="inventory-title">
            <h2
              className="font-display text-2xl font-semibold text-foreground"
              id="inventory-title"
            >
              Inventory
            </h2>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {state.inventory.map((item) => (
                <div
                  className="flex items-center justify-between gap-4 py-3"
                  key={item.ingredient_id}
                >
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="text-sm text-muted-foreground">{item.quantity}</span>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="journal-title">
            <h2 className="font-display text-2xl font-semibold text-foreground" id="journal-title">
              Journal of Memories
            </h2>
            {state.journal.length ? (
              <JournalMotion>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {state.journal[0].title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-accent">
                  {state.journal[0].recipe_name}
                </p>
                <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                  {ai.journal.data?.story ?? state.journal[0].content}
                </p>
                <Button
                  className="mt-4"
                  disabled={ai.journal.isPending}
                  onClick={() => ai.journal.mutate()}
                  variant="secondary"
                >
                  {ai.journal.isPending ? "Writing the memory..." : "Tell this memory"}
                </Button>
                {ai.journal.data?.fallback_used ? (
                  <p className="mt-2 text-xs text-muted-foreground">Deterministic fallback</p>
                ) : null}
                {ai.journal.error ? <AIError message={ai.journal.error.message} /> : null}
              </JournalMotion>
            ) : (
              <p className="mt-3 text-muted-foreground">
                A new memory will appear when Joy returns.
              </p>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}

function AIResponse({ fallbackUsed, text }: { fallbackUsed: boolean; text: string }) {
  return (
    <div className="mt-3 border-l-2 border-accent pl-3" aria-live="polite">
      <p className="leading-7 text-muted-foreground">{text}</p>
      {fallbackUsed ? (
        <p className="mt-1 text-xs text-muted-foreground">Deterministic fallback</p>
      ) : null}
    </div>
  );
}

function AIError({ message }: { message: string }) {
  return (
    <p className="mt-3 text-sm text-danger" role="alert">
      {message} The meadow&apos;s familiar words remain above.
    </p>
  );
}
