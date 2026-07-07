"use client";

import { motion } from "framer-motion";

import type { CinematicEffectCue } from "@/lib/cinematics";
import { motionTransitions } from "@/lib/animation/motion-tokens";
import { cn } from "@/utils/cn";

const effectClasses: Record<CinematicEffectCue["kind"], string> = {
  bloom: "bg-accent/25 blur-2xl",
  butterflies: "bg-primary/40",
  fade: "bg-background",
  floating_leaves: "bg-success/40",
  light_shafts: "bg-primary/30 blur-xl",
  magical_glow: "bg-accent/30 blur-2xl",
  screen_shake: "bg-danger/10",
  sparkles: "bg-primary/60 shadow-glow",
  vignette: "bg-transparent shadow-[inset_0_0_9rem_rgb(0_0_0_/_0.34)]"
};

/** Renders lightweight cinematic visual effects without flashing. */
export function CinematicEffects({
  effects,
  reducedMotion
}: {
  effects: CinematicEffectCue[];
  reducedMotion: boolean;
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {effects.map((effect, index) => (
        <motion.span
          animate={
            reducedMotion
              ? { opacity: effect.intensity * 0.5 }
              : { opacity: [0, effect.intensity, 0] }
          }
          className={cn(
            "absolute rounded-full",
            effect.kind === "vignette" || effect.kind === "fade"
              ? "inset-0 rounded-none"
              : "left-[12%] top-[16%] h-36 w-36",
            effectClasses[effect.kind]
          )}
          data-bloom-layer={String(Boolean(effect.bloomLayer))}
          data-cinematic-effect={effect.kind}
          key={`${effect.kind}-${effect.at}-${index}`}
          transition={{
            ...motionTransitions.scene,
            duration: reducedMotion ? motionTransitions.reveal.duration : effect.duration
          }}
        />
      ))}
      {effects.some((effect) => effect.kind === "sparkles") ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgb(var(--storybook-gold)/0.42)_0_0.08rem,transparent_0.09rem)] bg-[length:3rem_3rem]" />
      ) : null}
    </div>
  );
}
