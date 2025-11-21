import css from './Button.module.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, className = '', ...rest }: Props) => (
  <button className={`${css.btn} ${className}`} {...rest}>
    {children}
  </button>
);