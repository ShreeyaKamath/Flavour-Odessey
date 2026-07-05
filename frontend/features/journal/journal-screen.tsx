import { Card } from "@/components/ui/card";
import { ScreenShell } from "@/features/screens/screen-shell";

export function JournalScreen() {
  return (
    <ScreenShell
      description="A placeholder for the future Journal of Memories. It includes layout structure only."
      eyebrow="Journal"
      title="Journal foundation"
    >
      <Card>
        <p className="text-sm text-muted-foreground">
          Memory entries are future work and are not mocked here.
        </p>
      </Card>
    </ScreenShell>
  );
}
