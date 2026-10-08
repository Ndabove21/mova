import { SHOW_PLACEHOLDER_LABELS } from "@/lib/site";

/**
 * Etiqueta discreta con el nombre del archivo, encima de cada media
 * placeholder. Sirve para saber exactamente qué hay que reemplazar.
 * Se apaga entera con `SHOW_PLACEHOLDER_LABELS` en `src/lib/site.ts`.
 *
 * El nombre se dibuja con `content: attr(...)` desde CSS y no como texto del
 * DOM a propósito: varias de estas etiquetas viven dentro de un <button> (la
 * tarjeta de un proyecto), y WCAG 2.5.3 exige que el nombre accesible del
 * control contenga su texto VISIBLE — y el texto sigue siendo visible aunque
 * lleve aria-hidden. El contenido generado no cuenta como texto del elemento,
 * así que la etiqueta se ve y el control conserva su nombre.
 */
export function PlaceholderTag({ src, className = "" }: { src?: string; className?: string }) {
  if (!SHOW_PLACEHOLDER_LABELS || !src) return null;
  return <span aria-hidden="true" data-ph={src} className={`ph-tag ${className}`} />;
}
