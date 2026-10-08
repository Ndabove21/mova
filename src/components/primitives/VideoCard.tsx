"use client";

import { useRef, type ReactNode } from "react";
import { CineImage } from "./CineImage";

/**
 * Pieza de media con video en hover.
 *
 * En reposo muestra el poster —una imagen, que pesa nada—; recién al pasar el
 * puntero o al recibir foco de teclado arranca el loop mudo. El video lleva
 * `preload="none"` a propósito: una grilla de seis tarjetas que precargaran
 * video serían varios MB antes de que nadie toque nada.
 */
export function VideoCard({
  image,
  video,
  alt,
  className = "",
  aspect = "aspect-[16/9]",
  sizes = "100vw",
  priority = false,
  onClick,
  cursorLabel,
  children,
}: {
  image: string;
  video?: string;
  alt: string;
  className?: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  onClick?: () => void;
  /** Texto que muestra el cursor al pasar por encima (PLAY, WATCH…). */
  cursorLabel?: string;
  /** Contenido sobre la pieza: título, categoría, número. */
  children?: ReactNode;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  const entrar = () => ref.current?.play().catch(() => {});
  const salir = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const cuerpo = (
    <div className={`group relative w-full overflow-hidden ${aspect}`}>
      <CineImage
        src={image}
        alt={alt}
        className="absolute inset-0 h-full w-full"
        sizes={sizes}
        priority={priority}
      />
      {video && (
        <video
          ref={ref}
          src={video}
          poster={image}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"
      />
      {children}
    </div>
  );

  if (!onClick) return <div className={className}>{cuerpo}</div>;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={entrar}
      onMouseLeave={salir}
      onFocus={entrar}
      onBlur={salir}
      data-cursor={cursorLabel ? "media" : "link"}
      data-cursor-label={cursorLabel}
      aria-label={alt}
      className={`block w-full text-left ${className}`}
    >
      {cuerpo}
    </button>
  );
}
