import { resolveCameraKeyframe } from "@/lib/cinematics/camera-rails";
import { cinematicScenes } from "@/lib/cinematics/cinematic-scenes";
import type {
  CinematicDefinition,
  CinematicFrame,
  CinematicId,
  CinematicNarrationCue
} from "@/lib/cinematics/cinematic-types";

function isActiveCue(cue: { at: number; duration: number }, time: number): boolean {
  return time >= cue.at && time <= cue.at + cue.duration;
}

/** Resolves data-driven cinematic state for camera, narration, effects, and actors. */
export class CinematicDirector {
  readonly scenes = cinematicScenes;

  all(): CinematicDefinition[] {
    return Object.values(this.scenes);
  }

  duration(sceneId: CinematicId): number {
    return this.scene(sceneId).duration;
  }

  frame(sceneId: CinematicId, time: number, reducedMotion = false): CinematicFrame {
    const scene = this.scene(sceneId);
    const boundedTime = Math.min(Math.max(time, 0), scene.duration);
    const narration = scene.narration.find((cue) => isActiveCue(cue, boundedTime));

    return {
      camera: resolveCameraKeyframe(scene.camera, boundedTime, reducedMotion),
      chapter:
        [...scene.chapters].reverse().find((chapter) => chapter.at <= boundedTime) ??
        scene.chapters[0],
      effects: scene.effects.filter((effect) =>
        reducedMotion
          ? effect.reducedMotionSafe && isActiveCue(effect, boundedTime)
          : isActiveCue(effect, boundedTime)
      ),
      narration,
      participants: scene.participants.filter((participant) =>
        isActiveCue(participant, boundedTime)
      ),
      progress: scene.duration === 0 ? 1 : boundedTime / scene.duration,
      subtitle: narration ? this.subtitle(narration, boundedTime, reducedMotion) : "",
      time: boundedTime
    };
  }

  scene(sceneId: CinematicId): CinematicDefinition {
    return this.scenes[sceneId];
  }

  skip(sceneId: CinematicId): CinematicFrame {
    return this.frame(sceneId, this.duration(sceneId), true);
  }

  subtitle(cue: CinematicNarrationCue, time: number, reducedMotion = false): string {
    if (reducedMotion) {
      return cue.text;
    }
    const progress = Math.min(Math.max((time - cue.at) / Math.max(cue.duration, 0.1), 0), 1);
    const length = Math.max(1, Math.ceil(cue.text.length * progress));
    return cue.text.slice(0, length);
  }
}

export const cinematicDirector = new CinematicDirector();
