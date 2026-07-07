"use client";

import dynamic from "next/dynamic";

import { JoyMeadowAudio } from "@/components/audio/joy-meadow-audio";
import { CraftingDirector } from "@/components/crafting/crafting-director";
import { LumiFloatingCompanion } from "@/components/lumi/lumi-floating-companion";
import { LumiInteractionPanel } from "@/components/lumi/lumi-interaction-panel";
import { NpcVillage } from "@/components/npcs/npc-village";
import { EnchantedCookbook } from "@/components/storybook/enchanted-cookbook";
import { GlowingBookmark } from "@/components/storybook/glowing-bookmark";
import { MagicalPage } from "@/components/storybook/magical-page";
import { MagicalSatchel } from "@/components/storybook/magical-satchel";
import { TreeQuestBoard } from "@/components/storybook/tree-quest-board";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GameplaySkeleton,
  IngredientMotion,
  JournalMotion,
  JoyMeadowScene
} from "@/features/game/gameplay-motion";
import { useAIInteractions } from "@/features/game/use-ai-interactions";
import { useGameplay } from "@/features/game/use-gameplay";
import { useLumiCompanion } from "@/features/lumi/use-lumi-companion";
import { useNpcs } from "@/features/npcs/use-npcs";
import { useLivingWorld } from "@/features/world/use-living-world";

type GameplayScreenProps = {
  islandId?: string;
};

const JoyMeadowEnvironment = dynamic(
  () =>
    import("@/components/world/joy-meadow-environment").then(
      (module) => module.JoyMeadowEnvironment
    ),
  {
    loading: () => <Skeleton className="absolute inset-0 rounded-none" />,
    ssr: false
  }
);

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
  const npcs = useNpcs(Boolean(gameplay.state.data?.started));
  const livingWorld = useLivingWorld();
  const lumi = useLumiCompanion(
    gameplay.state.data,
    npcs.npcs.data?.items,
    ai.companion.data,
    ai.companion.error,
    livingWorld.world
  );

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
      <JoyMeadowAudio active={state.started} world={livingWorld.world} />
      <LumiFloatingCompanion
        hint={lumi.hint}
        onAsk={() => {
          lumi.react("hint_requested");
          ai.companion.mutate("hint");
        }}
        onToggleSleep={(event) => lumi.react(event)}
        state={lumi.state}
        world={livingWorld.world}
      />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Joy Meadow</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">
            Restore the first scoop
          </h1>
        </div>
        <GlowingBookmark
          label={state.save.status === "saved" ? "Progress saved" : "Not saved"}
          sublabel={formatSavedAt(state.save.last_saved_at)}
        />
      </header>

      <JoyMeadowScene restored={state.island.restored}>
        <JoyMeadowEnvironment
          crafted={state.recipe.crafted}
          paused={livingWorld.paused}
          restored={state.island.restored}
          world={livingWorld.world}
        />
        <div className="absolute inset-x-0 bottom-0 z-10 bg-background/90 px-5 py-4 backdrop-blur-sm">
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
          <section className="space-y-4">
            {npcs.npcs.isPending ? (
              <Card>
                <p className="text-sm text-muted-foreground">Gathering meadow voices...</p>
              </Card>
            ) : null}
            {npcs.npcs.isError ? (
              <p className="text-sm text-danger" role="alert">
                {npcs.npcs.error.message}
              </p>
            ) : null}
            {npcs.npcs.data ? (
              <NpcVillage
                chatError={ai.npcChat.error}
                chatPending={ai.npcChat.isPending}
                chatResponse={ai.npcChat.data}
                giftPending={npcs.gift.isPending}
                giftReaction={npcs.gift.data?.reaction}
                npcs={npcs.npcs.data.items}
                onGift={(npcId) => npcs.gift.mutate({ giftId: "golden_vanilla_bloom", npcId })}
                onSendMessage={(npcId, message) => {
                  lumi.react("npc_conversation");
                  const contextualMessage = `${message}\n\nJoy Meadow context: ${livingWorld.world.conditionLabel}, ${livingWorld.world.timeLabel}, ${livingWorld.world.seasonLabel}.`;
                  ai.npcChat.mutate(
                    { message: contextualMessage, npcId },
                    {
                      onSuccess: (response) =>
                        lumi.react("npc_conversation", `Lumi listens as ${response.reply}`)
                    }
                  );
                }}
                world={livingWorld.world}
              />
            ) : null}
            <div className="border-y border-border py-5">
              <LumiInteractionPanel
                aiError={ai.companion.error}
                aiPending={ai.companion.isPending}
                aiResponse={ai.companion.data}
                hint={lumi.hint}
                memories={lumi.memories}
                memorySummary={lumi.memorySummary}
                onAskHint={() => {
                  lumi.react("hint_requested");
                  ai.companion.mutate("hint");
                }}
                state={lumi.state}
              />
            </div>
          </section>

          <section aria-labelledby="ingredients-title">
            <MagicalSatchel title="Starter ingredients" titleId="ingredients-title">
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
                              onSuccess: () => {
                                lumi.react("ingredient_collected");
                                ai.companion.mutate("ingredient_collected");
                              }
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
            </MagicalSatchel>
          </section>

          <section aria-labelledby="quest-title">
            <TreeQuestBoard>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">Quest</p>
              <h2
                className="mt-2 font-display text-2xl font-semibold text-foreground"
                id="quest-title"
              >
                {state.quest.title}
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                {state.quest.description}
              </p>
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
                      onSuccess: () => {
                        lumi.react("joy_restored");
                        ai.companion.mutate("joy_restored");
                      }
                    })
                  }
                >
                  Restore Joy Meadow
                </Button>
              ) : null}
            </TreeQuestBoard>
          </section>

          <EnchantedCookbook>
            <CraftingDirector
              canCraft={questActive && state.recipe.can_craft}
              crafted={state.recipe.crafted}
              disabled={gameplay.isActing}
              emotion={state.recipe.emotion}
              ingredients={state.inventory}
              journalMemory={state.journal[0]}
              lore={state.recipe.lore}
              onCraft={({ onError, onSuccess }) =>
                gameplay.craftRecipe(undefined, {
                  onError,
                  onSuccess: () => {
                    onSuccess();
                    lumi.react("recipe_crafted");
                    ai.companion.mutate("recipe_crafted");
                  }
                })
              }
              onLumiReaction={(event) => lumi.react(event)}
              recipeName={state.recipe.name}
              restored={state.island.restored}
            />
          </EnchantedCookbook>
          <div className="border-b border-border pb-6">
            <Button
              disabled={ai.recipe.isPending}
              onClick={() => ai.recipe.mutate()}
              variant="ghost"
            >
              {ai.recipe.isPending ? "Remembering flavor..." : "Describe flavor"}
            </Button>
            {ai.recipe.data ? (
              <AIResponse fallbackUsed={ai.recipe.data.fallback_used} text={ai.recipe.data.lore} />
            ) : null}
            {ai.recipe.error ? <AIError message={ai.recipe.error.message} /> : null}
          </div>

          <section aria-labelledby="inventory-title">
            <MagicalSatchel title="Inventory" titleId="inventory-title">
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
            </MagicalSatchel>
          </section>

          <section aria-labelledby="journal-title">
            <MagicalPage title="Journal of Memories" titleId="journal-title">
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
            </MagicalPage>
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
