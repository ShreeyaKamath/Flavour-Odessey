type WebGLFallbackProps = {
  label?: string;
};

/** Renders a readable fallback when canvas or WebGL rendering is unavailable. */
export function WebGLFallback({ label = "The enchanted scene is resting." }: WebGLFallbackProps) {
  return (
    <div
      className="flex h-full min-h-64 w-full items-center justify-center bg-accent/15 p-6 text-center"
      role="img"
      aria-label="Fallback illustration for a magical meadow scene"
    >
      <div>
        <p className="font-display text-2xl font-semibold text-foreground">{label}</p>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Your browser skipped the canvas renderer, so Flavor Odyssey is showing the readable
          fallback view.
        </p>
      </div>
    </div>
  );
}
