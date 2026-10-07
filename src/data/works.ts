/**
 * Portfolio.
 *
 * ⚠️ Hoy son SLOTS. Cuando lleguen los videos del estudio, reemplazá cada
 * entrada: borrás `placeholder`, ponés `preview` + `poster` y, si hay pieza
 * larga, `full`.
 *
 * Dónde van los archivos:
 *   public/video/<slug>-preview.mp4   → loop mudo de 4–8s, ~1200px de ancho, <2 MB
 *   public/video/<slug>.mp4           → pieza completa (opcional si va por Vimeo)
 *   public/img/work/<slug>.jpg        → poster, mismo encuadre que el primer frame
 *
 * Si la pieza vive en Vimeo o YouTube, no hace falta subir nada:
 *   full: { kind: "vimeo", src: "76979871" }
 */

export type WorkCategory = "spot" | "social" | "music" | "avatar";

export type Work = {
  slug: string;
  title: { es: string; en: string };
  client: string;
  year: number;
  category: WorkCategory;
  /** Relación de aspecto de la tarjeta. */
  aspect: "16/9" | "9/16" | "4/5";
  /** Loop mudo que arranca al hacer hover. */
  preview?: string;
  /** Imagen de reposo. */
  poster?: string;
  /** Pieza completa que abre el modal. */
  full?: { kind: "file" | "vimeo" | "youtube"; src: string };
  /** Ocupa dos columnas en desktop. */
  wide?: boolean;
  /** true = todavía no hay material; se dibuja una tarjeta de reserva. */
  placeholder?: boolean;
  /** Tinte del slot mientras es placeholder. */
  tint?: "gold" | "halo" | "steel";
};

export const CATEGORY_LABELS: Record<WorkCategory, { es: string; en: string }> = {
  spot: { es: "Spot", en: "Commercial" },
  social: { es: "Redes", en: "Social" },
  music: { es: "Música", en: "Music" },
  avatar: { es: "Avatar", en: "Avatar" },
};

export const WORKS: Work[] = [
  {
    slug: "spot-01",
    title: { es: "Spot de lanzamiento", en: "Launch commercial" },
    client: "MOVA",
    year: 2026,
    category: "spot",
    aspect: "16/9",
    wide: true,
    placeholder: true,
    tint: "gold",
  },
  {
    slug: "social-01",
    title: { es: "Campaña vertical", en: "Vertical campaign" },
    client: "MOVA",
    year: 2026,
    category: "social",
    aspect: "9/16",
    placeholder: true,
    tint: "halo",
  },
  {
    slug: "music-01",
    title: { es: "Visuales para show", en: "Show visuals" },
    client: "MOVA",
    year: 2026,
    category: "music",
    aspect: "4/5",
    placeholder: true,
    tint: "steel",
  },
  {
    slug: "avatar-01",
    title: { es: "Presentador digital", en: "Digital presenter" },
    client: "MOVA",
    year: 2026,
    category: "avatar",
    aspect: "9/16",
    placeholder: true,
    tint: "gold",
  },
  {
    slug: "spot-02",
    title: { es: "Pieza de producto", en: "Product film" },
    client: "MOVA",
    year: 2026,
    category: "spot",
    aspect: "16/9",
    placeholder: true,
    tint: "halo",
  },
  {
    slug: "social-02",
    title: { es: "Serie de reels", en: "Reel series" },
    client: "MOVA",
    year: 2026,
    category: "social",
    aspect: "4/5",
    placeholder: true,
    tint: "steel",
  },
];

/** ¿Queda algún slot sin material real? Se usa para avisar en dev. */
export const WORKS_HAVE_PLACEHOLDERS = WORKS.some((w) => w.placeholder);
