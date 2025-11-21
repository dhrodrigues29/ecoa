import { useRef } from 'react';
import { Button } from '../Button';
import css from './TagBar.module.css';
import { ALL_TAGS } from './tagData';

type Props = {
  activeTags: Set<string>;
  onTagSelect: (name: string, on: boolean) => void;
};

const TAGS = ALL_TAGS;

export const TagBar = ({ activeTags, onTagSelect }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggle = (t: string) => onTagSelect(t, !activeTags.has(t));

  const onWheel = (e: React.WheelEvent) => {
    if (!scrollRef.current) return;
    e.preventDefault();
    scrollRef.current.scrollLeft += e.deltaY;
  };

  return (
    <div className={css.bar}>
      <Button className={css.advanced} onClick={() => onTagSelect('+', true)}>
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
  );
};