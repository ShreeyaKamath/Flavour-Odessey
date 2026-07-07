"use client";

import { useState } from "react";

import { CinematicOverlay } from "@/components/cinematics/cinematic-overlay";
import { Button } from "@/components/ui/button";
import { cinematicDirector, type CinematicId } from "@/lib/cinematics";

type CinematicMomentProps = {
  label?: string;
  sceneId: CinematicId;
};

/** Provides a keyboard-accessible trigger for a reusable cinematic moment. */
export function CinematicMoment({ label, sceneId }: CinematicMomentProps) {
  const [open, setOpen] = useState(false);
  const scene = cinematicDirector.scene(sceneId);

  return (
    <>
      <Button
        aria-label={`Play ${scene.title}`}
        className="min-h-9 px-3 py-1"
        onClick={() => setOpen(true)}
        variant="ghost"
      >
        {label ?? scene.title}
      </Button>
      <CinematicOverlay onClose={() => setOpen(false)} open={open} sceneId={sceneId} />
    </>
  );
}
