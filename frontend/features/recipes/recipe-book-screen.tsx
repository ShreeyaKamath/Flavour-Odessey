import { Card } from "@/components/ui/card";
import { ScreenShell } from "@/features/screens/screen-shell";

/** Renders the recipe book foundation screen. */
export function RecipeBookScreen() {
  return (
    <ScreenShell
      description="A route shell for the future recipe book. It does not craft, validate ingredients, or call recipe services."
      eyebrow="Recipe book"
      title="Recipe foundation"
    >
      <Card>
        <p className="text-sm text-muted-foreground">
          Crafting flows are intentionally reserved for a later phase.
        </p>
      </Card>
    </ScreenShell>
  );
}
