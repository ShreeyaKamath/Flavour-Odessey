"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { CinematicEffects } from "@/components/cinematics/cinematic-effects";
import { CinematicSubtitles } from "@/components/cinematics/cinematic-subtitles";
import { Button } from "@/components/ui/button";
import { useMotionPreference } from "@/hooks/use-motion-preference";
import { motionTransitions } from "@/lib/animation/motion-tokens";
import { audioEvents } from "@/lib/audio/audio-events";
import { CinematicDirector, type CinematicId } from "@/lib/cinematics";

type CinematicOverlayProps = {
  onClose: () => void;
  open: boolean;
  sceneId: CinematicId;
};

/** Plays a data-driven cinematic with camera metadata, subtitles, effects, and skip support. */
export function CinematicOverlay({ onClose, open, sceneId }: CinematicOverlayProps) {
  const director = useMemo(() => new CinematicDirector(), []);
  const reducedMotion = useMotionPreference();
  const scene = director.scene(sceneId);
  const [time, setTime] = useState(0);
  const frame = director.frame(sceneId, time, reducedMotion);

  useEffect(() => {
    if (!open) {
      setTime(0);
      return;
    }
    audioEvents.publish("CinematicStarted");
    const startedAt = performance.now();
    const timer = window.setInterval(
      () => {
        const elapsed = (performance.now() - startedAt) / 1000;
        setTime(Math.min(elapsed, scene.duration));
        if (elapsed >= scene.duration) {
          audioEvents.publish("CinematicCompleted");
          window.clearInterval(timer);
        }
      },
      reducedMotion ? 180 : 80
    );
    return () => window.clearInterval(timer);
  }, [open, reducedMotion, scene.duration]);

  useEffect(() => {
    if (open && time >= scene.duration) {
      const closeTimer = window.setTimeout(onClose, 700);
      return () => window.clearTimeout(closeTimer);
    }
    return undefined;
  }, [onClose, open, scene.duration, time]);

  function skip() {
    setTime(scene.duration);
    audioEvents.publish("CinematicSkipped");
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          aria-label={`${scene.title} cinematic`}
          aria-modal="true"
          className="fixed inset-0 z-modal bg-background/95 text-foreground"
          data-camera-depth={frame.camera.depth.toFixed(2)}
          data-camera-focus={frame.camera.focus}
          data-camera-rail={frame.camera.rail}
          data-camera-zoom={frame.camera.zoom.toFixed(2)}
          data-cinematic-scene={scene.id}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          role="dialog"
          transition={motionTransitions.scene}
          animate={{ opacity: 1 }}
        >
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-10 bg-foreground/90" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 bg-foreground/90" />
          <CinematicEffects effects={frame.effects} reducedMotion={reducedMotion} />
          <motion.div
            animate={
              reducedMotion
                ? undefined
                : {
                    scale: frame.camera.zoom,
                    x: frame.camera.orbit,
                    y: -frame.camera.depth * 20
                  }
            }
            className="absolute inset-10 overflow-hidden rounded-panel border border-border storybook-parchment storybook-border"
            transition={motionTransitions.scene}
          >
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {frame.chapter.title}
              </p>
              <h2 className="storybook-ink mt-3 font-display text-4xl font-semibold">
                {scene.title}
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{scene.description}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {frame.participants.map((participant) => (
                  <span
                    className="rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-semibold capitalize text-foreground"
                    key={`${participant.actor}-${participant.action}-${participant.at}`}
                  >
                    {participant.actor.replace("_", " ")} {participant.action}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
          <CinematicSubtitles frame={frame} />
          <div className="absolute right-4 top-14 z-30 flex items-center gap-3">
            <p className="text-xs font-semibold text-muted-foreground">
              {Math.round(frame.progress * 100)}%
            </p>
            <Button aria-label={`Skip ${scene.title}`} onClick={skip} variant="secondary">
              Skip
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
