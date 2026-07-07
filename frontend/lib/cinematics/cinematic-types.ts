export type CinematicId =
  | "opening"
  | "joy_meadow_arrival"
  | "lumi_first_meeting"
  | "npc_first_introduction"
  | "crafting"
  | "recipe_reveal"
  | "quest_completion"
  | "joy_restoration"
  | "journal_memory_reveal"
  | "day_transition";

export type CinematicActor = "lumi" | "meadow_keeper" | "npc_group" | "player";

export type CinematicEmotion =
  "celebrating" | "curious" | "gentle" | "happy" | "hopeful" | "proud" | "thoughtful";

export type CinematicEffectKind =
  | "bloom"
  | "butterflies"
  | "fade"
  | "floating_leaves"
  | "light_shafts"
  | "magical_glow"
  | "screen_shake"
  | "sparkles"
  | "vignette";

export type CameraRailName =
  | "storybook_cover"
  | "meadow_arrival"
  | "lumi_orbit"
  | "npc_intro"
  | "crafting_focus"
  | "recipe_reveal"
  | "restoration_rise"
  | "journal_page"
  | "day_sky";

export type CinematicCameraKeyframe = {
  at: number;
  depth: number;
  fade: number;
  focus: string;
  orbit: number;
  rail: CameraRailName;
  zoom: number;
};

export type CinematicNarrationCue = {
  at: number;
  duration: number;
  emotion: CinematicEmotion;
  portrait: "lumi" | "meadow_keeper" | "storybook";
  speaker: string;
  text: string;
};

export type CinematicParticipantCue = {
  action:
    | "celebrate"
    | "clap"
    | "entrance"
    | "fly"
    | "gather"
    | "guide"
    | "idle"
    | "look"
    | "point"
    | "wave";
  actor: CinematicActor;
  at: number;
  duration: number;
  emotion: CinematicEmotion;
};

export type CinematicEffectCue = {
  at: number;
  bloomLayer?: boolean;
  duration: number;
  intensity: number;
  kind: CinematicEffectKind;
  reducedMotionSafe: boolean;
};

export type CinematicChapter = {
  at: number;
  title: string;
};

export type CinematicDefinition = {
  camera: CinematicCameraKeyframe[];
  chapters: CinematicChapter[];
  description: string;
  duration: number;
  effects: CinematicEffectCue[];
  id: CinematicId;
  narration: CinematicNarrationCue[];
  participants: CinematicParticipantCue[];
  title: string;
};

export type CinematicFrame = {
  camera: CinematicCameraKeyframe;
  chapter: CinematicChapter;
  effects: CinematicEffectCue[];
  narration?: CinematicNarrationCue;
  participants: CinematicParticipantCue[];
  progress: number;
  subtitle: string;
  time: number;
};
