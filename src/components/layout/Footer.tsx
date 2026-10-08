"use client";

import Link from "next/link";

import { Logotype } from "@/components/primitives/Logotype";
import { Rule } from "@/components/primitives/motion";
import { useContacto } from "@/components/layout/ContactProvider";
import type { Dictionary } from "@/i18n";
import { CONTACT, type Locale } from "@/lib/site";

/**
 * El pie es el último plano de la película: no compite con nada. Sólo marca,
 * navegación y los datos para escribir. Toda la jerarquía la hace el tamaño
 * de la tipografía y un único filete; no hay cajas, fondos ni bordes.
 *
 * El archivo entero va como client component por un solo motivo: el enlace de
 * contacto abre la capa de `ContactProvider`, y ese hook necesita cliente.
 * Dividirlo en dos archivos ahorraría unos pocos kB de un componente que ya
 * es casi todo texto estático, a cambio de partir el pie en dos piezas.
 */

/**
 * El nombre del idioma de DESTINO. No sale del diccionario porque no es copy
 * del sitio sino el nombre accesible del propio switch: tiene que existir en
 * los dos idiomas a la vez, sin importar en cuál esté la página.
 */
const DESTINO_IDIOMA: Record<Locale, string> = {
  es: "Cambiar a español",
  en: "Switch to English",
};

export function Footer({ t, lang }: { t: Dictionary; lang: Locale }) {
  const { abrir } = useContacto();

  const otro: Locale = lang === "es" ? "en" : "es";

  /** Nombre visible + propósito: WCAG 2.5.3 pide que el nombre accesible
   *  contenga el texto que se ve, y "EN" solo no dice a dónde lleva. */
  const etiquetaIdioma = `${t.otherLocaleLabel} — ${DESTINO_IDIOMA[otro]}`;

  /**
   * Los nombres de las redes son marcas registradas, no copy traducible: por
   * eso están acá y no en el diccionario. Se filtran las que todavía no tienen
   * perfil cargado para no dejar enlaces muertos en la entrega.
   */
  const redes = [
    { id: "instagram", label: "INSTAGRAM", href: CONTACT.instagram },
    { id: "linkedin", label: "LINKEDIN", href: CONTACT.linkedin },
    { id: "youtube", label: "YOUTUBE", href: CONTACT.youtube },
    { id: "behance", label: "BEHANCE", href: CONTACT.behance },
  ].filter((red) => Boolean(red.href));

  /* Mismo tratamiento para todo lo cliqueable del pie: el oro aparece sólo en
     hover, como acento de luz, nunca como color de reposo. */
  const enlace =
    "text-[11px] uppercase tracking-[0.1em] text-ink-dim transition-colors duration-500 hover:text-gold";

  const rotulo = "text-[10px] uppercase tracking-[0.3em] text-ink-faint";

  return (
    <footer className="relative overflow-hidden border-t border-line-soft bg-black">
      {/* Única presencia de luz: un halo muy difuso detrás de la marca, para
          que el bloque inferior no se lea como un corte seco a negro. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="glow-gold absolute -bottom-56 -left-32 h-[560px] w-[560px] rounded-full opacity-40 blur-2xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        {/* ------------------------------------------------------ fila superior */}
        <div className="grid gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-12">
          {/* Marca */}
          <div
            data-reveal
            className="sm:col-span-2 lg:col-span-5"
          >
            <Logotype className="h-6 w-auto" sizes="200px" />
            <p className="mt-6 text-[10px] uppercase tracking-[0.46em] text-ink-faint">
              {t.brand.descriptor}
            </p>
          </div>

          {/* Navegación: son las mismas anclas del nav, así que va como nav. */}
          <nav
            aria-label={t.footer.studio}
            data-reveal
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
            className="lg:col-span-3"
          >
            <h2 className={rotulo}>{t.footer.studio}</h2>
            <ul className="mt-6 flex flex-col gap-3.5">
              {t.nav.links.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} data-cursor="link" className={enlace}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                {/* El contacto no es una URL: abre la capa sobre la página. */}
                <button type="button" onClick={abrir} data-cursor="link" className={enlace}>
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </nav>

          {/* Redes y mail. No es nav: son destinos externos, no la navegación
              del sitio. El h2 ya le da nombre a la lista. */}
          <div
            data-reveal
            style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
            className="lg:col-span-4"
          >
            <h2 className={rotulo}>{t.footer.social}</h2>
            <ul className="mt-6 flex flex-col gap-3.5">
              {redes.map((red) => (
                <li key={red.id}>
                  <a
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className={enlace}
                  >
                    {red.label}
                  </a>
                </li>
              ))}
              <li>
                {/* El mail se escribe tal cual es: en mayúsculas forzadas una
                    dirección deja de leerse como dirección. */}
                <a
                  href={`mailto:${CONTACT.email}`}
                  data-cursor="link"
                  className="text-[11px] tracking-[0.1em] text-ink-dim transition-colors duration-500 hover:text-gold"
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Rule className="my-10" />

        {/* ------------------------------------------------------ fila inferior */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] uppercase tracking-[0.1em] text-ink-faint">{t.footer.rights}</p>

          <div className="flex items-center gap-7">
            <Link
              href={`/${otro}`}
              hrefLang={otro}
              lang={otro}
              aria-label={etiquetaIdioma}
              data-cursor="link"
              className="text-[11px] uppercase tracking-[0.1em] text-ink-faint transition-colors duration-500 hover:text-gold"
            >
              {t.otherLocaleLabel}
            </Link>

            <a
              href="#top"
              data-cursor="link"
              className="text-[11px] uppercase tracking-[0.1em] text-ink-faint transition-colors duration-500 hover:text-ink"
            >
              {t.footer.backToTop}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
