"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useMotionPreference } from "@/hooks/use-motion-preference";
import { audioEvents } from "@/lib/audio/audio-events";
import { LumiAnimationController } from "@/lib/lumi/lumi-animation-controller";
import { lumiAssetIds, resolveLumiAsset, resolveLumiEmotionAsset } from "@/lib/lumi/lumi-assets";
import { LumiEmotionController } from "@/lib/lumi/lumi-emotion-controller";
import type { LumiEvent, LumiState } from "@/lib/lumi/lumi-types";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";
import { cn } from "@/utils/cn";

type LumiFloatingCompanionProps = {
  hint: string;
  onAsk: () => void;
  onToggleSleep: (event: LumiEvent) => void;
  state: LumiState;
  world?: LivingWorldSnapshot;
};

/** Renders Lumi as a floating, cursor-aware magical companion in Joy Meadow. */
export function LumiFloatingCompanion({
  hint,
  onAsk,
  onToggleSleep,
  state,
  world
}: LumiFloatingCompanionProps) {
  const reducedMotion = useMotionPreference();
  const emotion = new LumiEmotionController(state.emotion);
  const animation = useMemo(() => new LumiAnimationController(), []);
  const [focus, setFocus] = useState({ x: 0, y: 0 });
  const [paused, setPaused] = useState(false);
  const [failedAssets, setFailedAssets] = useState<Set<string>>(() => new Set());
  const bodyVariants = animation.body(state.emotion, state.mode, reducedMotion || paused);
  const bubbleVariants = animation.bubble(reducedMotion || paused);
  const spriteAsset = resolveLumiEmotionAsset(state.emotion);
  const glowAsset = resolveLumiAsset(lumiAssetIds.glow);
  const trailAsset = resolveLumiAsset(lumiAssetIds.trail);

  function markAssetFailed(url: string) {
    setFailedAssets((current) => new Set(current).add(url));
  }

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 12;
      setFocus({ x, y });
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reducedMotion]);

  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <aside
      aria-label="Lumi companion"
      className="pointer-events-none fixed bottom-5 right-5 z-overlay flex max-w-[min(24rem,calc(100vw-2rem))] flex-col items-end gap-3"
    >
      <AnimatePresence>
        <motion.div
          animate="visible"
          className="pointer-events-auto rounded-panel border border-border bg-background/90 p-3 text-sm shadow-panel backdrop-blur-sm"
          exit="hidden"
          initial="hidden"
          variants={bubbleVariants}
        >
          <p className="font-semibold text-foreground">{emotion.label()} Lumi</p>
          <p className="mt-1 leading-6 text-muted-foreground" aria-live="polite">
            {state.message}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              aria-label="Ask Lumi for contextual guidance"
              className="min-h-9 px-3 py-1"
              onClick={() => {
                audioEvents.publish("LumiHovered");
                onAsk();
              }}
              variant="secondary"
            >
              Ask Lumi
            </Button>
            <Button
              aria-label={state.sleeping ? "Wake Lumi" : "Let Lumi rest"}
              className="min-h-9 px-3 py-1"
              onClick={() => onToggleSleep(state.sleeping ? "wake" : "sleep")}
              variant="ghost"
            >
              {state.sleeping ? "Wake" : "Rest"}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        aria-label={emotion.ariaLabel()}
        animate={bodyVariants ? "animate" : undefined}
        className={cn(
          "pointer-events-auto relative grid h-20 w-20 place-items-center rounded-full border border-border bg-surface-raised text-2xl text-accent",
          emotion.expressionClass(),
          world?.condition === "night" ? "shadow-glow ring-2 ring-accent" : null
        )}
        data-render-source="asset_manifest"
        data-visual-element="lumi"
        data-weather={world?.condition}
        initial={bodyVariants ? "initial" : false}
        onClick={onAsk}
        onFocus={() => audioEvents.publish("LumiHinted")}
        onMouseEnter={() => audioEvents.publish("LumiHovered")}
        style={reducedMotion ? undefined : { x: focus.x, y: focus.y }}
        type="button"
        variants={bodyVariants}
      >
        {world?.condition === "rain" ? (
          <span
            aria-hidden="true"
            className="absolute -top-4 h-8 w-14 rounded-t-full bg-accent/70"
          />
        ) : null}
        {!failedAssets.has(trailAsset.url) ? (
          <span aria-hidden="true" className="absolute -left-14 top-6 h-10 w-20 opacity-70">
            <Image
              alt=""
              fill
              onError={() => markAssetFailed(trailAsset.url)}
              sizes="5rem"
              src={trailAsset.url}
              unoptimized
            />
          </span>
        ) : null}
        {!failedAssets.has(glowAsset.url) ? (
          <span
            aria-hidden="true"
            className={cn(
              "absolute h-16 w-16",
              emotion.isBright() ? "scale-125 opacity-95" : "scale-100 opacity-75"
            )}
          >
            <Image
              alt=""
              fill
              onError={() => markAssetFailed(glowAsset.url)}
              sizes="4rem"
              src={glowAsset.url}
              unoptimized
            />
          </span>
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "absolute h-10 w-10 rounded-full bg-accent/20",
              emotion.isBright() ? "scale-125" : "scale-100"
            )}
          />
        )}
        {!failedAssets.has(spriteAsset.url) ? (
          <span aria-hidden="true" className="relative h-14 w-14">
            <Image
              alt=""
              fill
              onError={() => markAssetFailed(spriteAsset.url)}
              priority={state.emotion === "happy"}
              sizes="3.5rem"
              src={spriteAsset.url}
              unoptimized
            />
          </span>
        ) : (
          <span aria-hidden="true" className="relative">
            L
          </span>
        )}
        <span
          aria-hidden="true"
          className="absolute left-4 top-6 h-2 w-2 rounded-full bg-foreground"
        />
        <span
          aria-hidden="true"
          className="absolute right-4 top-6 h-2 w-2 rounded-full bg-foreground"
        />
      </motion.button>
    </aside>
  );
}
