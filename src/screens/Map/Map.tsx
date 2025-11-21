// src/screens/Map/Map.tsx
import { useEffect } from "react";
import { motion } from "framer-motion";
import maplibregl from "maplibre-gl";
import useMapLibre, { COORDS } from "./useMapLibre";
import useViewportPOIs from "./useViewportPOIs";
import { mapVariants } from "./Map.animations";
import styles from "./Map.module.css";
import usePOIMarkers from "./usePOIMarkers";
import { useState } from "react";
import { SearchBar } from "../../components/SearchBar";
import { TagBar } from "../../components/TagBar";
import { Button } from "../../components/Button";
import { searchTitles } from "../../lib/search";
import { formatCard } from "./usePOIMarkers";
import type { POI } from "./useViewportPOIs";
import { useRouter } from "../../app/router";
import { supabase } from "../../lib/supabase";
import { ActiveTagsBar } from "../../components/ActiveTagsBar";
import { POICounter } from "../../components/POICounter";

export default function Map({ query }: { query?: string }) {
  const { replace, push, stack } = useRouter();
  const isHidden = stack.at(-1)?.screen === "home";
  const { map, ready } = useMapLibre("map-container");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const normalisedTags = new Set(
    Array.from(activeTags).map((t) =>
      t
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    )
  );

  const { pois, loading, refetch, total, filtered } = useViewportPOIs(
    map,
    normalisedTags
  );
  usePOIMarkers(map, pois); // <-- drop the markers
  const [lastCenter, setLastCenter] = useState<[number, number]>([
    -51.219, -30.03,
  ]);

  useEffect(() => {
    if (!pois.length) return;
    window.__currentViewportPOIs = pois; // stable list for every marker
  }, [pois]);

  const [flyDone, setFlyDone] = useState(!query); // instant if no query
  useEffect(() => {
    if (!ready) return;

    // Check if we have a POI center from navigation
    const poiCenter = (window as any).__lastPoiCenter;
    if (poiCenter) {
      setLastCenter(poiCenter);
      delete (window as any).__lastPoiCenter; // Clean up
      return;
    }

    // Save current position before any fly
    const currentCenter = map?.getCenter();
    if (currentCenter) {
      setLastCenter([currentCenter.lng, currentCenter.lat]);
    }

    if (!query) return;

    const coords =
      (COORDS[query.trim().toLowerCase()] as [number, number]) || lastCenter;
    map?.flyTo({ center: coords, zoom: 16, duration: 1500 });
    const t = setTimeout(() => setFlyDone(true), 1500);
    return () => clearTimeout(t);
  }, [ready, query, map]);

  const goHome = () => push("home");

  const [search, setSearch] = useState("");
  const doSearch = () => {
    if (!search.trim()) return;
    setActiveTags(new Set()); // discard tags on text search
    map?.flyTo({
      center: COORDS[search.trim().toLowerCase()] || [-51.219, -30.03],
      zoom: 16,
    });
  };

  const handleTag = (t: string, on: boolean) => {
    const next = new Set(activeTags);
    if (on) next.add(t);
    else next.delete(t);
    setActiveTags(next);
    setSearch(""); // discard text when tag changes
    if (!map) return;
    // micro-pan → triggers moveend → refetch runs with fresh bounds
    const c = map.getCenter();
    map.panBy([0.00001, 0]); // 1 cm east
    map.panBy([-0.00001, 0]); // back 1 cm west (instant, no animation)
  };

  /* fly & open card for a concrete POI */
  const flyToPoi = (p: POI) => {
    if (!map) return;
    map.flyTo({ center: [p.longitude, p.latitude], zoom: 16 });

    /* build card array exactly like marker click does */
    window.__currentViewportPOIs = pois;
    window.__activeMarkerId = p.id;
    const cardArray = window.__currentViewportPOIs.map(formatCard);
    const idx = cardArray.findIndex((c) => c.id === p.id);
    map.once("moveend", () =>
      Promise.resolve().then(
        () => push("poi-card", { map, cardArray, initialIndex: idx }) // push, not replace
      )
    );
  };

  /* run when user clicks a dropdown item OR hits Enter */
  /* 1.  fetch full POI by ID (same RPC marker uses) */
  const openPoiById = async (id: number) => {
    const { data: full } = await supabase
      .from("lugares")
      .select("*")
      .eq("id", id)
      .single();

    if (!full) return;

    /* 2.  fly & open card (identical to marker click) */
    if (!map) return;
    map.flyTo({ center: [full.longitude, full.latitude], zoom: 16 });

    map.once("moveend", () => {
      /* 1.  ensure the POI is in the list (add or replace) */
      const list = [...pois];
      const exist = list.findIndex((p) => p.id === full.id);
      if (exist === -1) list.push(full as POI);
      else list[exist] = full as POI;

      window.__currentViewportPOIs = list;
      window.__activeMarkerId = full.id;

      /* 2.  build card stack */
      const cardArray = list.map(formatCard);
      const idx = cardArray.findIndex((c) => c.id === full.id);

      /* 3.  navigate after current render */
      Promise.resolve().then(() =>
        replace("poi-card", { map, cardArray, initialIndex: idx })
      );
    });
  };

  /* 3.  title pick -> use the ID we already have */
  const handleSearchPick = async (str: string) => {
    const list = await searchTitles(str, 1);
    const hit = list[0];
    if (hit) await openPoiById(hit.id);
  };

  return (
    <motion.section
      id="map-screen"
      className={styles.mapScreen}
      variants={mapVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ display: isHidden ? "none" : "flex" }}
    >
      <div id="map-container" className={styles.map} />

      <div className={styles.topLeftBar}>
        <SearchBar
          mode="title+tag"
          value={search}
          onChange={setSearch}
          onSearch={handleSearchPick}
          onTitlePick={handleSearchPick}
          onTagSelect={handleTag}
        />
        <TagBar activeTags={activeTags} onTagSelect={handleTag} />
        {activeTags.size > 0 ? (
          <>
            <ActiveTagsBar activeTags={activeTags} onToggle={handleTag} />
            <POICounter total={total} filtered={filtered} />
          </>
        ) : (
          <POICounter total={total} filtered={filtered} />
        )}
      </div>
      {/* ---- back button now top-right ---- */}
      <Button className={styles.backHome} onClick={goHome}>
        ← Voltar
      </Button>

      {loading && <div className={styles.loader}>carregando…</div>}
    </motion.section>
  );
}
