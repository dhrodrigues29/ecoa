// src/screens/Map/useMapLibre.ts
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export const COORDS: Record<string, [number, number]> = {
  'porto alegre': [-51.219, -30.030],
  'sao paulo': [-46.633, -23.550],
  'rio de janeiro': [-43.173, -22.907],
};

export default function useMapLibre(containerId: string, query?: string) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);

  /* ---------- create map once per container ---------- */
  useEffect(() => {
    const prev = mapRef.current;
    if (prev) prev.remove();
    
    const map = new maplibregl.Map({
      container: containerId,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [-51.219, -30.030],
      zoom: 14,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.once('load', () => {
      mapRef.current = map;
      setReady(true);
    });

    return () => map.remove();
  }, [containerId]); // <- query removed = same instance for every search

  /* ---------- fly to new coords when query changes ---------- */
  useEffect(() => {
    if (!ready || !query) return;
    const coords = COORDS[query.trim().toLowerCase()] || [-51.219, -30.030];
    mapRef.current?.flyTo({ center: coords, zoom: 16 });
  }, [ready, query]);

  return { map: mapRef.current, ready };
}