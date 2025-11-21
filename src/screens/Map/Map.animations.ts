
import type { Variants } from 'framer-motion';

export const mapVariants: Variants = {
  hidden:  { opacity: 0, x: 300 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'tween', duration: 0.4 } as const,
  },
  exit: {
    opacity: 0,
    x: -300,
    transition: { type: 'tween', duration: 0.3 } as const,
  },
};