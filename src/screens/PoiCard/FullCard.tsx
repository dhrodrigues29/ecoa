// src/screens/PoiCard/FullCard.tsx
import { motion } from "framer-motion";
import styles from "./PoiCard.module.css";
import { Card } from "./useCardStack";
import { useState, useEffect } from "react";
import { LazyImg } from "../../components/LazyImg";
import { Lightbox } from "../../components/LightBox/Lightbox";

type Props = {
  card: Card | undefined;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function FullCard({ card, onClose, onNext, onPrev }: Props) {
  const [lightbox, setLightbox] = useState(false);
  const [pubIndex, setPubIndex] = useState(0);
  const [pubLightbox, setPubLightbox] = useState(false);
  const [pubExist, setPubExist] = useState<boolean[]>([true, true, true]);
  const [mainLightbox, setMainLightbox] = useState(false);

  if (!card) return null; // guard first

  const planLevel = card.raw?.plan_level ?? null;
  const planClass =
    planLevel === 1
      ? styles.cardBasico
      : planLevel === 2
        ? styles.cardIntermediario
        : planLevel === 3
          ? styles.cardPremium
          : "";

  const poiId = card.raw?.id;
  const pubImgs = [
    `/img/publication/${poiId}-p1.png`,
    `/img/publication/${poiId}-p2.png`,
    `/img/publication/${poiId}-p3.png`,
  ];

  // probe existence
  useEffect(() => {
    if (planLevel < 2) return;
    const checks = pubImgs.map((src, i) => {
      const img = new Image();
      img.src = src;
      return new Promise<boolean>((res) => {
        img.onload = () => res(true);
        img.onerror = () => res(false);
      });
    });
    Promise.all(checks).then(setPubExist);
  }, [pubImgs, planLevel]);

  const finalPubs = pubImgs.map((src, i) =>
    pubExist[i] ? src : `/img/publication/placeholder-p${i + 1}.png`
  );

  const nextPub = () => setPubIndex((i) => (i + 1) % 3);
  const prevPub = () => setPubIndex((i) => (i - 1 + 3) % 3);

  const rows = [
    "categoria",
    "endereco",
    "tags",
    "telefone",
    "descricao",
    "estado_abertura",
    "rating",
    "reviews",
    "preco",
    "preco_descricao",
    "servicos",
    "destaques",
    "publico",
    "pagamentos",
    "amenidades",
    "atmosfera",
    "planejamento",
    "estacionamento",
    "animais",
  ];

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

    return (
    <div id="card-wrapper" className={styles.wrapper}>
      <button
        id="card-prev"
        className={`${styles.prev} ${planClass}`}
        onClick={onPrev}
        aria-label="Previous"
      >
        ‹
      </button>
      <motion.div
        id="card"
        className={`${styles.card} ${styles.active} ${planClass}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* publication lightbox with arrows */}
        <Lightbox
          src={finalPubs[pubIndex]}
          open={pubLightbox}
          onClose={() => setPubLightbox(false)}
        >
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={prevPub}
          >
            ‹
          </button>
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={nextPub}
          >
            ›
          </button>
        </Lightbox>

        {/* main-image lightbox */}
        <Lightbox
          src={card.img}
          open={mainLightbox}
          onClose={() => setMainLightbox(false)}
        />

        <button
          id="card-close"
          className={styles.close}
          onClick={handleCloseClick}
          aria-label="Close"
        >
          ✕
        </button>

        <div id="card-body" className={`${styles.body} ${styles.scrollBox}`}>
          {/* main-image button (only one) */}
          <button
            className={styles.imgBtn}
            onClick={() => setMainLightbox(true)}
          >
            <LazyImg
              id="card-img"
              className={styles.media}
              src={card.img}
              alt=""
            />
          </button>

          <strong id="card-title" className={styles.title}>
            {card.title}
          </strong>

          {planLevel !== null && planLevel >= 2 && (
            <button
              className={styles.pubBtn}
              onClick={() => setPubLightbox(true)}
            >
              Ver publicações recentes
            </button>
          )}

          <section id="card-full-grid" className={styles.grid}>
            {rows.map((k) =>
              card.raw?.[k] ? (
                <div key={k} className={styles.row}>
                  <label>{k}</label>
                  <span>
                    {Array.isArray(card.raw[k])
                      ? card.raw[k].join(", ")
                      : card.raw[k]}
                  </span>
                </div>
              ) : null
            )}
          </section>

          <a
            id="card-link"
            className={styles.link}
            href={card.url}
            target="_blank"
            rel="noreferrer"
          >
            {card.title}
          </a>
        </div>
      </motion.div>

      <button
        id="card-next"
        className={`${styles.next} ${planClass}`}
        onClick={onNext}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}
