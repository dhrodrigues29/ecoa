// src/screens/PoiCard/PeekBar.tsx
import { motion } from 'framer-motion';
import styles from './PoiCard.module.css';
import { Card } from './useCardStack';

type Props = {
  card: Card | undefined;
  onOpen: () => void;
};

export default function PeekBar({ card, onOpen }: Props) {
  if (!card) return null;

  return (
    <motion.div
      id="card-peek"
      className={styles.peekBar}
      initial={{ y: 'calc(100% + 2rem)' }}
      animate={{ y: 0 }}
      exit={{ y: 'calc(100% + 2rem)' }}
      transition={{ type: 'tween', duration: 0.3 }}
      onClick={onOpen}
    >
      <img id="card-peek-img" src={card.img} alt="" />
      <strong id="card-peek-title">{card.title}</strong>
      <button className={styles.peekExpand} aria-label="Ver detalhes">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3h8M6 9h12M4 15h16M8 21h8" />
        </svg>
      </button>
    </motion.div>
  );
}