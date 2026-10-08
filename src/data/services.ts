/**
 * Servicios.
 *
 * El texto vive en `src/i18n` (clave `services.items[i]`); acá sólo el media.
 * Para cambiar una pieza, pisá el archivo en `public/images/service-0X.jpg`
 * o agregá `video` con un loop mudo en `public/videos/`.
 */
export type Service = {
  id: "films" | "commercials" | "worlds" | "characters" | "social";
  n: string;
  image: string;
  /** Loop mudo que arranca en hover. Opcional. */
  video?: string;
};

export const SERVICES: Service[] = [
  { id: "films", n: "01", image: "/images/service-01.jpg" },
  { id: "commercials", n: "02", image: "/images/service-02.jpg" },
  { id: "worlds", n: "03", image: "/images/service-03.jpg" },
  { id: "characters", n: "04", image: "/images/service-04.jpg" },
  { id: "social", n: "05", image: "/images/service-05.jpg" },
];
