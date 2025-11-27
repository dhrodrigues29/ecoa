// src/screens/Partner/PlanCard.tsx
import { motion } from 'framer-motion';
import styles from './Partner.module.css';

type Props = {
  title: string;
  price: string;
  perks: string[];
  onClick: () => void;          // choose plan
  selected?: boolean;
  isComplete?: boolean;
  onPreview?: () => void;       // see on map
};

export default function PlanCard({
  title,
  price,
  perks,
  onClick,
  selected,
  isComplete,
  onPreview,
}: Props) {
  return (
    <motion.button
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className={styles.header}>
        <span className={styles.badge}>{title}</span>
        <span className={styles.price}>{price}</span>
      </div>

      <ul className={styles.perks}>
        {perks.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      {isComplete }
    </motion.button>
  );
}