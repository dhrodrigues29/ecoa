import { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { supabase } from '../../lib/supabase';
import { useRouter } from '../../app/router';
import styles from './Map.module.css';
import type { POI } from './useViewportPOIs';

declare global {
  interface Window {
    __rawPOIs: POI[];
    __currentVisiblePOIs: POI[];
    __currentViewportPOIs: POI[];
    __activeMarkerId: number | null;
  }
}

if (!window.__rawPOIs) window.__rawPOIs = [];
if (!window.__currentVisiblePOIs) window.__currentVisiblePOIs = [];
if (!window.__currentViewportPOIs) window.__currentViewportPOIs = [];
if (!window.__activeMarkerId) window.__activeMarkerId = null;

export default function usePOIMarkers(map: maplibregl.Map | null, pois: POI[]) {
  const markerRef = useRef<maplibregl.Marker[]>([]);
  const { push, replace, stack } = useRouter();
  const [activeMarkerId, setActiveMarkerId] = useState(window.__activeMarkerId);

  useEffect(() => {
    if (!map) return;

    const checkActive = setInterval(() => {
      if (window.__activeMarkerId !== activeMarkerId) setActiveMarkerId(window.__activeMarkerId);
    }, 100);

    const wanted = new Set(pois.map(p => p.id));

    markerRef.current = markerRef.current.filter(m => {
      const ll = m.getLngLat();
      const raw = window.__rawPOIs.find(r => r.latitude === ll.lat && r.longitude === ll.lng);
      if (!raw || !wanted.has(raw.id)) {
        m.remove();
        return false;
      }
      return true;
    });

    markerRef.current.forEach(m => {
      const ll = m.getLngLat();
      const raw = window.__rawPOIs.find(r => r.latitude === ll.lat && r.longitude === ll.lng);
      if (!raw) return;

      const inView = wanted.has(raw.id);
      const isActive = raw.id === window.__activeMarkerId;
      const el = m.getElement() as HTMLElement;

      el.style.display = (inView || isActive) ? 'block' : 'none';
    });

    markerRef.current.forEach(m => {
      const ll = m.getLngLat();
      const raw = window.__rawPOIs.find(r => r.latitude === ll.lat && r.longitude === ll.lng);
      if (!raw) return;

      const el = m.getElement() as HTMLElement;
      const isActive = raw.id === activeMarkerId;

      el.className = isActive
        ? `${styles.poiMarker} ${styles.poiMarkerActive}`
        : styles.poiMarker;
    });

    const existingIds = new Set(
      markerRef.current
        .map(m => {
          const ll = m.getLngLat();
          const raw = window.__rawPOIs.find(r => r.latitude === ll.lat && r.longitude === ll.lng);
          return raw?.id;
        })
        .filter(Boolean)
    );

    pois.forEach(p => {
      if (existingIds.has(p.id)) return;

      const el = document.createElement('button');
      el.dataset.plan = String(p.plan_level ?? 0);
      if (el.dataset.listener) return;
      el.dataset.listener = '1';
      const isActive = p.id === window.__activeMarkerId;
      const shouldBeVisible = wanted.has(p.id) || isActive;

      el.style.display = shouldBeVisible ? 'block' : 'none';
      el.className = isActive
        ? `${styles.poiMarker} ${styles.poiMarkerActive}`
        : styles.poiMarker;

      el.addEventListener('click', async () => {
        const { data: full } = await supabase
          .from('lugares')
          .select('*')
          .eq('id', p.id)
          .single();
        if (!full) return;

        window.__currentViewportPOIs = pois;
        window.__activeMarkerId = p.id;

        const cardArray = window.__currentViewportPOIs.map(formatCard);
        const idx = window.__currentViewportPOIs.findIndex(v => v.id === p.id);


        let pushTimeout: ReturnType<typeof setTimeout> | null = null;

        if (pushTimeout) clearTimeout(pushTimeout);
        pushTimeout = setTimeout(() => {
          map.flyTo({ center: [p.longitude, p.latitude], zoom: 16 });
          const isCardOpen = stack.at(-1)?.screen === 'poi-card';
          const nav = isCardOpen ? replace : push;
          map.once('moveend', () =>
            nav('poi-card', { map, cardArray, initialIndex: idx })
          );
        }, 50);
      });

      const mk = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([p.longitude, p.latitude])
        .addTo(map);

      (mk as any).__originalLat = p.latitude;
      (mk as any).__originalLng = p.longitude;

      markerRef.current.push(mk);
      if (!window.__rawPOIs.find(r => r.id === p.id)) {
        window.__rawPOIs.push(p);
      }
    });

    return () => {
      clearInterval(checkActive);
      markerRef.current.forEach(m => m.remove());
      markerRef.current = [];
    };
  }, [map, pois, push, activeMarkerId]);
}

export function formatCard(p: POI) {
  const tags = Array.isArray(p.tags)
    ? p.tags
    : (p.tags as string | null)?.split(',').map((t: string) => t.trim()).filter(Boolean) ?? [];

  return {
    id: p.id,
    categoria: p.categoria,
    title: p.titulo,
    endereco: p.endereco,
    telefone: p.telefone,
    descricao: p.descricao,
    estado_abertura: p.estado_abertura,
    rating: p.rating,
    reviews: p.reviews,
    preco: p.preco,
    preco_descricao: p.preco_descricao,
    latitude: p.latitude,
    longitude: p.longitude,
    servicos: p.servicos,
    destaques: p.destaques,
    publico: p.publico,
    pagamentos: p.pagamentos,
    amenidades: p.amenidades,
    atmosfera: p.atmosfera,
    planejamento: p.planejamento,
    estacionamento: p.estacionamento,
    animais: p.animais,
    tags: p.tags,
    img: `/img/poi/${p.id}.jpg`,
    url: p.telefone ? `tel:${p.telefone}` : '#',
    raw: { ...p, tags },
  };
}