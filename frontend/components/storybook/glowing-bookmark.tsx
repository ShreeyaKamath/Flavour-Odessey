"use client";

import { motion } from "framer-motion";

import { useMotionPreference } from "@/hooks/use-motion-preference";
import { audioEvents } from "@/lib/audio/audio-events";
import { cn } from "@/utils/cn";

type GlowingBookmarkProps = {
  label: string;
  sublabel?: string;
  className?: string;
};

/** Displays save or progress status as a glowing bookmark ribbon. */
export function GlowingBookmark({ className, label, sublabel }: GlowingBookmarkProps) {
  const reducedMotion = useMotionPreference();

  return (
    <motion.div
      animate={reducedMotion ? undefined : { y: [0, -3, 0] }}
      className={cn(
        "relative rounded-b-control bg-primary px-4 py-3 text-primary-foreground shadow-glow",
        "after:absolute after:bottom-[-0.65rem] after:left-1/2 after:h-0 after:w-0 after:-translate-x-1/2 after:border-x-[0.7rem] after:border-t-[0.7rem] after:border-x-transparent after:border-t-primary",
        className
      )}
      data-render-source="asset_manifest"
      data-visual-element="bookmark"
      onMouseEnter={() => audioEvents.publish("BookmarkSaved")}
      transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY }}
    >
      <p className="text-sm font-semibold">{label}</p>
      {sublabel ? <p className="mt-1 text-xs opacity-90">{sublabel}</p> : null}
    </motion.div>
  );
}
