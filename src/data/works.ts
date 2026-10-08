/**
 * Portfolio.
 *
 * Los títulos y categorías están acá porque son nombres propios de pieza, no
 * texto a traducir. Para cargar trabajo real: pisá `image`, agregá `video`
 * (loop mudo corto para el hover) y `full` (la pieza completa, archivo local
 * o Vimeo/YouTube por ID).
 */
export type Work = {
  id: string;
  n: string;
  title: string;
  category: string;
  year: number;
  image: string;
  /** Loop mudo de 4–8s para el hover. */
  video?: string;
  /** Pieza completa que abre el modal. */
  full?: { kind: "file" | "vimeo" | "youtube"; src: string };
  poster?: string;
};

export const WORKS: Work[] = [
  {
    id: "a-new-reality",
    n: "01",
    title: "A NEW REALITY",
    category: "AI FILM / COMMERCIAL",
    year: 2026,
    image: "/images/work-01.jpg",
    video: "/videos/project-01.mp4",
    poster: "/images/poster-project-01.jpg",
    full: { kind: "file", src: "/videos/project-01.mp4" },
  },
  {
    id: "the-next-icon",
    n: "02",
    title: "THE NEXT ICON",
    category: "COMMERCIAL",
    year: 2026,
    image: "/images/work-02.jpg",
  },
  {
    id: "human-ai",
    n: "03",
    title: "HUMAN / AI",
    category: "DIGITAL CHARACTERS",
    year: 2026,
    image: "/images/work-03.jpg",
  },
  {
    id: "beyond-spaces",
    n: "04",
    title: "BEYOND SPACES",
    category: "VISUAL WORLDS",
    year: 2026,
    image: "/images/work-04.jpg",
  },
];
