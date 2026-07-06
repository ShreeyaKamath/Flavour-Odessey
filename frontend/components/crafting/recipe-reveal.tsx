"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useMotionPreference } from "@/hooks/use-motion-preference";
import { completionBadgeReveal, recipeBookReveal } from "@/lib/animation/motion-tokens";
import { craftingIngredients } from "@/lib/crafting/crafting-config";
import { cn } from "@/utils/cn";

type JournalMemory = {
  content: string;
  title: string;
};

type RecipeRevealProps = {
  className?: string;
  emotion: string;
  journalMemory?: JournalMemory;
  lore: string;
  onReturn?: () => void;
  recipeName: string;
  restored: boolean;
};

/** Opens the completed recipe as an animated book with canonical progress details. */
export function RecipeReveal({
  className,
  emotion,
  journalMemory,
  lore,
  onReturn,
  recipeName,
  restored
}: RecipeRevealProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.section
      animate={reducedMotion ? undefined : "visible"}
      aria-labelledby="crafted-recipe-title"
      className={cn(
        "relative overflow-hidden rounded-panel border border-border bg-surface p-5 text-foreground shadow-panel sm:p-7",
        className
      )}
      data-motion-reduced={String(reducedMotion)}
      initial={reducedMotion ? false : "hidden"}
      variants={reducedMotion ? undefined : recipeBookReveal}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 hidden w-px bg-border md:block"
      />
      <div className="grid gap-7 md:grid-cols-2 md:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Heart Flavor</p>
          <h2
            className="mt-2 font-display text-2xl font-semibold text-foreground"
            id="crafted-recipe-title"
          >
            {recipeName}
          </h2>
          <motion.p
            animate={reducedMotion ? undefined : "visible"}
            className="mt-3 inline-flex rounded-control bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent"
            initial={reducedMotion ? false : "hidden"}
            variants={reducedMotion ? undefined : completionBadgeReveal}
          >
            Recipe complete
          </motion.p>
          <p className="mt-5 leading-7 text-muted-foreground">{lore}</p>
          <p className="mt-5 text-sm font-semibold capitalize text-foreground">
            {restored ? "Emotion restored" : "Emotion carried"}: {emotion}
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Meadow ingredients</h3>
          <ul className="mt-3 space-y-3">
            {craftingIngredients.map((ingredient) => (
              <li className="flex items-start gap-3" key={ingredient.id}>
                <span
                  aria-hidden="true"
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary-foreground"
                >
                  +
                </span>
                <span>
                  <span className="block font-semibold text-foreground">{ingredient.name}</span>
                  <span className="text-sm text-muted-foreground">{ingredient.note}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-border pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Journal of Memories
            </p>
            {journalMemory ? (
              <>
                <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                  {journalMemory.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {journalMemory.content}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This memory will bloom when Joy Meadow is restored.
              </p>
            )}
          </div>
        </div>
      </div>
      {onReturn ? (
        <Button autoFocus className="mt-6 w-full sm:w-auto" onClick={onReturn}>
          Return to Joy Meadow
        </Button>
      ) : null}
    </motion.section>
  );
}
