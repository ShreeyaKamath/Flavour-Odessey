import { motionTokens } from "@/lib/design-tokens";
import type { CinematicCameraKeyframe } from "@/lib/cinematics/cinematic-types";

export function interpolateNumber(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

export function resolveCameraKeyframe(
  keyframes: CinematicCameraKeyframe[],
  time: number,
  reducedMotion: boolean
): CinematicCameraKeyframe {
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1] ?? first;
  if (reducedMotion || keyframes.length === 1 || time <= first.at) {
    return {
      ...first,
      fade: reducedMotion ? 0 : first.fade,
      orbit: reducedMotion ? 0 : first.orbit
    };
  }
  if (time >= last.at) {
    return last;
  }

  const nextIndex = keyframes.findIndex((keyframe) => keyframe.at >= time);
  const next = keyframes[nextIndex];
  const previous = keyframes[Math.max(0, nextIndex - 1)];
  const span = Math.max(next.at - previous.at, motionTokens.duration.hover);
  const progress = Math.min(Math.max((time - previous.at) / span, 0), 1);

  return {
    at: time,
    depth: interpolateNumber(previous.depth, next.depth, progress),
    fade: interpolateNumber(previous.fade, next.fade, progress),
    focus: progress < 0.5 ? previous.focus : next.focus,
    orbit: interpolateNumber(previous.orbit, next.orbit, progress),
    rail: progress < 0.5 ? previous.rail : next.rail,
    zoom: interpolateNumber(previous.zoom, next.zoom, progress)
  };
}
