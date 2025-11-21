// src/screens/ConfirmPayment/PaymentForm.tsx
import { useState, useEffect } from 'react';
import styles from './ConfirmPayment.module.css';

type Props = {
  onValidChange: (valid: boolean) => void;
};

export default function PaymentForm({ onValidChange }: Props) {
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [holder, setHolder] = useState('');

  const isValid =
    number.length >= 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvv.length >= 3 &&
    holder.length > 3;

  useEffect(() => onValidChange(isValid), [isValid, onValidChange]);

  return (
    <div className={styles.form}>
      <input
        className={styles.input}
        placeholder="Número do cartão"
        value={number}
        onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))}
        maxLength={16}
      />
      <div className={styles.row}>
        <input
          className={styles.input}
          placeholder="MM/AA"
          value={expiry}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '');
            setExpiry(v.length >= 2 ? `${v.slice(0, 2)}/${v.slice(2, 4)}` : v);
          }}
          maxLength={5}
        />

        <div className={styles.cvv}>
          <input
            className={styles.input}
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
            maxLength={3}
        />
        </div>
      </div>
      <input
        className={styles.input}
        placeholder="Nome impresso no cartão"
        value={holder}
        onChange={(e) => setHolder(e.target.value)}
      />
    </div>
  );
}