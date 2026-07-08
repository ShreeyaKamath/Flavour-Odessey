export const renderBudgets = {
  cinematicIntervalMs: 80,
  idlePreloadDelayMs: 350,
  maxVisibleParticles: 260,
  routeLoadAnnounceDelayMs: 120,
  targetFrameMs: 16.7
} as const;

export type AnimationWorkState = {
  reducedMotion: boolean;
  visible: boolean;
};

/** Centralizes whether optional animation work should run this frame. */
export function shouldRunOptionalAnimation({
  reducedMotion,
  visible
}: AnimationWorkState): boolean {
  return visible && !reducedMotion;
}

/** Caps particle counts for production stability while preserving visual density. */
export function capParticleCount(count: number, max = renderBudgets.maxVisibleParticles): number {
  return Math.max(0, Math.min(count, max));
}
