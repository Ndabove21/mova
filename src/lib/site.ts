/**
 * Configuración única del sitio.
 *
 * ⚠️ PENDIENTE DE CLIENTE — reemplazar antes de publicar todo lo marcado
 * TODO_CLIENTE: WhatsApp, mail, redes y dominio.
 */

export const SITE_URL = "https://mova.studio"; // TODO_CLIENTE: dominio definitivo

export const CONTACT = {
  /** TODO_CLIENTE: número real, formato internacional, sin + ni espacios */
  whatsapp: "5493416000000",
  /** TODO_CLIENTE: mail real del estudio */
  email: "hello@mova.studio",
  instagram: "https://instagram.com/mova.studio", // TODO_CLIENTE
  linkedin: "", // TODO_CLIENTE
  youtube: "", // TODO_CLIENTE
  behance: "", // TODO_CLIENTE
} as const;

export function whatsappHref(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Las imágenes y videos de /public son placeholders generados: abstractos,
 * en la paleta de la marca, pensados para sostener la maqueta hasta que
 * llegue el material real. Con esto en true se dibuja una etiqueta discreta
 * con el nombre de archivo encima de cada media, para saber qué reemplazar.
 * Apagalo cuando entren los assets definitivos.
 */
export const SHOW_PLACEHOLDER_LABELS = true;

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
