import { MagicalSatchel } from "@/components/storybook/magical-satchel";
import { StorybookShell } from "@/components/storybook/storybook-shell";

/** Renders the inventory foundation screen. */
export function InventoryScreen() {
  return (
    <StorybookShell
      description="Ingredients now sit inside a stitched magical satchel surface with space for future collected treasures."
      eyebrow="Inventory"
      title="Magical satchel"
    >
      <MagicalSatchel>
        <div className="grid gap-3 sm:grid-cols-2">
          {["Vanilla Orchid", "Honey Bloom", "Golden Vanilla Bloom", "Memory Page"].map((item) => (
            <div className="rounded-control border border-border bg-surface/70 p-3" key={item}>
              <p className="font-semibold text-foreground">{item}</p>
              <p className="mt-1 text-sm text-muted-foreground">Pocket prepared for adventure.</p>
            </div>
          ))}
        </div>
      </MagicalSatchel>
    </StorybookShell>
  );
}
