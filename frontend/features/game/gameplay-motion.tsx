"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useMotionPreference } from "@/hooks/use-motion-preference";
import {
  ambientFloat,
  ingredientCollect,
  journalReveal,
  restorationGlow,
  sceneEntrance,
  sparkleReveal
} from "@/lib/animation/motion-tokens";

const sparklePositions = [
  { left: "8%", top: "70%" },
  { left: "20%", top: "35%" },
  { left: "36%", top: "62%" },
  { left: "52%", top: "28%" },
  { left: "66%", top: "58%" },
  { left: "80%", top: "34%" },
  { left: "92%", top: "68%" }
] as const;

type MotionChildrenProps = {
  children: ReactNode;
};

/** Displays the Joy Meadow loading layout without content shifts. */
export function GameplaySkeleton() {
  return (
    <div aria-label="Loading Joy Meadow" className="mx-auto max-w-7xl space-y-6" role="status">
      <span className="sr-only">Loading Joy Meadow</span>
      <div className="flex items-end justify-between gap-4">
        <div className="w-full max-w-xl space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-3/4" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <Skeleton className="h-72 w-full rounded-panel" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-36 w-full rounded-panel" />
        <Skeleton className="h-36 w-full rounded-panel" />
      </div>
    </div>
  );
}

/** Animates the Joy Meadow scene entrance and restoration reveal. */
export function JoyMeadowScene({
  children,
  restored
}: MotionChildrenProps & { restored: boolean }) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.section
      animate={reducedMotion ? undefined : "visible"}
      aria-label="Living Joy Meadow scene"
      className="relative ml-[calc(50%-50vw)] mt-6 h-[min(68vh,44rem)] min-h-[28rem] w-screen overflow-hidden border-y border-border"
      data-motion-effect="scene-entrance"
      data-motion-reduced={String(reducedMotion)}
      initial={reducedMotion ? false : "hidden"}
      variants={reducedMotion ? undefined : sceneEntrance}
    >
      {children}
      <AnimatePresence>
        {restored && !reducedMotion ? (
          <>
            <motion.div
              animate="visible"
              className="pointer-events-none absolute inset-0 bg-accent/25"
              exit="hidden"
              initial="hidden"
              variants={restorationGlow}
            />
            <Sparkles />
          </>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}

/** Adds subtle ambient motion to companion content. */
export function AmbientMotion({ children }: MotionChildrenProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.div
      animate={reducedMotion ? undefined : "floating"}
      data-motion-effect="ambient"
      data-motion-reduced={String(reducedMotion)}
      initial={reducedMotion ? false : "resting"}
      variants={reducedMotion ? undefined : ambientFloat}
    >
      {children}
    </motion.div>
  );
}

/** Animates an ingredient when server state marks it collected. */
export function IngredientMotion({
  children,
  collected
}: MotionChildrenProps & { collected: boolean }) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.div
      animate={reducedMotion ? undefined : collected ? "collected" : "idle"}
      data-motion-effect="ingredient-collect"
      data-motion-reduced={String(reducedMotion)}
      initial={false}
      variants={reducedMotion ? undefined : ingredientCollect}
    >
      {children}
    </motion.div>
  );
}

/** Reveals a restored Journal of Memories entry. */
export function JournalMotion({ children }: MotionChildrenProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.div
      animate={reducedMotion ? undefined : "visible"}
      className="mt-4 border-l-4 border-accent pl-5"
      data-motion-effect="journal-reveal"
      data-motion-reduced={String(reducedMotion)}
      initial={reducedMotion ? false : "hidden"}
      variants={reducedMotion ? undefined : journalReveal}
    >
      {children}
    </motion.div>
  );
}

function Sparkles({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={
        compact ? "pointer-events-none absolute inset-4" : "pointer-events-none absolute inset-0"
      }
    >
      {sparklePositions.map((position, index) => (
        <motion.span
          animate="visible"
          className="absolute h-2 w-2 rounded-full bg-accent shadow-glow will-change-transform"
          custom={index}
          initial="hidden"
          key={`${position.left}-${position.top}`}
          style={position}
          variants={sparkleReveal}
        />
      ))}
    </div>
  );
}
