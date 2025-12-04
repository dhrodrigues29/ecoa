import { useState, useEffect } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  placeholder?: string;
};

export const LazyImg = ({ placeholder = '/img/poi/placeholder.webp', ...props }: Props) => {
  const [src, setSrc] = useState(placeholder);

  useEffect(() => {
    if (!props.src) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = props.src;
    img.decode()
      .then(() => setSrc(props.src!))
      .catch(() => setSrc(props.src!)); // fallback on error
  }, [props.src]);

  return <img {...props} src={src} loading="lazy" decoding="async" />;
};