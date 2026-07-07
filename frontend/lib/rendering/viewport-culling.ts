import type { RenderBounds, ViewportBounds } from "@/lib/rendering/rendering-types";

/** Returns whether a 2D renderable overlaps the current viewport plus margin. */
export function isInViewport(bounds: RenderBounds, viewport: ViewportBounds, margin = 0): boolean {
  return (
    bounds.x + bounds.width >= -margin &&
    bounds.x <= viewport.width + margin &&
    bounds.y + bounds.height >= -margin &&
    bounds.y <= viewport.height + margin
  );
}
