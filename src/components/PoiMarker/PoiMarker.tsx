import css from "./Map.module.css"
type Props = {
  planLevel?: 0 | 1 | 2 | null;
  /* anything you need later – icon, onClick, etc. */
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export const PoiMarker = ({ planLevel = null, ...rest }: Props) => (
  <button className={css.marker} data-plan={planLevel} {...rest} />
);
