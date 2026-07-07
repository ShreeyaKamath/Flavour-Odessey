import { EnchantedCookbook } from "@/components/storybook/enchanted-cookbook";
import { PageTurnTransition } from "@/components/storybook/page-turn-transition";
import { StorybookShell } from "@/components/storybook/storybook-shell";

/** Renders the recipe book foundation screen. */
export function RecipeBookScreen() {
  return (
    <StorybookShell
      description="Recipes are framed as an enchanted cookbook with tabs for ingredients, lore, emotion, and journal memories."
      eyebrow="Recipe book"
      title="Enchanted cookbook"
    >
      <PageTurnTransition>
        <EnchantedCookbook>
          <div className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Golden Vanilla Bloom remains the canonical first Heart Flavor, bound to Vanilla Orchid
              and Honey Bloom.
            </p>
            <p className="rounded-control border border-border bg-surface/70 p-3 font-semibold text-foreground">
              Completion badge: Joy restoration
            </p>
          </div>
        </EnchantedCookbook>
      </PageTurnTransition>
    </StorybookShell>
  );
}
