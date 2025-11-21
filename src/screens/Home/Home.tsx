// src/screens/Home/Home.tsx
import { useEffect, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '../../app/router';
import { homeVariants, loaderVariants } from './Home.animations';
import styles from './Home.module.css';
import { SearchBar } from '../../components/SearchBar';

export default function Home() {
  const { replace,push, stack } = useRouter();

  const [query, setQuery]   = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (isSearching || !query.trim()) return;

    setIsSearching(true);          // triggers <AnimatePresence exit>
    await new Promise(r => setTimeout(r, 1600)); // wait for fade + spinner
    replace('map', { query: query.trim() });        // now switch
  };

  const goPartner = () => push('partner');

  return (
    <AnimatePresence>
      {!isSearching && (
        <motion.section
          key="home"
          className={styles.home}
          variants={homeVariants}
          initial="visible"
          exit="exit"
        >
          <div className={styles.container}>
            <div className={styles.hero}>
              <h1 className={styles.logo}>Ecoa</h1>
              <p className={styles.tagline}>Encontre Eventos Próximos à Você!</p>
            </div>

            <form className={styles.form} onSubmit={handleSearch}>
              <div className={styles.searchWrap}>
              <SearchBar
                mode="title"
                value={query}
                onChange={setQuery}
                onSearch={() => handleSearch({ preventDefault: () => {} } as any)}
                placeholder="Busque pela sua cidade, cep ou nome do estabelcimento"
              />
              </div>
            </form>

            <p className={styles.partnerCall}>Tenha seu Evento em Destaque e Faça Ecoar!</p>
            <button onClick={goPartner} className={`btn btn--lg btn--primary ${styles.partnerBtn}`}>
              Seja um Parceiro
              <i></i>
            </button>
          </div>

          <footer className={styles.footer}>
            © {new Date().getFullYear()} Ecoapoa. Todos os direitos reservados.
          </footer>
        </motion.section>
      )}

      {isSearching && (
        <motion.div
          className={styles.loader}
          variants={loaderVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className={styles.spinner} />   {/* reuse your old spinner css */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}