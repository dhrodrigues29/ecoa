import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Lightbox.module.css";

type Props = {
  src: string;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};
export const Lightbox = ({ src, open, onClose, children }: Props) =>
  createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.content}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <button className={styles.close} onClick={onClose}>
              ✕
            </button>
            <img src={src} alt="" className={styles.image} />
            {children} {/* ← arrows */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
