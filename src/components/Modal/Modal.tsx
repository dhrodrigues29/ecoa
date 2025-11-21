import { ReactNode } from 'react';
import css from './Modal.module.css';

type Props = {
open: boolean;
onClose:() => void;
children: ReactNode;
};

export const Modal = ({ open, onClose, children }: Props) => {
    if (!open) return null;
return ( <div className={css.backdrop} onClick={onClose}></div>);};
