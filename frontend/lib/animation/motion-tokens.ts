import type { Variants } from "framer-motion";

import { motionTokens } from "@/lib/design-tokens";

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: motionTokens.panelOffset
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: motionTokens.easing
    }
  }
};

export const pageTransition: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: motionTokens.easing
    }
  }
};
