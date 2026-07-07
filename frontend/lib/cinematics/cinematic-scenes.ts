import type { CinematicDefinition } from "@/lib/cinematics/cinematic-types";

const sharedEffects = {
  gentleGlow: {
    at: 0.2,
    bloomLayer: true,
    duration: 4.2,
    intensity: 0.58,
    kind: "magical_glow",
    reducedMotionSafe: true
  },
  pageFade: {
    at: 0,
    duration: 1.1,
    intensity: 0.48,
    kind: "fade",
    reducedMotionSafe: true
  },
  safeVignette: {
    at: 0,
    duration: 5,
    intensity: 0.35,
    kind: "vignette",
    reducedMotionSafe: true
  }
} as const;

export const cinematicScenes: Record<CinematicDefinition["id"], CinematicDefinition> = {
  crafting: {
    camera: [
      {
        at: 0,
        depth: 0.34,
        fade: 0.12,
        focus: "satchel",
        orbit: 0,
        rail: "crafting_focus",
        zoom: 1
      },
      {
        at: 1.7,
        depth: 0.62,
        fade: 0,
        focus: "magic_circle",
        orbit: 14,
        rail: "crafting_focus",
        zoom: 1.16
      },
      { at: 3.8, depth: 0.72, fade: 0.08, focus: "lumi", orbit: -8, rail: "lumi_orbit", zoom: 1.08 }
    ],
    chapters: [{ at: 0, title: "The Circle Wakes" }],
    description: "Ingredients rise, Lumi circles close, and the recipe gathers a golden pulse.",
    duration: 5.4,
    effects: [
      sharedEffects.gentleGlow,
      {
        at: 1.1,
        bloomLayer: true,
        duration: 3.4,
        intensity: 0.78,
        kind: "sparkles",
        reducedMotionSafe: true
      },
      { at: 2.2, duration: 2, intensity: 0.32, kind: "screen_shake", reducedMotionSafe: false }
    ],
    id: "crafting",
    narration: [
      {
        at: 0.4,
        duration: 2.2,
        emotion: "curious",
        portrait: "lumi",
        speaker: "Lumi",
        text: "Hold steady. The meadow listens when ingredients rise together."
      },
      {
        at: 2.7,
        duration: 2,
        emotion: "hopeful",
        portrait: "storybook",
        speaker: "Narrator",
        text: "A ring of warm light turns the first memory into flavor."
      }
    ],
    participants: [
      { action: "fly", actor: "lumi", at: 0.8, duration: 3.4, emotion: "curious" },
      { action: "look", actor: "player", at: 0.4, duration: 4.2, emotion: "hopeful" }
    ],
    title: "Crafting Cinematic"
  },
  day_transition: {
    camera: [
      { at: 0, depth: 0.2, fade: 0.18, focus: "horizon", orbit: 0, rail: "day_sky", zoom: 1 },
      {
        at: 2.2,
        depth: 0.55,
        fade: 0,
        focus: "sky_gradient",
        orbit: 10,
        rail: "day_sky",
        zoom: 1.08
      }
    ],
    chapters: [{ at: 0, title: "A Page of Sky" }],
    description: "Morning, afternoon, golden hour, and night drift as storybook pages of light.",
    duration: 4.8,
    effects: [
      sharedEffects.pageFade,
      {
        at: 1,
        bloomLayer: true,
        duration: 2.8,
        intensity: 0.5,
        kind: "light_shafts",
        reducedMotionSafe: true
      },
      { at: 2.8, duration: 1.6, intensity: 0.34, kind: "floating_leaves", reducedMotionSafe: false }
    ],
    id: "day_transition",
    narration: [
      {
        at: 0.5,
        duration: 3.2,
        emotion: "gentle",
        portrait: "storybook",
        speaker: "Narrator",
        text: "The day turns softly, and Joy Meadow changes color without losing its song."
      }
    ],
    participants: [{ action: "guide", actor: "lumi", at: 1.1, duration: 2.8, emotion: "happy" }],
    title: "Day Transition Cinematic"
  },
  journal_memory_reveal: {
    camera: [
      {
        at: 0,
        depth: 0.28,
        fade: 0.1,
        focus: "closed_journal",
        orbit: -4,
        rail: "journal_page",
        zoom: 1
      },
      {
        at: 1.4,
        depth: 0.72,
        fade: 0,
        focus: "memory_illustration",
        orbit: 0,
        rail: "journal_page",
        zoom: 1.18
      },
      {
        at: 3.6,
        depth: 0.55,
        fade: 0.08,
        focus: "bookmark",
        orbit: 4,
        rail: "journal_page",
        zoom: 1.04
      }
    ],
    chapters: [{ at: 0, title: "The Day Joy Returned" }],
    description: "A recovered memory opens as a warm storybook spread.",
    duration: 5.2,
    effects: [
      sharedEffects.pageFade,
      { at: 1, duration: 3.2, intensity: 0.62, kind: "sparkles", reducedMotionSafe: true },
      {
        at: 2.4,
        bloomLayer: true,
        duration: 2,
        intensity: 0.44,
        kind: "magical_glow",
        reducedMotionSafe: true
      }
    ],
    id: "journal_memory_reveal",
    narration: [
      {
        at: 0.6,
        duration: 3.6,
        emotion: "thoughtful",
        portrait: "storybook",
        speaker: "Journal",
        text: "Some memories do not return as words first. They return as warmth."
      }
    ],
    participants: [{ action: "point", actor: "lumi", at: 1.2, duration: 2.6, emotion: "proud" }],
    title: "Journal Memory Reveal"
  },
  joy_meadow_arrival: {
    camera: [
      {
        at: 0,
        depth: 0.25,
        fade: 0.42,
        focus: "storybook_map",
        orbit: -12,
        rail: "meadow_arrival",
        zoom: 0.96
      },
      {
        at: 1.5,
        depth: 0.68,
        fade: 0,
        focus: "vanilla_windmill",
        orbit: 8,
        rail: "meadow_arrival",
        zoom: 1.12
      },
      {
        at: 3.8,
        depth: 0.5,
        fade: 0.08,
        focus: "meadow_path",
        orbit: 0,
        rail: "meadow_arrival",
        zoom: 1.04
      }
    ],
    chapters: [{ at: 0, title: "First Arrival" }],
    description: "The camera glides from a page map into Joy Meadow.",
    duration: 5.6,
    effects: [
      sharedEffects.pageFade,
      { at: 1, duration: 3.5, intensity: 0.46, kind: "butterflies", reducedMotionSafe: false },
      {
        at: 1.4,
        bloomLayer: true,
        duration: 3.2,
        intensity: 0.44,
        kind: "light_shafts",
        reducedMotionSafe: true
      }
    ],
    id: "joy_meadow_arrival",
    narration: [
      {
        at: 0.5,
        duration: 3.6,
        emotion: "hopeful",
        portrait: "storybook",
        speaker: "Narrator",
        text: "The first island opens like a breath, bright but waiting."
      }
    ],
    participants: [{ action: "look", actor: "player", at: 1, duration: 3.4, emotion: "curious" }],
    title: "First Arrival at Joy Meadow"
  },
  joy_restoration: {
    camera: [
      {
        at: 0,
        depth: 0.48,
        fade: 0.1,
        focus: "recipe_shrine",
        orbit: -8,
        rail: "restoration_rise",
        zoom: 1
      },
      {
        at: 1.8,
        depth: 0.78,
        fade: 0,
        focus: "heart_flavor",
        orbit: 18,
        rail: "restoration_rise",
        zoom: 1.22
      },
      {
        at: 4.6,
        depth: 0.62,
        fade: 0.14,
        focus: "restored_meadow",
        orbit: 0,
        rail: "meadow_arrival",
        zoom: 1.02
      }
    ],
    chapters: [{ at: 0, title: "Joy Returns" }],
    description: "Golden light rolls across Joy Meadow as the first emotion returns.",
    duration: 6.4,
    effects: [
      {
        at: 0.4,
        bloomLayer: true,
        duration: 5.3,
        intensity: 0.9,
        kind: "bloom",
        reducedMotionSafe: true
      },
      { at: 1.2, duration: 4, intensity: 0.82, kind: "sparkles", reducedMotionSafe: true },
      { at: 2.2, duration: 2, intensity: 0.42, kind: "screen_shake", reducedMotionSafe: false },
      {
        at: 2.6,
        bloomLayer: true,
        duration: 2.8,
        intensity: 0.7,
        kind: "light_shafts",
        reducedMotionSafe: true
      }
    ],
    id: "joy_restoration",
    narration: [
      {
        at: 0.8,
        duration: 2.8,
        emotion: "hopeful",
        portrait: "storybook",
        speaker: "Narrator",
        text: "Joy does not crash back into the world. It blooms."
      },
      {
        at: 3.8,
        duration: 2,
        emotion: "celebrating",
        portrait: "lumi",
        speaker: "Lumi",
        text: "Look! The meadow remembers how to laugh."
      }
    ],
    participants: [
      { action: "celebrate", actor: "lumi", at: 2.8, duration: 3, emotion: "celebrating" },
      { action: "clap", actor: "npc_group", at: 3.2, duration: 2.5, emotion: "happy" }
    ],
    title: "Joy Restoration Cinematic"
  },
  lumi_first_meeting: {
    camera: [
      { at: 0, depth: 0.44, fade: 0.2, focus: "quiet_glow", orbit: 0, rail: "lumi_orbit", zoom: 1 },
      { at: 1.2, depth: 0.76, fade: 0, focus: "lumi", orbit: 16, rail: "lumi_orbit", zoom: 1.22 },
      {
        at: 3.2,
        depth: 0.5,
        fade: 0.06,
        focus: "player",
        orbit: -8,
        rail: "lumi_orbit",
        zoom: 1.06
      }
    ],
    chapters: [{ at: 0, title: "A Small Light" }],
    description: "Lumi enters as a small glow, then circles the player with curiosity.",
    duration: 5.1,
    effects: [
      sharedEffects.gentleGlow,
      { at: 1.1, duration: 3.1, intensity: 0.64, kind: "sparkles", reducedMotionSafe: true }
    ],
    id: "lumi_first_meeting",
    narration: [
      {
        at: 0.7,
        duration: 3.2,
        emotion: "curious",
        portrait: "lumi",
        speaker: "Lumi",
        text: "Oh! You can see me. That means the first flavor still has a chance."
      }
    ],
    participants: [
      { action: "entrance", actor: "lumi", at: 0.4, duration: 1.8, emotion: "curious" },
      { action: "fly", actor: "lumi", at: 2, duration: 2.5, emotion: "happy" }
    ],
    title: "First Meeting with Lumi"
  },
  npc_first_introduction: {
    camera: [
      {
        at: 0,
        depth: 0.38,
        fade: 0.12,
        focus: "village_path",
        orbit: -6,
        rail: "npc_intro",
        zoom: 1
      },
      {
        at: 1.2,
        depth: 0.72,
        fade: 0,
        focus: "meadow_keeper",
        orbit: 6,
        rail: "npc_intro",
        zoom: 1.14
      },
      {
        at: 3.4,
        depth: 0.5,
        fade: 0.06,
        focus: "lumi_and_npc",
        orbit: 0,
        rail: "npc_intro",
        zoom: 1.02
      }
    ],
    chapters: [{ at: 0, title: "A Meadow Voice" }],
    description: "The Meadow Keeper waves and the camera settles into a conversation frame.",
    duration: 5.2,
    effects: [
      sharedEffects.safeVignette,
      { at: 1, duration: 3, intensity: 0.38, kind: "floating_leaves", reducedMotionSafe: false }
    ],
    id: "npc_first_introduction",
    narration: [
      {
        at: 0.8,
        duration: 3.4,
        emotion: "gentle",
        portrait: "meadow_keeper",
        speaker: "Meadow Keeper",
        text: "Welcome, little keeper. The meadow has been waiting to remember your footsteps."
      }
    ],
    participants: [
      { action: "wave", actor: "meadow_keeper", at: 0.8, duration: 2.4, emotion: "happy" },
      { action: "look", actor: "lumi", at: 1.4, duration: 2.8, emotion: "curious" }
    ],
    title: "First NPC Introduction"
  },
  opening: {
    camera: [
      {
        at: 0,
        depth: 0.25,
        fade: 0.68,
        focus: "closed_storybook",
        orbit: -6,
        rail: "storybook_cover",
        zoom: 0.98
      },
      {
        at: 1.8,
        depth: 0.66,
        fade: 0,
        focus: "heart_flavor_page",
        orbit: 10,
        rail: "storybook_cover",
        zoom: 1.14
      },
      {
        at: 4.5,
        depth: 0.44,
        fade: 0.08,
        focus: "joy_meadow_map",
        orbit: 0,
        rail: "storybook_cover",
        zoom: 1.02
      }
    ],
    chapters: [{ at: 0, title: "The First Flavor" }],
    description: "The opening book turns toward Gelato Terra and the first missing Heart Flavor.",
    duration: 6.2,
    effects: [
      sharedEffects.pageFade,
      sharedEffects.safeVignette,
      { at: 1.2, duration: 3.8, intensity: 0.48, kind: "sparkles", reducedMotionSafe: true }
    ],
    id: "opening",
    narration: [
      {
        at: 0.8,
        duration: 3,
        emotion: "thoughtful",
        portrait: "storybook",
        speaker: "Narrator",
        text: "Long ago, memories became flavors, and flavors kept the world bright."
      },
      {
        at: 4,
        duration: 1.8,
        emotion: "hopeful",
        portrait: "storybook",
        speaker: "Narrator",
        text: "One page still glows. Joy Meadow is calling."
      }
    ],
    participants: [{ action: "guide", actor: "lumi", at: 3.6, duration: 2, emotion: "curious" }],
    title: "Opening Cinematic"
  },
  quest_completion: {
    camera: [
      {
        at: 0,
        depth: 0.4,
        fade: 0.08,
        focus: "quest_board",
        orbit: -4,
        rail: "journal_page",
        zoom: 1
      },
      {
        at: 1.2,
        depth: 0.64,
        fade: 0,
        focus: "meadow_keeper",
        orbit: 8,
        rail: "npc_intro",
        zoom: 1.12
      },
      {
        at: 3.2,
        depth: 0.5,
        fade: 0.1,
        focus: "bookmark",
        orbit: 0,
        rail: "journal_page",
        zoom: 1.02
      }
    ],
    chapters: [{ at: 0, title: "A Promise Kept" }],
    description: "The quest board warms, villagers clap, and a bookmark marks progress.",
    duration: 5,
    effects: [
      sharedEffects.gentleGlow,
      { at: 1.4, duration: 2.6, intensity: 0.54, kind: "sparkles", reducedMotionSafe: true }
    ],
    id: "quest_completion",
    narration: [
      {
        at: 0.8,
        duration: 3.2,
        emotion: "proud",
        portrait: "meadow_keeper",
        speaker: "Meadow Keeper",
        text: "A completed kindness is never small. It becomes a path for everyone else."
      }
    ],
    participants: [
      { action: "clap", actor: "npc_group", at: 1.2, duration: 2.6, emotion: "happy" },
      { action: "celebrate", actor: "lumi", at: 2.1, duration: 2.4, emotion: "celebrating" }
    ],
    title: "Quest Completion Cinematic"
  },
  recipe_reveal: {
    camera: [
      {
        at: 0,
        depth: 0.42,
        fade: 0.14,
        focus: "covered_recipe",
        orbit: -10,
        rail: "recipe_reveal",
        zoom: 1
      },
      {
        at: 1.5,
        depth: 0.78,
        fade: 0,
        focus: "golden_vanilla_bloom",
        orbit: 14,
        rail: "recipe_reveal",
        zoom: 1.24
      },
      {
        at: 3.7,
        depth: 0.58,
        fade: 0.06,
        focus: "recipe_card",
        orbit: 0,
        rail: "recipe_reveal",
        zoom: 1.08
      }
    ],
    chapters: [{ at: 0, title: "Golden Vanilla Bloom" }],
    description: "The finished recipe rotates into view as the page flips open.",
    duration: 5.4,
    effects: [
      {
        at: 0.8,
        bloomLayer: true,
        duration: 3.8,
        intensity: 0.84,
        kind: "magical_glow",
        reducedMotionSafe: true
      },
      { at: 1.2, duration: 3.4, intensity: 0.7, kind: "sparkles", reducedMotionSafe: true }
    ],
    id: "recipe_reveal",
    narration: [
      {
        at: 0.8,
        duration: 3.4,
        emotion: "happy",
        portrait: "lumi",
        speaker: "Lumi",
        text: "Golden Vanilla Bloom. It tastes like the first laugh after a long quiet."
      }
    ],
    participants: [
      { action: "celebrate", actor: "lumi", at: 2.3, duration: 2.4, emotion: "celebrating" },
      { action: "look", actor: "player", at: 1, duration: 3.8, emotion: "proud" }
    ],
    title: "Recipe Reveal Cinematic"
  }
};
