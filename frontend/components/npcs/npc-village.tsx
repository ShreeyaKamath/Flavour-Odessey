"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { NpcState } from "@/features/npcs/use-npcs";
import { ambientFloat, interactionMotion, panelReveal } from "@/lib/animation/motion-tokens";
import { audioEvents } from "@/lib/audio/audio-events";
import { cn } from "@/utils/cn";
import { ConversationController, type NpcChatResponse } from "@/lib/npcs/conversation-controller";
import { EmotionController } from "@/lib/npcs/emotion-controller";
import { FriendshipSystem } from "@/lib/npcs/friendship-system";
import { NPCAnimationController } from "@/lib/npcs/npc-animation-controller";
import { NPCManager } from "@/lib/npcs/npc-manager";
import { PortraitRenderer } from "@/lib/npcs/portrait-renderer";
import { RelationshipManager } from "@/lib/npcs/relationship-manager";
import { ScheduleManager } from "@/lib/npcs/schedule-manager";
import { SpeechBubbleSystem } from "@/lib/npcs/speech-bubble-system";
import { ThoughtBubbleSystem } from "@/lib/npcs/thought-bubble-system";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";
import { useMotionPreference } from "@/hooks/use-motion-preference";

type NpcVillageProps = {
  chatError?: Error | null;
  chatPending: boolean;
  chatResponse?: NpcChatResponse;
  giftPending: boolean;
  giftReaction?: string;
  npcs: NpcState[];
  onGift: (npcId: NpcState["npc_id"]) => void;
  onSendMessage: (npcId: NpcState["npc_id"], message: string) => void;
  world?: LivingWorldSnapshot;
};

/** Renders the living Joy Meadow NPC ecosystem and storybook conversation UI. */
export function NpcVillage({
  chatError,
  chatPending,
  chatResponse,
  giftPending,
  giftReaction,
  npcs,
  onGift,
  onSendMessage,
  world
}: NpcVillageProps) {
  const manager = useMemo(() => new NPCManager(npcs), [npcs]);
  const orderedNpcs = manager.ordered();
  const [selectedNpcId, setSelectedNpcId] = useState<NpcState["npc_id"]>(
    orderedNpcs[0]?.npc_id ?? "joy_meadow_keeper"
  );
  const selectedNpc = manager.byId(selectedNpcId);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!orderedNpcs.some((npc) => npc.npc_id === selectedNpcId) && orderedNpcs[0]) {
      setSelectedNpcId(orderedNpcs[0].npc_id);
    }
  }, [orderedNpcs, selectedNpcId]);

  function selectNpc(npc: NpcState) {
    setSelectedNpcId(npc.npc_id);
    audioEvents.publish("ConversationOpened");
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!selectedNpc || !trimmed) {
      return;
    }
    onSendMessage(selectedNpc.npc_id, trimmed);
    audioEvents.publish("NPCGreeting");
    setMessage("");
  }

  if (!selectedNpc) {
    return null;
  }

  return (
    <section aria-labelledby="npc-village-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Living village
          </p>
          <h2
            className="mt-2 font-display text-2xl font-semibold text-foreground"
            id="npc-village-title"
          >
            Meadow voices
          </h2>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
        <div className="grid gap-3 sm:grid-cols-2">
          {orderedNpcs.map((npc) => (
            <NpcCard
              key={npc.npc_id}
              npc={npc}
              onSelect={() => selectNpc(npc)}
              selected={npc.npc_id === selectedNpc.npc_id}
              world={world}
            />
          ))}
        </div>

        <Card className="overflow-hidden">
          <ConversationPanel
            chatError={chatError}
            chatPending={chatPending}
            chatResponse={chatResponse?.npc_id === selectedNpc.npc_id ? chatResponse : undefined}
            giftPending={giftPending}
            giftReaction={giftReaction}
            message={message}
            npc={selectedNpc}
            onClose={() => audioEvents.publish("ConversationClosed")}
            onGift={() => onGift(selectedNpc.npc_id)}
            onMessageChange={setMessage}
            onSubmit={submitMessage}
            world={world}
          />
        </Card>
      </div>
    </section>
  );
}

function NpcCard({
  npc,
  onSelect,
  selected,
  world
}: {
  npc: NpcState;
  onSelect: () => void;
  selected: boolean;
  world?: LivingWorldSnapshot;
}) {
  const portrait = new PortraitRenderer(npc);
  const relationship = new RelationshipManager(npc);
  const emotion = new EmotionController(npc);
  const schedule = new ScheduleManager(npc);
  const animation = new NPCAnimationController(npc);
  const portraitAsset = portrait.resolvePortrait();
  const [failedAssetUrls, setFailedAssetUrls] = useState<Set<string>>(() => new Set());
  const showPortraitAsset = Boolean(portraitAsset && !failedAssetUrls.has(portraitAsset.url));

  function markAssetFailed(url: string) {
    setFailedAssetUrls((current) => new Set(current).add(url));
  }

  return (
    <motion.button
      aria-pressed={selected}
      className={cn(
        "rounded-panel border border-border bg-surface p-4 text-left shadow-panel transition-colors",
        selected ? "border-accent" : "hover:border-accent/70"
      )}
      data-render-source="asset_manifest"
      data-visual-element="meadow_keeper"
      onClick={onSelect}
      onMouseEnter={() => audioEvents.publish("NPCWaved")}
      type="button"
      variants={interactionMotion}
      whileHover="hover"
      whileTap="tap"
    >
      <div className="flex gap-4">
        <div
          aria-label={portrait.label()}
          className={cn(
            "grid h-16 w-16 shrink-0 place-items-center rounded-full border border-border bg-muted font-display text-lg font-semibold text-foreground shadow-glow",
            animation.stateClass()
          )}
          data-asset-id={portrait.portraitAssetId()}
          data-render-source="asset_manifest"
          data-visual-element={portrait.portraitAssetId()}
          role="img"
        >
          {showPortraitAsset && portraitAsset ? (
            <span aria-hidden="true" className="relative h-14 w-14 overflow-hidden rounded-full">
              <Image
                alt=""
                fill
                onError={() => markAssetFailed(portraitAsset.url)}
                sizes="3.5rem"
                src={portraitAsset.url}
                unoptimized
              />
            </span>
          ) : (
            <span className="flex flex-col items-center leading-none" aria-hidden="true">
              <span className="text-base">{portrait.fallbackGlyph()}</span>
              <span className="mt-1 text-xs">{portrait.initials()}</span>
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{npc.name}</p>
          <p className="text-sm text-muted-foreground">{npc.occupation}</p>
          <p className={cn("mt-2 text-xs font-semibold capitalize", emotion.toneClass())}>
            {npc.emotion_icon} · {npc.current_mood}
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p>{schedule.activeStep().activity}</p>
        {world ? <p>Weather routine: {world.npcRoutine}</p> : null}
        <p>{schedule.movementLabel()}</p>
        <p>{relationship.headline()}</p>
      </div>
      <Meter label="Friendship" value={relationship.friendshipPercent()} />
    </motion.button>
  );
}

function ConversationPanel({
  chatError,
  chatPending,
  chatResponse,
  giftPending,
  giftReaction,
  message,
  npc,
  onClose,
  onGift,
  onMessageChange,
  onSubmit,
  world
}: {
  chatError?: Error | null;
  chatPending: boolean;
  chatResponse?: NpcChatResponse;
  giftPending: boolean;
  giftReaction?: string;
  message: string;
  npc: NpcState;
  onClose: () => void;
  onGift: () => void;
  onMessageChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  world?: LivingWorldSnapshot;
}) {
  const reducedMotion = useMotionPreference();
  const conversation = new ConversationController(npc, chatResponse);
  const emotion = new EmotionController(npc);
  const friendship = new FriendshipSystem(npc);
  const relationship = new RelationshipManager(npc);
  const speech = new SpeechBubbleSystem(conversation.activeText(), chatResponse);
  const thought = new ThoughtBubbleSystem(npc);
  const speechText = speech.text();
  const typingDelay = emotion.typingDelayMs();
  const [typedText, setTypedText] = useState(speechText);

  useEffect(() => {
    if (reducedMotion) {
      setTypedText(speechText);
      return;
    }
    setTypedText("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedText(speechText.slice(0, index));
      if (index >= speechText.length) {
        window.clearInterval(timer);
      }
    }, typingDelay);
    return () => window.clearInterval(timer);
  }, [reducedMotion, speechText, typingDelay]);

  const memories = conversation.memoryReferences();
  const history = conversation.history().slice(-6);

  return (
    <motion.div animate="visible" initial="hidden" variants={panelReveal}>
      <div className="border-b border-border bg-muted/60 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Storybook dialogue
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">{npc.name}</h3>
            <p className="text-sm text-muted-foreground">
              {npc.voice_style} · {npc.age_group}
            </p>
          </div>
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <motion.div
          animate={reducedMotion ? "resting" : "floating"}
          className="rounded-panel border border-border bg-surface-raised p-4"
          variants={ambientFloat}
        >
          <p className={cn("text-xs font-semibold uppercase", emotion.toneClass())}>
            {npc.current_mood} · {npc.animation_state}
          </p>
          <p className="mt-3 min-h-20 leading-7 text-foreground" aria-live="polite">
            {chatPending ? "Listening..." : typedText}
          </p>
          {speech.usedFallback() ? (
            <p className="mt-2 text-xs text-muted-foreground">Deterministic fallback</p>
          ) : null}
          {chatError ? (
            <p className="mt-2 text-sm text-danger" role="alert">
              {chatError.message} The villager keeps their familiar words.
            </p>
          ) : null}
        </motion.div>

        <div className="rounded-panel border border-border bg-background/60 p-4">
          <p className="text-sm font-semibold text-foreground">Thought bubble</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{thought.text()}</p>
          {world ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Weather: {world.conditionLabel}, {world.timeLabel}, {world.seasonLabel}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">Lumi nearby: {npc.lumi_reaction}</p>
        </div>

        <form onSubmit={onSubmit}>
          <label className="text-sm font-semibold text-foreground" htmlFor="npc-story-message">
            Speak with {npc.name}
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              className="min-h-11 flex-1 rounded-control border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-accent"
              id="npc-story-message"
              maxLength={500}
              onChange={(event) => onMessageChange(event.target.value)}
              placeholder="Ask about Joy Meadow"
              value={message}
            />
            <Button disabled={!message.trim() || chatPending} type="submit">
              {chatPending ? "Listening..." : "Ask"}
            </Button>
          </div>
        </form>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-foreground">Relationship card</p>
            <p className="mt-1 text-sm text-muted-foreground">{relationship.headline()}</p>
            <Meter label="Friendship" value={relationship.friendshipPercent()} />
            <Meter label="Trust" value={relationship.trustPercent()} />
            <p className="mt-2 text-xs text-muted-foreground">
              Milestone: {friendship.milestoneLabel()}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Gift</p>
            <Button
              className="mt-2"
              disabled={giftPending}
              onClick={onGift}
              type="button"
              variant="secondary"
            >
              {giftPending ? "Offering..." : `Offer ${npc.favorite_flower}`}
            </Button>
            {giftReaction ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{giftReaction}</p>
            ) : null}
          </div>
        </div>

        <details className="rounded-panel border border-border p-4">
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Conversation history
          </summary>
          {history.length ? (
            <div className="mt-3 max-h-48 space-y-3 overflow-auto pr-2">
              {history.map((turn, index) => (
                <p
                  className="text-sm leading-6 text-muted-foreground"
                  key={`${turn.occurred_at}-${index}`}
                >
                  <span className="font-semibold capitalize text-foreground">{turn.speaker}:</span>{" "}
                  {turn.text}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No conversations yet.</p>
          )}
        </details>

        <div>
          <p className="text-sm font-semibold text-foreground">Memory highlights</p>
          {memories.length ? (
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {memories.map((memory) => (
                <li key={memory}>{memory}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">No memory highlights yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
