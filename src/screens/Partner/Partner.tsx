// src/screens/Partner/Partner.tsx
import { motion } from "framer-motion";
import { useRouter } from "../../app/router";
import PlanCard from "./PlanCard";
import { containerVariants } from "./Partner.animations";
import styles from "./Partner.module.css";
import { useState, useEffect } from "react";
import { searchTitles, planCache } from "../../lib/search";
import { SearchBar } from '../../components/SearchBar';

import {
  getPartnerForm,
  setPartnerForm,
  clearPartnerForm,
} from "../../lib/partnerFormCache";

const planName: Record<string, string> = {
  semplano: "Sem Plano",
  basico: "Básico",
  intermediario: "Intermediário",
  premium: "Premium",
};

type Plan = {
  value: number;
  title: string;
  price: string;
  perks: string[];
  key?: string; // <-- new optional field
};

const PLANS: Plan[] = [
  {
    value: 0,
    title: "Sem Plano", // <- unaccented
    price: "Grátis",
    perks: ["Visibilidade padrão", "Informações básicas"],
  },
  {
    value: 29.9,
    title: "Basico", // <- unaccented
    price: "R$29,90",
    perks: ["Visibilidade elevada", "Informações básicas", "Destaque visual básico"],
  },
  {
    value: 59.9,
    title: "Intermediario", // <- unaccented
    price: "R$59,90",
    perks: [
      "Visibilidade superior",
      "Informações básicas e publicações recentes do Instagram", "Destaque visual Intermediário",
    ],
  },
  {
    value: 99.99,
    title: "Premium", // already unaccented
    price: "R$99,90",
    perks: [
      "Visibilidade máxima",
      "Informações básicas e publicações recentes do Instagram", "Destaque visual Premium",
    ],
  },
];

type PartnerForm = {
  poi: { id: number; titulo: string; lat: number; lon: number } | null;
  instagram: string;
  contact: string;
  plan: { key: string; value: number } | null;
  poiInput?: string;
};

const planImage = (key: string | null): string => {
  const file = !key ? "noplan" : key.toLowerCase(); // basico | intermediario | premium | noplan
  return `/img/partner-poi/${file}.png`;
};

export default function Partner() {
  const { push, pop } = useRouter();

  const [form, setForm] = useState<PartnerForm>(() => {
    return (
      getPartnerForm<PartnerForm>() ?? {
        poi: null,
        instagram: "",
        contact: "",
        plan: null,
      }
    );
  });

  /* restore form when returning from map/payment */
  useEffect(() => {
    clearPartnerForm(); // fresh start every full reload
    const saved = getPartnerForm<PartnerForm>();
    if (saved) setForm(saved);
  }, []);

  useEffect(() => {
    setPartnerForm(form);
  }, [form]);

  const selectPlan = (planKey: string, value: number) => {
  setForm(f => ({ ...f, plan: { key: planKey, value } }));

  /* mock: remember the new plan for this POI */
  if (form.poi) {
    const planId = { semplano: 0, basico: 1, intermediario: 2, premium: 3 }[planKey] ?? 0;
    planCache.set(form.poi.id, planId);
  }
};

  const goBack = () => pop();

  const isComplete =
    form.poi !== null &&
    form.instagram.trim() !== "" &&
    form.contact.trim() !== "" &&
    form.plan !== null;

  function planLevelFromKey(k: string): number | null {
    switch (k) {
      case "basico":
        return 1;
      case "intermediario":
        return 2;
      case "premium":
        return 3;
      default:
        return null;
    }
  }
  return (
    <motion.section
      className={styles.screen}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.content}>
        <h2 className={styles.heading}>
          Encontre seu Negócio e Escolha seu Plano!
        </h2>

        <div className={styles.cardRow}>
          {/* ---- TOP ROW : INPUT (left) + SUMMARY (right) ---- */}
          <div className={styles.topRow}>
            <div className={styles.inputCard}>
              <div className={styles.idBox}>
  <label>Informe o seu estabelecimento</label>
  <SearchBar
    mode="title"
    placeholder="Nome do seu estabelecimento"
    value={form.poiInput ?? form.poi?.titulo ?? ""}
    onChange={(v) =>
      setForm((f) => ({ ...f, poi: null, poiInput: v }))
    }
    onSearch={(v) => {
  searchTitles(v, 1).then((res) => {
    if (res[0]) {
      setForm((f) => ({
        ...f,
        poi: { ...res[0], lat: 0, lon: 0 },
        // poiInput: undefined   // ← DELETE THIS LINE
      }));
    }
  });
}}
    onTitlePick={(titulo) =>
      searchTitles(titulo, 1).then((res) => {
        if (res[0])
          setForm((f) => ({
            ...f,
            poi: { ...res[0], lat: 0, lon: 0 },
            poiInput: undefined,
          }));
      })
    }
  />
</div>

              <div className={styles.idBox}>
                <label>Informe seu Instagram</label>
                <input
                  className={styles.idInput}
                  type="text"
                  placeholder="@seu.instagram"
                  value={form.instagram}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, instagram: e.target.value }))
                  }
                />
              </div>

              <div className={styles.idBox}>
                <label>Informe seu Contato (e-mail)</label>
                <input
                  className={styles.idInput}
                  type="email"
                  placeholder="contato@exemplo.com"
                  value={form.contact}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contact: e.target.value }))
                  }
                />
              </div>
            </div>

            <div
              className={styles.summaryCard}
              style={{
                backgroundImage: `url(${planImage(form.plan?.key ?? null)})`,
              }}
            >
              <div className={styles.summaryOverlay}>
                <h3 className={styles.summaryTitle}>
                  {(form.plan && planName[form.plan.key]) ?? "Sem Plano"} – Seu
                  comércio em destaque!
                </h3>
              </div>
            </div>
          </div>

          {/* ---- BOTTOM ROW : PLANS (full-width, horizontal) ---- */}
          <div className={styles.plansCard}>
            <h3 className={styles.subHeading}>Escolha seu plano</h3>
            <div className={styles.grid}>
              {PLANS.map((p) => {
                const key = p.key ?? p.title.toLowerCase().replace(/\s+/g, "");
                return (
                  <PlanCard
                    key={p.value}
                    {...p}
                    selected={form.plan?.key === key}
                    onClick={() => selectPlan(key, p.value)}
                    isComplete={isComplete}
                    onPreview={() =>
                      push("map", {
                        query: form.poi!.titulo,
                        lat: form.poi!.lat,
                        lon: form.poi!.lon,
                        plan: key,
                      })
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>

        <button
          className={`${styles.proceed} ${!isComplete ? styles.disabled : ""}`}
          disabled={!isComplete}
          onClick={() =>
            push("confirm-payment", {
              planKey: form.plan!.key,
              value: form.plan!.value,
              poiId: form.poi!.id,
              planLevel: planLevelFromKey(form.plan!.key),
            })
          }
        >
          Continuar para o pagamento
        </button>

        <button className={styles.back} onClick={goBack}>
          ← Voltar
        </button>
      </div>
    </motion.section>
  );
}
