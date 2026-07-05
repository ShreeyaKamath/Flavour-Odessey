import { Card } from "@/components/ui/card";
import { ScreenShell } from "@/features/screens/screen-shell";

/** Renders the inventory foundation screen. */
export function InventoryScreen() {
  return (
    <ScreenShell
      description="A placeholder surface for future item and ingredient views. No inventory data or persistence is implemented in Phase 3."
      eyebrow="Inventory"
      title="Inventory foundation"
    >
      <Card>
        <p className="text-sm text-muted-foreground">
          Inventory content will arrive after database and gameplay phases.
        </p>
      </Card>
    </ScreenShell>
  );
}
