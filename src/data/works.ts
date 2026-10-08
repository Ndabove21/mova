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
    // MATERIAL REAL del cliente (media/publicidad-modulos-master.mov):
    // una campaña de módulos habitacionales.
    //
    // El título vende la fantasía y no el producto, que es lo que hace la
    // pieza: no se ve un catálogo de módulos, se ve a alguien tomando café
    // frente a un lago. "MÓDULOS" describía el objeto; esto describe lo que
    // compra el cliente final. Si la campaña ya tiene nombre de marca, va acá.
    id: "habitar-el-bosque",
    n: "01",
    title: "HABITAR EL BOSQUE",
    cats: [1, 2],
    year: 2026,
    image: "/images/work-01.jpg",
    video: "/videos/project-01.mp4",
    poster: "/images/poster-project-01.jpg",
    full: { kind: "file", src: "/videos/showreel.mp4" },
  },
  {
    // Placeholder: pieza de relleno hasta que entre trabajo real.
    id: "el-proximo-icono",
    n: "02",
    title: "EL PRÓXIMO ÍCONO",
    cats: [1],
    year: 2026,
    image: "/images/work-02.jpg",
  },
  {
    id: "humano-ia",
    n: "03",
    title: "HUMANO / IA",
    cats: [3],
    year: 2026,
    image: "/images/work-03.jpg",
  },
  {
    id: "espacios-imposibles",
    n: "04",
    title: "ESPACIOS IMPOSIBLES",
    cats: [2],
    year: 2026,
    image: "/images/work-04.jpg",
  },
];
