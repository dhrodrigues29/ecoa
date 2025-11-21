// src/screens/PoiCard/useCardStack.ts
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from '../../app/router';
import maplibregl from 'maplibre-gl';

export type Card = {
  id: number;
  title: string;
  img: string;
  url: string;
  raw: any;
  latitude: number;
  longitude: number;
};

export default function useCardStack() {
  const { stack } = useRouter();
  const payload = stack.at(-1)?.payload as {
    cardArray: Card[];
    initialIndex: number;
  };

  // 1. cap at 100 POIs
  const cards = useMemo(() => (payload?.cardArray || []).slice(0, 100), [payload]);

  // 2. order is active only while card is open
  const [idx, setIdx] = useState<number>(payload?.initialIndex ?? 0);

  useEffect(() => {
    setIdx(payload?.initialIndex ?? 0);
  }, [payload]);

  const next = () => {
    setIdx((i) => {
      const nextI = (i + 1) % cards.length;
      window.__activeMarkerId = cards[nextI]?.id ?? null;
      return nextI;
    });
  };

  const prev = () => {
    setIdx((i) => {
      const prevI = (i - 1 + cards.length) % cards.length;
      window.__activeMarkerId = cards[prevI]?.id ?? null;
      return prevI;
    });
  };

  const fly = (map: maplibregl.Map | null) => {
    const c = cards[idx];
    if (!map || !c) return;
    map.flyTo({ center: [c.longitude, c.latitude], zoom: 16 });
  };

  // 3. null order on card close
  useEffect(() => {
    const onPop = () => { window.__activeMarkerId = null; };
    window.addEventListener('poiCardPop', onPop);
    return () => window.removeEventListener('poiCardPop', onPop);
  }, []);

  return { cards, idx, next, prev, fly, current: cards[idx] };
}