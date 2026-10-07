/**
 * Configuración única del sitio.
 *
 * ⚠️ PENDIENTE DE CLIENTE — reemplazar antes de publicar:
 *    whatsapp, email, instagram, dominio real.
 * Todo lo marcado con TODO_CLIENTE está con un valor provisorio.
 */

export const SITE_URL = "https://mova.studio"; // TODO_CLIENTE: dominio definitivo

export const CONTACT = {
  /** TODO_CLIENTE: número real en formato internacional, sin + ni espacios */
  whatsapp: "5493416000000",
  /** TODO_CLIENTE: mail real del estudio */
  email: "hola@mova.studio",
  instagram: "https://instagram.com/mova.studio", // TODO_CLIENTE
  vimeo: "", // TODO_CLIENTE (opcional)
  linkedin: "", // TODO_CLIENTE (opcional)
} as const;

/** ¿Está la config lista para publicar? Se usa para avisar en dev. */
export const CONTACT_IS_PLACEHOLDER =
  CONTACT.whatsapp.endsWith("000000") || CONTACT.email.endsWith("mova.studio");

export function whatsappHref(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Video de fondo del hero. Dejalo en null hasta que haya reel real.
 * Cuando llegue: poné el archivo en public/video/hero.mp4 (mudo, loop,
 * ≤ 1920px, ≤ 6 MB — se precarga en todas las visitas) y apuntá acá.
 *   export const HERO_VIDEO = "/video/hero.mp4";
 */
export const HERO_VIDEO: string | null = null;
/** Poster del hero mientras carga el video (public/img/hero-poster.jpg). */
export const HERO_POSTER: string | null = null;
