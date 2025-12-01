// src/components/SearchBar/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { Dropdown } from './Dropdown';
import { searchTitles, searchTags } from '../../lib/search';
import styles from './SearchBar.module.css';

type Mode = 'title' | 'title+tag';

type Props = {
  mode?: Mode;
  value: string;
  onChange: (v: string) => void;
  onSearch: (v: string) => void;
  onTagSelect?: (t: string, active: boolean) => void;
  placeholder?: string;
  onTitlePick?: (title: string) => void;
};

export function SearchBar({
  mode = 'title',
  value,
  onChange,
  onSearch,
  onTagSelect,
  onTitlePick,
  placeholder = 'Busque por eventos ou estabelecimento...',
}: Props) {
  const [open, setOpen]   = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [titles, setTitles] = useState<{id:number;titulo:string}[]>([]);
  const [tags, setTags]     = useState<string[]>([]);

 /* 2.  FORCE open while typing */
  useEffect(() => {
  
  (async () => {
    const [t, tg] = await Promise.all([
      searchTitles(value),
      mode === 'title+tag' ? searchTags(value) : Promise.resolve([])
    ]);
    setTitles(t);
    setTags(tg);
    setOpen(true);          // ALWAYS open while typing
  })();
}, [value, mode]);

  /* close when clicking outside */
  useEffect(() => {
    const onClickOut = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOut);
    return () => document.removeEventListener('mousedown', onClickOut);
  }, []);

  /* Enter picks first suggestion */
useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Enter" || !open) return;
    const first = titles[0] ?? tags[0];
    if (first) typeof first === 'string' ? pickTag(first) : pickTitle(first);
  };
  document.addEventListener("keydown", onKey);
  return () => document.removeEventListener("keydown", onKey);
}, [open, titles, tags]);

    const pickTitle = (it: {id:number;titulo:string}) => {
    onChange(it.titulo);
    setOpen(false);
    onSearch(it.titulo);
    onTitlePick?.(it.titulo);
  };

  const pickTag = (t: string) => {
    onChange('');
    setOpen(false);
    onTagSelect?.(t, true);
  };


  return (
    <div className={styles.wrap}>
      <div className={styles.pen}>
        <input
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          
          onFocus={() => value && setOpen(true)}
        />
        <button className={styles.cap} onClick={() => { setOpen(false); onSearch(value); }}>
          <span className={styles.arrow}>→</span>
        </button>
      </div>

      <Dropdown
        open={open}
        items={[...titles, ...tags]}
        render={it => (typeof it === 'string' ? `#${it}` : it.titulo)}
        onPick={it => {
          typeof it === 'string' ? pickTag(it) : pickTitle(it);
            setOpen(false); 
        }}
      />
    </div>
  );
}