import { CinematicCheckpoint } from "@/components/cinematics/cinematic-checkpoint";
import { CinematicMoment } from "@/components/cinematics/cinematic-moment";
import { MagicalPage } from "@/components/storybook/magical-page";
import { PageTurnTransition } from "@/components/storybook/page-turn-transition";
import { StorybookShell } from "@/components/storybook/storybook-shell";

/** Renders the journal foundation screen. */
export function JournalScreen() {
  return (
    <StorybookShell
      description="The Journal of Memories now opens as a storybook spread for restored emotions, recipes, and remembered friends."
      eyebrow="Journal"
      title="Journal of Memories"
    >
      <PageTurnTransition>
        <MagicalPage eyebrow="Animated storybook" title="The Day Joy Returned">
          <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-panel border border-border bg-accent/10 p-4 text-center">
              <div
                aria-hidden="true"
                className="mx-auto h-28 w-28 rounded-full bg-accent/20 shadow-glow"
              />
              <p className="mt-3 text-sm font-semibold text-accent">Recovered emotion: Joy</p>
            </div>
            <p className="leading-7 text-muted-foreground">
              This page waits for the restored memory from Joy Meadow, ready to hold recipe lore,
              NPC story notes, and the first golden illustration.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <CinematicMoment label="Reveal memory" sceneId="journal_memory_reveal" />
            <CinematicMoment label="Turn the sky" sceneId="day_transition" />
          </div>
          <div className="mt-5">
            <CinematicCheckpoint label="Memory page marked" sceneId="journal_memory_reveal" />
          </div>
        </MagicalPage>
      </PageTurnTransition>
    </StorybookShell>
  );
}
