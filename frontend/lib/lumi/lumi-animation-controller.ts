import type { Variants } from "framer-motion";

import { motionTokens } from "@/lib/design-tokens";
import type { LumiEmotion, LumiMode } from "@/lib/lumi/lumi-types";

/** Provides centralized Framer Motion variants for Lumi's companion body and bubbles. */
export class LumiAnimationController {
  body(emotion: LumiEmotion, mode: LumiMode, reducedMotion: boolean): Variants | undefined {
    if (reducedMotion) {
      return undefined;
    }

    const lift =
      emotion === "celebrating" ? motionTokens.distance.collect : motionTokens.distance.ambient;
    const scale =
      emotion === "excited" || emotion === "celebrating" ? motionTokens.scale.collect : 1;
    const duration =
      mode === "sleeping" ? motionTokens.duration.ambient * 1.4 : motionTokens.duration.ambient;

    return {
      animate: {
        scale,
        y: [0, -lift, 0],
        transition: {
          duration,
          ease: motionTokens.easing.soft,
          repeat: Number.POSITIVE_INFINITY
        }
      },
      initial: {
        scale: 1,
        y: 0
      }
    };
  }

  bubble(reducedMotion: boolean): Variants | undefined {
    if (reducedMotion) {
      return undefined;
    }

    return {
      hidden: {
        opacity: 0,
        y: motionTokens.distance.panel
      },
      visible: {
        opacity: 1,
        transition: {
          duration: motionTokens.duration.panel,
          ease: motionTokens.easing.soft
        },
        y: 0
      }
    };
  }
}
