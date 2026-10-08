import Image from "next/image";
import { PlaceholderTag } from "./PlaceholderTag";

/**
 * Imagen en clave cinematográfica.
 *
 * Centraliza tres cosas que si no se repiten mal en cada sección: `next/image`
 * con `sizes` correcto, el tratamiento `.img-cine` (desaturada en reposo, viva
 * en hover del grupo) y la etiqueta de placeholder.
 */
export function CineImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  sizes = "100vw",
  priority = false,
  quality = 82,
  overlay = true,
}: {
  src: string;
  /** Vacío si la imagen es decorativa y el texto ya está en el DOM. */
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  /** Velo inferior para que el texto encima siempre tenga contraste. */
  overlay?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={`img-cine object-cover ${imgClassName}`}
      />
      {overlay && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent"
        />
      )}
      <PlaceholderTag src={src} />
    </div>
  );
}
