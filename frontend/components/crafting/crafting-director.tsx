"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

import { RecipeReveal } from "@/components/crafting/recipe-reveal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMotionPreference } from "@/hooks/use-motion-preference";
import { craftingOverlay } from "@/lib/animation/motion-tokens";
import { audioEvents } from "@/lib/audio/audio-events";
import {
  craftingIngredients,
  craftingStatus,
  craftingTiming,
  type CraftingIngredientId,
  type CraftingPhase
} from "@/lib/crafting/crafting-config";
import {
  hasAllCraftingIngredients,
  isCraftingCinematic,
  nextCraftingPhase
} from "@/lib/crafting/crafting-sequence";

type CraftingInventoryItem = {
  ingredient_id: string;
  quantity: number;
};

type CraftingJournalMemory = {
  content: string;
  title: string;
};

type CraftingCallbacks = {
  onError: () => void;
  onSuccess: () => void;
};

type CraftingDirectorProps = {
  canCraft: boolean;
  crafted: boolean;
  disabled: boolean;
  emotion: string;
  ingredients: CraftingInventoryItem[];
  journalMemory?: CraftingJournalMemory;
  lore: string;
  onCraft: (callbacks: CraftingCallbacks) => void;
  onLumiReaction?: (event: "crafting_started" | "recipe_crafted") => void;
  recipeName: string;
  restored: boolean;
};

const RecipePresentation = dynamic(
  () =>
    import("@/components/crafting/recipe-presentation").then((module) => module.RecipePresentation),
  {
    loading: () => <Skeleton className="absolute inset-0 rounded-none" />,
    ssr: false
  }
);

function phaseDuration(phase: CraftingPhase, reducedMotion: boolean) {
  if (reducedMotion) {
    return 0;
  }
  const durations: Partial<Record<CraftingPhase, number>> = {
    celebrating: craftingTiming.celebrateMs,
    charging: craftingTiming.chargeMs,
    materializing: craftingTiming.materializeMs,
    returning: craftingTiming.returnMs
  };
  return durations[phase] ?? 0;
}

/** Orchestrates the presentation-only crafting sequence around the existing craft mutation. */
export function CraftingDirector({
  canCraft,
  crafted,
  disabled,
  emotion,
  ingredients,
  journalMemory,
  lore,
  onCraft,
  onLumiReaction,
  recipeName,
  restored
}: CraftingDirectorProps) {
  const reducedMotion = useMotionPreference();
  const [phase, setPhase] = useState<CraftingPhase>(crafted ? "complete" : "selecting");
  const [selected, setSelected] = useState<Set<CraftingIngredientId>>(new Set());
  const [serverSucceeded, setServerSucceeded] = useState(false);
  const [chargeReady, setChargeReady] = useState(false);
  const sequenceStarted = useRef(false);
  const onLumiReactionRef = useRef(onLumiReaction);
  const cinematic = isCraftingCinematic(phase);
  const allSelected = hasAllCraftingIngredients(selected);
  const inventory = useMemo(
    () => new Map(ingredients.map((ingredient) => [ingredient.ingredient_id, ingredient.quantity])),
    [ingredients]
  );

  useEffect(() => {
    if (crafted && !sequenceStarted.current && phase === "selecting") {
      setPhase("complete");
    }
  }, [crafted, phase]);

  useEffect(() => {
    onLumiReactionRef.current = onLumiReaction;
  }, [onLumiReaction]);

  useEffect(() => {
    if (phase !== "charging") {
      return;
    }
    const timer = window.setTimeout(
      () => setChargeReady(true),
      phaseDuration("charging", reducedMotion)
    );
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase === "charging" && chargeReady && serverSucceeded) {
      setPhase(nextCraftingPhase(phase));
    }
  }, [chargeReady, phase, serverSucceeded]);

  useEffect(() => {
    if (!["materializing", "celebrating", "returning"].includes(phase)) {
      return;
    }
    const timer = window.setTimeout(
      () => {
        const nextPhase = nextCraftingPhase(phase);
        setPhase(nextPhase);
        if (nextPhase === "celebrating") {
          audioEvents.publish("LumiCelebrated");
          onLumiReactionRef.current?.("recipe_crafted");
        }
        if (nextPhase === "revealed") {
          audioEvents.publish("RecipePageFlipped");
        }
        if (nextPhase === "complete") {
          sequenceStarted.current = false;
        }
      },
      phaseDuration(phase, reducedMotion)
    );
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (!cinematic) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cinematic]);

  useEffect(() => {
    if (phase !== "revealed") {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPhase("returning");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase]);

  function toggleIngredient(ingredientId: CraftingIngredientId) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(ingredientId)) {
        next.delete(ingredientId);
      } else {
        next.add(ingredientId);
      }
      return next;
    });
  }

  function beginCrafting() {
    if (!allSelected || !canCraft || disabled || sequenceStarted.current) {
      return;
    }
    sequenceStarted.current = true;
    setChargeReady(false);
    setServerSucceeded(false);
    setPhase("charging");
    audioEvents.publish("CraftingMagicCharged");
    onLumiReactionRef.current?.("crafting_started");
    onCraft({
      onError: () => {
        sequenceStarted.current = false;
        setChargeReady(false);
        setServerSucceeded(false);
        setPhase("selecting");
      },
      onSuccess: () => setServerSucceeded(true)
    });
  }

  function returnToMeadow() {
    setPhase("returning");
  }

  if (phase === "complete") {
    return (
      <section aria-label="Completed magical recipe" className="border-y border-border py-6">
        <div className="relative min-h-[26rem] overflow-hidden">
          <RecipePresentation
            className="absolute inset-0"
            interactive
            phase="complete"
            reducedMotion={reducedMotion}
          />
        </div>
        <RecipeReveal
          className="mt-5"
          emotion={emotion}
          journalMemory={journalMemory}
          lore={lore}
          recipeName={recipeName}
          restored={restored}
        />
      </section>
    );
  }

  return (
    <section aria-labelledby="crafting-title" className="border-y border-border py-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">Heart Flavor</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-foreground" id="crafting-title">
        {recipeName}
      </h2>
      <p className="mt-3 leading-7 text-muted-foreground">{lore}</p>
      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-foreground">Choose ingredients</legend>
        <div className="mt-3 space-y-2">
          {craftingIngredients.map((ingredient) => {
            const available = (inventory.get(ingredient.id) ?? 0) > 0;
            return (
              <label
                className="flex cursor-pointer items-start gap-3 rounded-control border border-border bg-surface px-3 py-3 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
                key={ingredient.id}
                onPointerEnter={() => {
                  if (available) {
                    audioEvents.publish("IngredientHovered");
                  }
                }}
              >
                <input
                  checked={selected.has(ingredient.id)}
                  className="mt-1 h-4 w-4 accent-accent"
                  disabled={!available || disabled}
                  onChange={() => toggleIngredient(ingredient.id)}
                  type="checkbox"
                />
                <span>
                  <span className="block font-semibold text-foreground">{ingredient.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {available ? ingredient.note : "Collect this ingredient first."}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <Button
        className="mt-5 w-full sm:w-auto"
        disabled={!allSelected || !canCraft || disabled}
        onClick={beginCrafting}
      >
        Begin magical crafting
      </Button>

      <AnimatePresence>
        {cinematic ? (
          <motion.div
            animate="visible"
            aria-describedby="crafting-status"
            aria-label="Magical crafting sequence"
            aria-modal="true"
            className="fixed inset-0 z-overlay overflow-hidden bg-foreground"
            exit="exit"
            initial="hidden"
            role="dialog"
            variants={craftingOverlay}
          >
            <RecipePresentation
              className="absolute inset-0"
              interactive={phase === "revealed"}
              phase={phase}
              reducedMotion={reducedMotion}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-4">
              <p
                className="rounded-control border border-border/60 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground shadow-panel backdrop-blur-sm"
                id="crafting-status"
                role="status"
              >
                {craftingStatus[phase]}
              </p>
            </div>
            {phase === "revealed" ? (
              <div className="absolute inset-x-0 bottom-0 max-h-[68vh] overflow-y-auto p-3 sm:p-6">
                <RecipeReveal
                  className="mx-auto max-w-4xl"
                  emotion={emotion}
                  journalMemory={journalMemory}
                  lore={lore}
                  onReturn={returnToMeadow}
                  recipeName={recipeName}
                  restored={restored}
                />
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
