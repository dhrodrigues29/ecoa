// src/screens/ConfirmPayment/ConfirmPayment.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '../../app/router';
import MethodSelector from './MethodSelector';
import PaymentForm from './PaymentForm';
import { containerVariants } from './ConfirmPayment.animations';
import styles from './ConfirmPayment.module.css';
import { QRCodeSVG } from 'qrcode.react';

type Props = {
  value: number; // passed by router
};

const PIX_CODES: Record<string, string> = {
  basico: '00020126360014BR.GOV.BCB.PIX0114+5551999993531520400005303986540529.995802BR5919Davi Haas Rodrigues6012Porto Alegre62180514AssPremEcoaPoa63047E3F',
  intermediario: '00020126360014BR.GOV.BCB.PIX0114+5551999993531520400005303986540559.995802BR5919Davi Haas Rodrigues6012Porto Alegre62180514AssPremEcoaPoa6304F809',
  premium: '00020126360014BR.GOV.BCB.PIX0114+5551999993531520400005303986540599.995802BR5919Davi Haas Rodrigues6012Porto Alegre62180514AssPremEcoaPoa6304369D',
};

export const METHODS = ['Cartão de crédito', 'PIX', 'Boleto'] as const;
export type Method = typeof METHODS[number];

export default function ConfirmPayment({}: Props) {
  const { push, pop, payload } = useRouter();
  const { planKey, value = 0, id } = (payload as any) || {};
  const brCode = PIX_CODES[planKey] || PIX_CODES.basico;
  const [method, setMethod] = useState<Method>('Cartão de crédito');
  const [canConfirm, setCanConfirm] = useState(false);
  const copyQr = () => navigator.clipboard.writeText(brCode);

  const goBack = () => pop();

  const handleConfirm = () => {
    // TODO: real payment integration
    alert(`ID: ${id}  –  Pagamento de R$${value.toFixed(2)} via ${method} confirmado!`);    
    window.localStorage.removeItem('partnerId'); // clean-up
    pop();
    pop();
  };

  return (
    <motion.section
      className={styles.screen}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.content}>
        <h2 className={styles.heading}>Pagamento</h2>

        <div className={styles.planBox}>
          <span className={styles.label}>Plano escolhido</span>
          <span className={styles.price}>R$ {value.toFixed(2)}</span>
        </div>

        <MethodSelector methods={METHODS} selected={method} onSelect={setMethod} />

        {method === 'Cartão de crédito' && (
          <PaymentForm onValidChange={setCanConfirm} />
        )}

        {method === 'PIX' && (
          <div className={styles.pixBox}>
            <QRCodeSVG value={brCode} size={200} />
            <button className={styles.copyBtn} onClick={copyQr}>Copiar QR Code</button>
          </div>
        )}

        {method === 'Boleto' && (
          <p className={styles.info}>Boleto gerado na finalização.</p>
        )}

        <div className={styles.actions}>
          <button className={styles.back} onClick={goBack}>
            Voltar
          </button>
          <button
            className={styles.confirm}
            onClick={handleConfirm}
            disabled={!canConfirm && method === 'Cartão de crédito'}
          >
            Confirmar
          </button>
        </div>
      </div>
    </motion.section>
  );
}