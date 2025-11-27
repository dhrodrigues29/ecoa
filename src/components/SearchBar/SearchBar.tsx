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
  disableDropdown?: boolean;
};

export function SearchBar({
  mode = 'title',
  value,
  onChange,
  onSearch,
  onTagSelect,
  onTitlePick,
  placeholder = 'Busque por eventos ou estabelecimento...',
  disableDropdown
}: Props) {
  const [open, setOpen]   = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [titles, setTitles] = useState<{id:number;titulo:string}[]>([]);
  const [tags, setTags]     = useState<string[]>([]);
  const blockReopen = useRef(false);

  useEffect(() => {
    if (!value) { setOpen(false); return; }
    if (blockReopen.current) {          // ← new
      blockReopen.current = false;      // ← reset for next keystroke
      return;
    }
    if (disableDropdown) return;
    (async () => {
    if (mode === 'title') {
      setTitles(await searchTitles(value));
      setTags([]);
    } else {
      const [t, tg] = await Promise.all([searchTitles(value), searchTags(value)]);
      setTitles(t);
      setTags(tg);
    }
    setOpen(true);
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
      if (e.key !== "Enter") return;
      if (!open) return;
      const first = titles[0] ?? tags[0];
      if (first) {
        blockReopen.current = true;          // ← new
        typeof first === "string" ? pickTag(first) : pickTitle(first);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, titles, tags]);

    const pickTitle = (it: {id:number;titulo:string}) => {
    blockReopen.current = true;   // ← new
    onChange(it.titulo);
    setOpen(false);
    onSearch(it.titulo);
    onTitlePick?.(it.titulo);
  };

  const pickTag = (t: string) => {
    blockReopen.current = true;   // ← new
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