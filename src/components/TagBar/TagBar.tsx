import { Button } from '../Button';
import css from './TagBar.module.css';
import { ALL_TAGS } from './tagData';
import { useState, useEffect, useRef } from 'react';
import { Dropdown } from '../SearchBar/Dropdown';

type Props = {
  activeTags: Set<string>;
  onTagSelect: (name: string, on: boolean) => void;
};

const TAGS = ALL_TAGS;

export const TagBar = ({ activeTags, onTagSelect }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [advancedOpen, setAdvancedOpen]   = useState(false);
  const [advancedQuery, setAdvancedQuery] = useState('');
  const [suggestions, setSuggestions]     = useState<string[]>([]);
  const advancedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!advancedQuery.trim()) {               // empty → no suggestions
      setSuggestions([]);
      return;
    }
    const q = advancedQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");        // remove accents
    const filtered = ALL_TAGS.filter(t =>
      t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(q)
    ).slice(0, 8);
    setSuggestions(filtered);
  }, [advancedQuery]);

  useEffect(() => {
    if (!advancedOpen) return;                 
    const onClickOut = (e: MouseEvent) => {
      if (advancedRef.current?.contains(e.target as Node)) return;
      setSuggestions([]);                    
    };
    document.addEventListener('mousedown', onClickOut);
    return () => document.removeEventListener('mousedown', onClickOut);
  }, [advancedOpen]);

  const toggle = (t: string) => onTagSelect(t, !activeTags.has(t));

  const onWheel = (e: React.WheelEvent) => {
    if (!scrollRef.current) return;
    e.preventDefault();
    scrollRef.current.scrollLeft += e.deltaY;
  };

  return (
  <>
    <div className={css.bar}>
      <Button className={css.advanced} onClick={() => setAdvancedOpen(o => !o)}>
        Avançado
      </Button>
      <div
        ref={scrollRef}
        className={css.scroll}
        onWheel={onWheel}
        onMouseDown={(e) => {
          const el = scrollRef.current!;
          const startX = e.pageX + el.scrollLeft;
          const onMove = (ev: MouseEvent) => {
            el.scrollLeft = startX - ev.pageX;
          };
          const up = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', up);
          };
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', up);
        }}
      >
        {TAGS.map((t) => (
          <Button
            key={t}
            className={`${css.tag} ${activeTags.has(t) ? css.pressed : ''}`}
            onClick={() => toggle(t)}
          >
            {t}
          </Button>
        ))}
      </div>
    </div>

    {advancedOpen && (
      <div className={css.advancedBar} ref={advancedRef}>
        <input
          value={advancedQuery}
          onChange={e => setAdvancedQuery(e.target.value)}
          placeholder="Filtrar tags…"
          className={css.advancedInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && suggestions.length > 0) {
              e.preventDefault();               // stop form submission if any
              const first = suggestions[0];
              onTagSelect(first, true);         // add to active
              setAdvancedQuery('');             // clear
              setSuggestions([]);               // close dropdown
            }
          }}
        />
        <Dropdown<string>
          open={suggestions.length > 0}
          items={suggestions}
          render={t => t}              
          onPick={t => {
            onTagSelect(t, true);     
            setAdvancedQuery('');      
            setSuggestions([]);         
          }}
        />
      </div>
    )}
  </>
);
}