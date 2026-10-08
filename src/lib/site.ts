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
 * Cómo se resuelve la recepción.
 *
 *   "render" — el isologo dibujado en vectores (primitives/LogoSting.tsx).
 *              Nítido a cualquier densidad, ~0 KB extra, y el descriptor y el
 *              claim son texto real que indexa Google.
 *   "video"  — el isologo animado que mandó el cliente. Es 1280×720, así que
 *              en una pantalla retina el hero lo escala 2,25× y se ablanda.
 *              Si algún día llega un master a 2560 o 3840, vuelve a convenir.
 */
export const HERO_MODE: "render" | "video" = "render";

/**
 * Recepción en video — hoy APAGADA (`HERO_MODE = "render"`).
 *
 * El master del cliente vive en `media/mova-logo-sting-source.mp4` y NO se
 * sirve: es 1280×720 y el hero lo pintaba a 2880 px físicos, así que se veía
 * blando. Los derivados se borraron del bundle.
 *
 * Para volver al video —o para usar un master nuevo en 2560/3840— regenerá
 * los archivos y volvé a apuntar estas constantes:
 *
 *   ffmpeg -i media/<master>.mp4 -c:v libx264 -crf 25 -preset slow \
 *     -c:a aac -b:a 96k -movflags +faststart public/video/hero.mp4
 *   ffmpeg -i media/<master>.mp4 -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 \
 *     -c:a libopus -b:a 80k public/video/hero.webm
 *   ffmpeg -ss 6 -i media/<master>.mp4 -vframes 1 -q:v 3 public/img/hero-poster.jpg
 *
 * Después: HERO_VIDEO = "/video/hero.mp4", HERO_POSTER = "/img/hero-poster.jpg"
 * y HERO_MODE = "video".
 *
 * Original: lo que se ve dentro del eclipse al entrar y lo que
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
export const HERO_VIDEO: string | null = null;
export const HERO_POSTER: string | null = null;
