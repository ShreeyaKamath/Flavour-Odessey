"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { useMotionPreference } from "@/hooks/use-motion-preference";
import { completionBadgeReveal, recipeBookReveal } from "@/lib/animation/motion-tokens";
import { assetManager } from "@/lib/assets/asset-manager";
import {
  craftingAssetSlots,
  craftingIngredientAssetSlots
} from "@/lib/crafting/crafting-asset-slots";
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

function useManifestAssetUrl(assetId: string): string | null {
  return useMemo(() => {
    try {
      const resolution = assetManager.resolve(assetId);
      return resolution.placeholder ? null : resolution.url;
    } catch {
      return null;
    }
  }, [assetId]);
}

function ProceduralScoopPreview({
  drizzleUrl,
  scoopUrl,
  sprinklesUrl
}: {
  drizzleUrl: string | null;
  scoopUrl: string | null;
  sprinklesUrl: string | null;
}) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-28 w-28 items-end justify-center"
      data-asset-fallback="procedural_scoop"
    >
      <span className="absolute bottom-1 h-20 w-14 rotate-180 rounded-t-full bg-[#c98745] shadow-inner" />
      <span
        className="absolute top-2 h-20 w-24 rounded-full border border-white/50 bg-[#ffd878] shadow-[0_0_30px_rgba(255,216,107,.42)]"
        data-asset-slot={craftingAssetSlots.scoopBase}
        style={
          scoopUrl ? { backgroundImage: `url("${scoopUrl}")`, backgroundSize: "cover" } : undefined
        }
      />
      {drizzleUrl ? (
        <span
          className="absolute left-5 top-9 h-9 w-20 bg-contain bg-center bg-no-repeat"
          data-asset-slot={craftingAssetSlots.drizzle}
          style={{ backgroundImage: `url("${drizzleUrl}")` }}
        />
      ) : (
        <span
          className="absolute left-5 top-10 h-7 w-20 rounded-[50%] border-t-4 border-[#76543c]"
          data-asset-fallback="procedural_drizzle"
          data-asset-slot={craftingAssetSlots.drizzle}
        />
      )}
      {sprinklesUrl ? (
        <span
          className="absolute left-4 top-4 h-16 w-20 bg-contain bg-center bg-no-repeat"
          data-asset-slot={craftingAssetSlots.sprinkles}
          style={{ backgroundImage: `url("${sprinklesUrl}")` }}
        />
      ) : (
        <span
          data-asset-fallback="procedural_sprinkles"
          data-asset-slot={craftingAssetSlots.sprinkles}
        >
          <span className="absolute left-9 top-7 h-1 w-4 rotate-12 rounded-full bg-[#f49a9a]" />
          <span className="absolute left-14 top-10 h-1 w-4 -rotate-12 rounded-full bg-[#79d7b2]" />
          <span className="absolute left-11 top-14 h-1 w-4 rotate-45 rounded-full bg-[#ffd86b]" />
          <span className="absolute left-16 top-6 h-1 w-4 rotate-45 rounded-full bg-[#f49a9a]" />
        </span>
      )}
      <span className="absolute right-6 top-0 h-8 w-8 rounded-full bg-[#f3c6ea] shadow-[0_0_18px_rgba(243,198,234,.55)]" />
    </span>
  );
}

function RecipeCardPreview() {
  const cardUrl = useManifestAssetUrl(craftingAssetSlots.recipeCard);
  const drizzleUrl = useManifestAssetUrl(craftingAssetSlots.drizzle);
  const recipeUrl = useManifestAssetUrl(craftingAssetSlots.recipe);
  const scoopUrl = useManifestAssetUrl(craftingAssetSlots.scoopBase);
  const sprinklesUrl = useManifestAssetUrl(craftingAssetSlots.sprinkles);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "mb-5 flex min-h-40 items-center justify-center overflow-hidden rounded-control border border-border bg-[#fff5d9] p-4 shadow-inner",
        cardUrl && "bg-cover bg-center"
      )}
      data-asset-slot={craftingAssetSlots.recipeCard}
      style={cardUrl ? { backgroundImage: `url("${cardUrl}")` } : undefined}
    >
      {recipeUrl ? (
        <span
          className="block h-32 w-32 bg-contain bg-center bg-no-repeat drop-shadow"
          data-asset-slot={craftingAssetSlots.recipe}
          style={{ backgroundImage: `url("${recipeUrl}")` }}
        />
      ) : (
        <ProceduralScoopPreview
          drizzleUrl={drizzleUrl}
          scoopUrl={scoopUrl}
          sprinklesUrl={sprinklesUrl}
        />
      )}
    </div>
  );
}

function IngredientAssetMark({
  assetId,
  variant
}: {
  assetId: string;
  variant: "honey_bloom" | "vanilla_orchid";
}) {
  const assetUrl = useManifestAssetUrl(assetId);

  if (assetUrl) {
    return (
      <span
        aria-hidden="true"
        className="mt-1 h-8 w-8 shrink-0 rounded-full bg-contain bg-center bg-no-repeat"
        data-asset-slot={assetId}
        style={{ backgroundImage: `url("${assetUrl}")` }}
      />
    );
  }

  if (variant === "vanilla_orchid") {
    return (
      <span
        aria-hidden="true"
        className="relative mt-1 h-8 w-8 shrink-0"
        data-asset-fallback="procedural_vanilla_orchid"
        data-asset-slot={assetId}
      >
        <span className="absolute left-[14px] top-3 h-5 w-1 rounded-full bg-[#fff1d4]" />
        {[0, 1, 2, 3, 4].map((petal) => (
          <span
            className="absolute left-2 top-1 h-4 w-4 origin-bottom rounded-full bg-[#f3c6ea]"
            key={petal}
            style={{ transform: `rotate(${petal * 72}deg) translateY(-4px)` }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="relative mt-1 h-8 w-8 shrink-0"
      data-asset-fallback="procedural_honey_bloom"
      data-asset-slot={assetId}
    >
      <span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-[#f2b84b] shadow-[0_0_14px_rgba(242,184,75,.45)]" />
      <span className="absolute left-3 top-0 h-4 w-3 rounded-full bg-[#8be2c7]" />
    </span>
  );
}

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
          <RecipeCardPreview />
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
                <IngredientAssetMark
                  assetId={craftingIngredientAssetSlots[ingredient.id]}
                  variant={ingredient.id}
                />
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
