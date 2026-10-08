/**
 * Portfolio.
 *
 * Los TÍTULOS están acá porque son nombres propios de cada pieza —como el
 * título de una película, no se traducen—. Las CATEGORÍAS, en cambio, son
 * taxonomía del sitio: se guardan como índices al catálogo de servicios y el
 * texto sale del diccionario, así siguen el idioma elegido. Para cargar trabajo real: pisá `image`, agregá `video`
 * (loop mudo corto para el hover) y `full` (la pieza completa, archivo local
 * o Vimeo/YouTube por ID).
 */
export type Work = {
  id: string;
  n: string;
  title: string;
  /** Índices dentro de `services.items` del diccionario. La categoría es
   *  taxonomía del sitio, no nombre propio: tiene que traducirse. */
  cats: number[];
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
    // MATERIAL REAL del cliente (media/publicidad-modulos-master.mov).
    // El título sale del nombre que le puso él al archivo; si el proyecto
    // tiene nombre de marca, va acá.
    id: "modulos",
    n: "01",
    title: "MÓDULOS",
    cats: [1, 2],
    year: 2026,
    image: "/images/work-01.jpg",
    video: "/videos/project-01.mp4",
    poster: "/images/poster-project-01.jpg",
    full: { kind: "file", src: "/videos/showreel.mp4" },
  },
  {
    id: "the-next-icon",
    n: "02",
    title: "THE NEXT ICON",
    cats: [1],
    year: 2026,
    image: "/images/work-02.jpg",
  },
  {
    id: "human-ai",
    n: "03",
    title: "HUMAN / AI",
    cats: [3],
    year: 2026,
    image: "/images/work-03.jpg",
  },
  {
    id: "beyond-spaces",
    n: "04",
    title: "BEYOND SPACES",
    cats: [2],
    year: 2026,
    image: "/images/work-04.jpg",
  },
];
