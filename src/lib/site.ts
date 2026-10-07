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
 * El video de recepción: lo que se ve dentro del eclipse al entrar y lo que
 * ocupa la pantalla cuando el obturador se abre.
 *
 * ⚠️ HOY HAY UN PLACEHOLDER generado con ffmpeg (luz a la deriva sobre negro,
 * 16s en loop, 400 KB). NO es material del estudio: está para que el mecanismo
 * se pueda ver funcionando.
 *
 * Para poner el reel real sólo hay que pisar los dos archivos:
 *   public/video/hero.mp4      mudo, loop, ≤1920px, ≤6 MB (se descarga siempre)
 *   public/img/hero-poster.jpg mismo encuadre que el primer frame
 *
 * Conviene que el reel sea más oscuro que claro y sin texto quemado: encima
 * van el isologo y, más abajo, el titular.
 */
export const HERO_VIDEO: string | null = "/video/hero.mp4";
export const HERO_POSTER: string | null = "/img/hero-poster.jpg";
/** true mientras el video sea el generado por ffmpeg y no el del cliente. */
export const HERO_VIDEO_IS_PLACEHOLDER = true;
