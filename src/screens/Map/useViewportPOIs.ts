// src/screens/Map/useViewportPOIs.ts
import { useEffect, useState, useCallback } from "react";
import type { Map } from "maplibre-gl";
import { supabase } from "../../lib/supabase";

export type POI = {
  id: number;
  titulo: string;
  endereco?: string;
  tags?: string[];
  latitude: number;
  longitude: number;
  descricao?: string;
  categoria?: string;
  rating?: number;
  reviews: number;
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
  plan_level?: 0 | 1 | 2 | null;
  telefone?: string;
};

export default function useViewportPOIs(
  map: Map | null,
  activeTags?: Set<string>
) {
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filtered, setFiltered] = useState(0);

  /* ---------- fetch & filter ---------- */
  const refetch = useCallback(() => {
    if (!map) return;
    const z = map.getZoom();
    if (z < 12) return;

    const b = map.getBounds();
    const sw = b.getSouthWest();
    const ne = b.getNorthEast();

    const run = async () => {
      console.log(
        "[useViewportPOIs] fetching with activeTags:",
        Array.from(activeTags ?? [])
      );
      setLoading(true);
      const { data, error } = await supabase
        .from("lugares")
        .select(
          `id,categoria,titulo,endereco,tags,telefone,descricao,estado_abertura,rating,reviews,preco,preco_descricao,latitude,longitude,servicos,destaques,publico,pagamentos,amenidades,atmosfera,planejamento,estacionamento,animais,plan_level`,
          { count: "exact" }
        )
        .gte("latitude", sw.lat)
        .lte("latitude", ne.lat)
        .gte("longitude", sw.lng)
        .lte("longitude", ne.lng)
        .limit(200);

      const totalCount = error ? 0 : ((data as any).count ?? 0);

      if (!error && data) {
        const normalisedActive = Array.from(activeTags ?? []).map((t) =>
          t.toLowerCase()
        );
        const mapped: POI[] = data
          .map((r) => ({
            ...r,
            tags:
              (r.tags as string)
                ?.replace(/[\[\]\{\}]/g, "")
                .replace(/'/g, "")
                .split(",")
                .map((t: string) => t.toLowerCase().trim())
                .filter(Boolean) ?? [],
          }))
          .filter((r) =>
            normalisedActive.every((needle) => r.tags.includes(needle))
          )
          .map((r) => ({
            id: r.id,
            titulo: r.titulo,
            endereco: r.endereco ?? undefined,
            tags: r.tags ?? [],
            latitude: r.latitude,
            longitude: r.longitude,
            descricao: r.descricao ?? undefined,
            categoria: r.categoria,
            rating: r.rating,
            reviews: r.reviews,
            preco: r.preco,
            preco_descricao: r.preco_descricao,
            servicos: r.servicos,
            destaques: r.destaques,
            publico: r.publico,
            pagamentos: r.pagamentos,
            amenidades: r.amenidades,
            atmosfera: r.atmosfera,
            planejamento: r.planejamento,
            estacionamento: r.estacionamento,
            animais: r.animais,
            estado_abertura: r.estado_abertura,
            plan_level: r.plan_level ?? null,
            telefone: r.telefone,
          }));
        setTotal(totalCount);
        setFiltered(mapped.length);
        setPois(mapped);
      }

      setLoading(false);
    };

    const t = setTimeout(run, 300);
    return () => clearTimeout(t);
  }, [map, activeTags]);

  /* ---------- auto-run on map events ---------- */
  useEffect(() => {
    if (!map) return;
    map.on("load", refetch);
    map.on("moveend", refetch);
    return () => {
      map.off("load", refetch);
      map.off("moveend", refetch);
    };
  }, [map, refetch]);

  return { pois, loading, refetch, total, filtered };
}
