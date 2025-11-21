// src/components/LazyImg.tsx
import { useState, useEffect } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export const LazyImg = (props: Props) => {
  const [src, setSrc] = useState('/img/poi/placeholder.webp');

  useEffect(() => {
    if (!props.src) return;
    const img = new Image();
    img.src = props.src;
    img.decode().then(() => setSrc(props.src!));
  }, [props.src]);

  return <img {...props} src={src} loading="lazy" decoding="async" />;
};