// src/components/SearchBar/Dropdown.tsx
import { useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

type Props<T> = {
  items: T[];
  render: (item: T) => string;
  onPick: (item: T) => void;
  open: boolean;
};

export function Dropdown<T>({ items, render, onPick, open }: Props<T>) {
  if (!open || !items.length) return null;
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!open || !items.length) return null;

  return (
    <ul className={styles.dropdown}>
      {items.map((it, i) => (
        <li key={i} onMouseDown={() => onPick(it)}>
          {render(it)}
        </li>
      ))}
    </ul>
  );
}