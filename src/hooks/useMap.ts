// src/hooks/useMap.ts
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function useMap(containerId: string) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [bounds, setBounds] = useState<maplibregl.LngLatBounds | null>(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerId,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [-51.2177, -30.0346], // [lng, lat]
      zoom: 13,
    });

    // optional: remove default zoom buttons (same as before)
    // map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.once('load', () => {
      mapRef.current = map;
      setBounds(map.getBounds());
    });

    const onMove = () => setBounds(map.getBounds());
    map.on('moveend', onMove);

    return () => {
      map.off('moveend', onMove);
      map.remove();
    };
  }, [containerId]);

  return { map: mapRef.current, bounds };
}