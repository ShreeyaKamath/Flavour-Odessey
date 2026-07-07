import type { AudioId } from "@/lib/audio/manifest";
import { audioIds } from "@/lib/audio/manifest";
import {
  environmentTiming,
  type TimeOfDay,
  type WeatherCondition
} from "@/lib/world/joy-meadow-config";

export type JoyMeadowSeason = "joy_meadow_spring";

export type LivingWorldSnapshot = {
  ambientColor: string;
  audioAmbience: AudioId;
  cloudCover: number;
  condition: WeatherCondition;
  conditionLabel: string;
  fireflyIntensity: number;
  flowerSway: number;
  fogDensity: number;
  grassSway: number;
  lightingBlend: number;
  lumiReaction: string;
  npcRoutine: string;
  particleColor: string;
  rainIntensity: number;
  season: JoyMeadowSeason;
  seasonLabel: string;
  skyBottom: string;
  skyTop: string;
  timeLabel: string;
  timeOfDay: TimeOfDay;
  transitionProgress: number;
  waterReflection: number;
  windStrength: number;
};

type WeatherPreset = Omit<
  LivingWorldSnapshot,
  "season" | "seasonLabel" | "timeLabel" | "timeOfDay" | "transitionProgress"
>;

const timeLabels: Record<TimeOfDay, string> = {
  afternoon: "Afternoon",
  evening: "Evening",
  golden_hour: "Golden hour",
  morning: "Morning",
  night: "Night"
};

const weatherSequence: WeatherCondition[] = [
  "sunny",
  "cloudy",
  "rain",
  "mist",
  "golden_hour",
  "night"
];

const weatherPresets: Record<WeatherCondition, WeatherPreset> = {
  cloudy: {
    ambientColor: "#d8dde5",
    audioAmbience: audioIds.weather_wind,
    cloudCover: 0.82,
    condition: "cloudy",
    conditionLabel: "Cloudy",
    fireflyIntensity: 0.05,
    flowerSway: 0.85,
    fogDensity: 0.16,
    grassSway: 0.95,
    lightingBlend: 0.62,
    lumiReaction: "The clouds make Lumi drift lower and listen more carefully.",
    npcRoutine: "Moves between the bridge and bakery porch for warm conversation.",
    particleColor: "#f1f6ff",
    rainIntensity: 0,
    skyBottom: "#cedce5",
    skyTop: "#94aec4",
    waterReflection: 0.72,
    windStrength: 0.72
  },
  golden_hour: {
    ambientColor: "#ffd5a0",
    audioAmbience: audioIds.weather_golden_hour,
    cloudCover: 0.34,
    condition: "golden_hour",
    conditionLabel: "Golden hour",
    fireflyIntensity: 0.18,
    flowerSway: 0.75,
    fogDensity: 0.08,
    grassSway: 0.7,
    lightingBlend: 0.95,
    lumiReaction: "Lumi glows peach-gold and bobs happily beside the path.",
    npcRoutine: "Gathers near the recipe shrine to share sunset stories.",
    particleColor: "#ffd27d",
    rainIntensity: 0,
    skyBottom: "#ffd08b",
    skyTop: "#e78d78",
    waterReflection: 0.96,
    windStrength: 0.38
  },
  mist: {
    ambientColor: "#d9edf0",
    audioAmbience: audioIds.weather_mist,
    cloudCover: 0.68,
    condition: "mist",
    conditionLabel: "Mist",
    fireflyIntensity: 0.22,
    flowerSway: 0.46,
    fogDensity: 0.64,
    grassSway: 0.42,
    lightingBlend: 0.48,
    lumiReaction: "Lumi becomes a soft little lantern in the mist.",
    npcRoutine: "Walks slowly between landmarks and reads old meadow signs.",
    particleColor: "#d8f3ff",
    rainIntensity: 0,
    skyBottom: "#d9edf0",
    skyTop: "#9db8c2",
    waterReflection: 0.58,
    windStrength: 0.28
  },
  night: {
    ambientColor: "#53678f",
    audioAmbience: audioIds.weather_night,
    cloudCover: 0.28,
    condition: "night",
    conditionLabel: "Night",
    fireflyIntensity: 1,
    flowerSway: 0.38,
    fogDensity: 0.32,
    grassSway: 0.34,
    lightingBlend: 0.2,
    lumiReaction: "Lumi shines brighter so the meadow path stays friendly.",
    npcRoutine: "Heads indoors, reads by warm light, and drinks hot chocolate.",
    particleColor: "#fff28b",
    rainIntensity: 0,
    skyBottom: "#24375f",
    skyTop: "#101d3b",
    waterReflection: 0.5,
    windStrength: 0.24
  },
  rain: {
    ambientColor: "#a9c7d8",
    audioAmbience: audioIds.weather_rain,
    cloudCover: 1,
    condition: "rain",
    conditionLabel: "Rain",
    fireflyIntensity: 0,
    flowerSway: 1.15,
    fogDensity: 0.36,
    grassSway: 1.2,
    lightingBlend: 0.38,
    lumiReaction: "Lumi tucks beneath a leaf and peeks out with a brave sparkle.",
    npcRoutine: "Runs indoors, reads, and drinks hot chocolate until the rain softens.",
    particleColor: "#b7ddff",
    rainIntensity: 1,
    skyBottom: "#9eb8c8",
    skyTop: "#566f86",
    waterReflection: 0.9,
    windStrength: 0.86
  },
  sunny: {
    ambientColor: "#fff0b5",
    audioAmbience: audioIds.weather_birds,
    cloudCover: 0.22,
    condition: "sunny",
    conditionLabel: "Sunny",
    fireflyIntensity: 0,
    flowerSway: 0.62,
    fogDensity: 0.02,
    grassSway: 0.6,
    lightingBlend: 1,
    lumiReaction: "Lumi glows brighter in the sun and spins near the flowers.",
    npcRoutine: "Gardens, crosses the bridge, and talks near the Vanilla Orchid beds.",
    particleColor: "#fff4c2",
    rainIntensity: 0,
    skyBottom: "#bdebd7",
    skyTop: "#82cde7",
    waterReflection: 0.82,
    windStrength: 0.42
  }
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smooth(value: number) {
  const next = clamp01(value);
  return next * next * (3 - 2 * next);
}

/** Resolves the continuous Joy Meadow day and night cycle. */
export class TimeManager {
  resolve(now = new Date()): { label: string; progress: number; timeOfDay: TimeOfDay } {
    const dayProgress = ((now.getHours() * 60 + now.getMinutes()) % 1440) / 1440;
    return {
      label: timeLabels[this.timeOfDay(dayProgress)],
      progress: dayProgress,
      timeOfDay: this.timeOfDay(dayProgress)
    };
  }

  private timeOfDay(progress: number): TimeOfDay {
    if (progress >= 0.22 && progress < 0.46) {
      return "morning";
    }
    if (progress >= 0.46 && progress < 0.7) {
      return "afternoon";
    }
    if (progress >= 0.7 && progress < 0.82) {
      return "golden_hour";
    }
    if (progress >= 0.82 && progress < 0.92) {
      return "evening";
    }
    return "night";
  }
}

/** Selects weather and transition metadata for Joy Meadow's living world. */
export class WeatherManager {
  resolve(now = new Date(), timeOfDay?: TimeOfDay): LivingWorldSnapshot {
    const time = timeOfDay ?? new TimeManager().resolve(now).timeOfDay;
    const weatherProgress =
      ((now.getTime() % environmentTiming.weatherCycleMs) / environmentTiming.weatherCycleMs) *
      weatherSequence.length;
    const index = Math.floor(weatherProgress) % weatherSequence.length;
    const condition = this.conditionForTime(weatherSequence[index], time);
    const preset = weatherPresets[condition];

    return {
      ...preset,
      season: "joy_meadow_spring",
      seasonLabel: "Joy Meadow spring",
      timeLabel: timeLabels[time],
      timeOfDay: time,
      transitionProgress: smooth(weatherProgress - Math.floor(weatherProgress))
    };
  }

  private conditionForTime(condition: WeatherCondition, timeOfDay: TimeOfDay) {
    if (timeOfDay === "night") {
      return "night";
    }
    if (timeOfDay === "golden_hour") {
      return "golden_hour";
    }
    return condition === "night" || condition === "golden_hour" ? "sunny" : condition;
  }
}
