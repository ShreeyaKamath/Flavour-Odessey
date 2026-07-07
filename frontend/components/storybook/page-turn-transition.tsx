"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { audioEvents } from "@/lib/audio/audio-events";
import { motionTransitions } from "@/lib/animation/motion-tokens";

type PageTurnTransitionProps = {
  children: ReactNode;
};

/** Adds a reduced-motion-aware page turn reveal around storybook content. */
export function PageTurnTransition({ children }: PageTurnTransitionProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.div
      animate={reducedMotion ? undefined : { opacity: 1, rotateY: 0 }}
      initial={reducedMotion ? false : { opacity: 0.65, rotateY: -7 }}
      onAnimationStart={() => audioEvents.publish("PageFlipped")}
      style={{ transformOrigin: "left center" }}
      transition={motionTransitions.scene}
    >
      {children}
    </motion.div>
  );
}
