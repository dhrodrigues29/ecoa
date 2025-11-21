// src/screens/Home/Home.animations.ts
import { Variants } from 'framer-motion';

export const homeVariants: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 40,
    transition: { duration: 0.5, ease: 'easeIn' },
  },
};

export const loaderVariants: Variants = {
  hidden:  { opacity: 0, pointerEvents: 'none' },
  visible: { opacity: 1, pointerEvents: 'auto' },
};