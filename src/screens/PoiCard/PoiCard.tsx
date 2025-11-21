// src/screens/PoiCard/PoiCard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '../../app/router';
import useCardStack from './useCardStack';
import FullCard from './FullCard';
import styles from './PoiCard.module.css';

export default function PoiCard() {
  const { payload, pop, replace } = useRouter();
  const map = payload?.map as maplibregl.Map;
  const { cards, idx, next, prev, fly, current } = useCardStack();

  useEffect(() => {
    if (!current) { pop(); return; }
    fly(map);
    if (map && current) (window as any).__lastPoiCenter = [current.longitude, current.latitude] as [number, number];
  }, [idx, map, fly, current, pop]);

  if (!current) return null;

  const handleClose = () => {
    window.__activeMarkerId = null;
    setTimeout(() => window.dispatchEvent(new CustomEvent('markerDeselected')), 0);
    replace('map', { keepView: true });
  };

  return (
    <motion.div
      className={styles.poiCard}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={(def: any) => { if (def === 'exit') pop(); }}
    >
      <FullCard card={current} onClose={handleClose} onNext={next} onPrev={prev} />
    </motion.div>
  );
}