// src/screens/ConfirmPayment/MethodSelector.tsx
import styles from './ConfirmPayment.module.css';
import type { Method } from './ConfirmPayment';

// MethodSelector.tsx
type Props = {
  methods: readonly Method[];   // same union
  selected: Method;
  onSelect: (m: Method) => void; // ← not string
};

export default function MethodSelector({ methods, selected, onSelect }: Props) {
  return (
    <div className={styles.methodGroup}>
      <label className={styles.label}>Forma de pagamento</label>
      <div className={styles.methodGrid}>
        {methods.map((m) => (
          <button
            key={m}
            className={`${styles.method} ${selected === m ? styles.active : ''}`}
            onClick={() => onSelect(m)}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}