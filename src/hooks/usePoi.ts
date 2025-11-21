// src/hooks/usePois.ts
import { useEffect, useState } from 'react';
import type { Map } from 'maplibre-gl';
import type { LngLatBounds } from 'maplibre-gl';
import { supabase } from '../lib/supabase';

// src/screens/Map/useViewportPOIs.ts
export type POI = {
  id: number;
  titulo: string;
  endereco?: string;
  latitude: number;
  longitude: number;
  descricao?: string;
  categoria?: string;
  rating?: number;
  reviews?: number;
  preco?: string;
  preco_descricao?: string;
  servicos?: string[];
  destaques?: string[];
  publico?: string;
  pagamentos?: string[];
  amenidades?: string[];
  atmosfera?: string;
  planejamento?: string;
  estacionamento?: string;
  animais?: string;
  estado_abertura?: string;
  cover_url?: string;
  telefone?: string;
};

export default function usePois(bounds: LngLatBounds | null) {
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bounds) return;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const fetchPois = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pois')
        .select(`id,titulo,endereco,latitude,longitude,descricao,categoria,rating,reviews,
         preco,preco_descricao,servicos,destaques,publico,pagamentos,amenidades,
         atmosfera,planejamento,estacionamento,animais,estado_abertura,cover_url,telefone`)
        .gte('lat', sw.lat)
        .lte('lat', ne.lat)
        .gte('lng', sw.lng)
        .lte('lng', ne.lng)
        .limit(200); // batch size

      if (!error && data) {
        const mapped: POI[] = data.map(r => ({
          id:               r.id,
          titulo:           r.titulo,
          endereco:         r.endereco ?? undefined,
          latitude:         r.latitude,
          longitude:        r.longitude,
          descricao:        r.descricao ?? undefined,
          categoria:        r.categoria,
          rating:           r.rating,
          reviews:          r.reviews,
          preco:            r.preco,
          preco_descricao:  r.preco_descricao,
          servicos:         r.servicos,
          destaques:        r.destaques,
          publico:          r.publico,
          pagamentos:       r.pagamentos,
          amenidades:       r.amenidades,
          atmosfera:        r.atmosfera,
          planejamento:     r.planejamento,
          estacionamento:   r.estacionamento,
          animais:          r.animais,
          estado_abertura:  r.estado_abertura,
          cover_url:        r.cover_url,
          telefone:         r.telefone,
        }));
        setPois(mapped);
      }
      setLoading(false);
    };

    const t = setTimeout(fetchPois, 300); // debounce
    return () => clearTimeout(t);
  }, [bounds]);

  return { pois, loading };
}