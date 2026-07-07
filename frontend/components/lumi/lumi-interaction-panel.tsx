"use client";

import type { components } from "@flavor/contracts/api";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LumiMemory } from "@/lib/lumi/lumi-memory-bridge";
import type { LumiState } from "@/lib/lumi/lumi-types";

type LumiInteractionPanelProps = {
  aiError?: Error | null;
  aiPending: boolean;
  aiResponse?: components["schemas"]["AICompanionRespondResponse"];
  hint: string;
  memories: LumiMemory[];
  memorySummary: string;
  onAskHint: () => void;
  state: LumiState;
};

/** Displays Lumi's contextual hint controls, AI fallback status, and recent companion memory. */
export function LumiInteractionPanel({
  aiError,
  aiPending,
  aiResponse,
  hint,
  memories,
  memorySummary,
  onAskHint,
  state
}: LumiInteractionPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Lumi&apos;s companion panel</p>
          <p className="mt-1 text-sm capitalize text-muted-foreground">
            Emotion: {state.emotion} - Mode: {state.mode}
          </p>
        </div>
        <Button disabled={aiPending} onClick={onAskHint} variant="secondary">
          {aiPending ? "Lumi is listening..." : "Ask Lumi for a hint"}
        </Button>
      </div>
      <div className="mt-4 border-l-2 border-accent pl-3" aria-live="polite">
        <p className="leading-7 text-muted-foreground">{aiResponse?.response ?? hint}</p>
        {aiResponse?.fallback_used ? (
          <p className="mt-1 text-xs text-muted-foreground">Deterministic fallback</p>
        ) : null}
        {aiError ? (
          <p className="mt-2 text-sm text-danger" role="alert">
            {aiError.message} Lumi keeps her local hint ready.
          </p>
        ) : null}
      </div>
      <details className="mt-4 rounded-panel border border-border p-3">
        <summary className="cursor-pointer text-sm font-semibold text-foreground">
          Lumi memory bridge
        </summary>
        <p className="mt-2 text-sm text-muted-foreground">
          {memorySummary || "Lumi is waiting for the first shared moment."}
        </p>
        <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
          {memories.slice(-4).map((memory) => (
            <li key={`${memory.event}-${memory.occurredAt}`}>
              {memory.event.replace("_", " ")}: {memory.message}
            </li>
          ))}
        </ul>
      </details>
    </Card>
  );
}
