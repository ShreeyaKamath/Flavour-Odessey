"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { audioEvents } from "@/lib/audio/audio-events";
import { pageTransition } from "@/lib/animation/motion-tokens";

type PageTransitionProps = {
  children: ReactNode;
};

/** Animates pathname changes while honoring reduced-motion preferences. */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reducedMotion = useMotionPreference();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate={reducedMotion ? undefined : "visible"}
        data-motion-reduced={String(reducedMotion)}
        exit={reducedMotion ? undefined : "exit"}
        initial={reducedMotion ? false : "hidden"}
        key={pathname}
        onAnimationStart={() => audioEvents.publish("PageFlipped")}
        variants={reducedMotion ? undefined : pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
