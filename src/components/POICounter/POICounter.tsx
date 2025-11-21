import type { FC } from 'react';
import css from './POICounter.module.css';

type Props = { total: number; filtered: number };

export const POICounter: FC<Props> = ({ total, filtered }) => {
  const display = filtered === total ? total : filtered;
  const formatted = new Intl.NumberFormat('pt-BR').format(display);
  return <div className={css.box}>{formatted} POIs Encontrados</div>;
};