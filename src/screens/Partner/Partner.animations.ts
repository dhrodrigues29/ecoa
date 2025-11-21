// src/screens/Partner/Partner.animations.ts
import { Variants } from 'framer-motion';

export const containerVariants: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  exit:    { opacity: 0, y: -40, transition: { duration: 0.3 } },
};