import type { FC } from "react";
import { Button } from "../Button"; // re-use the same button
import styles from "../TagBar/TagBar.module.css"; // same look
import css from "./ActiveTagsBar.module.css"; // layout only

type Props = {
  activeTags: Set<string>;
  onToggle: (name: string, on: boolean) => void;
};

export const ActiveTagsBar: FC<Props> = ({ activeTags, onToggle }) => {
  if (activeTags.size === 0) return null;

  return (
    <div className={css.bubble}>
      <span className={css.label}>Tags Ativas:</span>
      {Array.from(activeTags).map((name) => (
        <Button
          key={name}
          className={`${styles.tag} ${styles.pressed}`}
          onClick={() => onToggle(name, false)}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};
