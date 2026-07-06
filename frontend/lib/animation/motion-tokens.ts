import type { Transition, Variants } from "framer-motion";

import { motionTokens } from "@/lib/design-tokens";

export const motionTransitions = {
  hover: {
    duration: motionTokens.duration.hover,
    ease: motionTokens.easing.soft
  },
  panel: {
    duration: motionTokens.duration.panel,
    ease: motionTokens.easing.soft
  },
  reveal: {
    duration: motionTokens.duration.reveal,
    ease: motionTokens.easing.entrance
  },
  scene: {
    duration: motionTokens.duration.scene,
    ease: motionTokens.easing.entrance
  }
} satisfies Record<string, Transition>;

export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    y: motionTokens.distance.panel
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionTransitions.reveal
  },
  exit: {
    opacity: 0,
    transition: motionTransitions.hover
  }
};

export const sceneEntrance: Variants = {
  hidden: {
    opacity: 0,
    scale: motionTokens.scale.reveal,
    y: motionTokens.distance.scene
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: motionTransitions.scene
  }
};

export const panelReveal: Variants = {
  hidden: {
    opacity: 0,
    y: motionTokens.distance.panel
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionTransitions.panel
  }
};

export const ambientFloat: Variants = {
  resting: {
    y: 0
  },
  floating: {
    y: [0, -motionTokens.distance.ambient, 0],
    transition: {
      duration: motionTokens.duration.ambient,
      ease: motionTokens.easing.soft,
      repeat: Number.POSITIVE_INFINITY
    }
  }
};

export const ingredientCollect: Variants = {
  idle: {
    scale: 1,
    y: 0
  },
  collected: {
    scale: [1, motionTokens.scale.collect, 1],
    y: [0, -motionTokens.distance.collect, 0],
    transition: motionTransitions.reveal
  }
};

export const craftingOverlay: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: motionTransitions.scene
  },
  exit: {
    opacity: 0,
    transition: motionTransitions.reveal
  }
};

export const recipeBookReveal: Variants = {
  hidden: {
    opacity: 0,
    rotateY: -motionTokens.rotation.bookPage,
    transformOrigin: "left center",
    x: -motionTokens.distance.scene
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    transition: motionTransitions.scene,
    x: 0
  }
};

export const completionBadgeReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: motionTokens.scale.reveal
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: motionTransitions.reveal
  }
};

export const restorationGlow: Variants = {
  hidden: {
    opacity: 0,
    scale: motionTokens.scale.reveal
  },
  visible: {
    opacity: [0, 0.72, 0],
    scale: [motionTokens.scale.reveal, motionTokens.scale.collect, 1],
    transition: motionTransitions.scene
  }
};

export const journalReveal: Variants = {
  hidden: {
    opacity: 0,
    rotateX: -motionTokens.rotation.page,
    transformOrigin: "top"
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    transition: motionTransitions.scene
  }
};

export const sparkleReveal: Variants = {
  hidden: {
    opacity: 0,
    rotate: 0,
    scale: 0,
    y: 0
  },
  visible: (index: number) => ({
    opacity: [0, 1, 0],
    rotate: motionTokens.rotation.sparkle,
    scale: [0, 1, 0],
    transition: {
      delay: index * motionTokens.delay.particle,
      duration: motionTokens.duration.particle,
      ease: motionTokens.easing.soft
    },
    y: -motionTokens.distance.scene
  })
};

export const skeletonPulse: Variants = {
  resting: {
    opacity: 0.58
  },
  pulsing: {
    opacity: [0.48, 0.82, 0.48],
    transition: {
      duration: motionTokens.duration.skeleton,
      ease: motionTokens.easing.soft,
      repeat: Number.POSITIVE_INFINITY
    }
  }
};

export const interactionMotion = {
  hover: {
    scale: motionTokens.scale.hover,
    transition: motionTransitions.hover,
    y: -motionTokens.distance.ambient / 2
  },
  tap: {
    scale: motionTokens.scale.press,
    transition: {
      duration: motionTokens.duration.press,
      ease: motionTokens.easing.soft
    }
  }
} as const;
