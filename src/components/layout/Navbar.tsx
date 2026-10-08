"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { MarkGlyph } from "@/components/primitives/Wordmark";
import { Logotype } from "@/components/primitives/Logotype";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { useContacto } from "@/components/layout/ContactProvider";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/lib/site";

/** Curva de la casa. Tipada como tupla mutable porque Framer rechaza readonly. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Umbral de scroll: 24px alcanza para distinguir "arriba" de "ya scrolleó"
 *  sin que el fondo parpadee con el rebote elástico del trackpad. */
const UMBRAL = 24;

/**
 * El nombre del idioma de DESTINO, no del actual: el enlace se anuncia en la
 * lengua a la que lleva (va con lang/hrefLang). No sale del diccionario
 * porque no es copy del sitio sino la etiqueta accesible del propio switch,
 * y tiene que existir en los dos idiomas a la vez.
 */
const DESTINO_IDIOMA: Record<Locale, string> = {
  es: "Cambiar a español",
  en: "Switch to English",
};

export function Navbar({ t, lang }: { t: Dictionary; lang: Locale }) {
  const { abrir } = useContacto();
  const reducido = useReducedMotion() ?? false;

  const [scrolleado, setScrolleado] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cabecera = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);

  const otro: Locale = lang === "es" ? "en" : "es";

  /* ---------------------------------------------------------------- scroll */
  // El estado se escribe sólo al cruzar el umbral: el listener corre en cada
  // frame de scroll y un setState por frame tiraría abajo el 60fps.
  useEffect(() => {
    const leer = () => {
      const pasado = window.scrollY > UMBRAL;
      setScrolleado((previo) => (previo === pasado ? previo : pasado));
    };
    leer(); // por si la página entra ya scrolleada (recarga a media altura)
    window.addEventListener("scroll", leer, { passive: true });
    return () => window.removeEventListener("scroll", leer);
  }, []);

  /* ------------------------------------------------------------ menú móvil */
  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

  const cerrarYDevolverFoco = useCallback(() => {
    setMenuAbierto(false);
    disparador.current?.focus();
  }, []);

  // Bloqueo del scroll de fondo.
  //
  // El candado real es el style inline, NO la clase: `lenis-stopped` sola no
  // alcanza por dos motivos. (1) La regla de globals.css es
  // `.lenis.lenis-stopped`, y exige las dos clases; con
  // prefers-reduced-motion SmoothScroll no construye Lenis, así que `lenis`
  // nunca llega al <html> y la regla no matchea nunca. (2) Con Lenis andando,
  // su updateClassName() borra del <html> toda clase `lenis*` y reaplica sólo
  // la suya en cada transición de isScrolling/isStopped/isLocked: una rueda
  // sobre la barra del nav (que está por encima del panel y por lo tanto
  // fuera de su data-lenis-prevent) alcanza para que pise la clase puesta a
  // mano y el fondo vuelva a scrollear. Lenis sólo toca classList, nunca el
  // style, así que el overflow inline sobrevive. La clase queda igual por
  // compatibilidad con el resto del sistema.
  useEffect(() => {
    if (!menuAbierto) return;
    const raiz = document.documentElement;
    const previo = raiz.style.overflow;
    raiz.classList.add("lenis-stopped");
    raiz.style.overflow = "hidden";
    return () => {
      raiz.classList.remove("lenis-stopped");
      raiz.style.overflow = previo;
    };
  }, [menuAbierto]);

  // Foco al abrir: al primer control del panel.
  useEffect(() => {
    if (!menuAbierto) return;
    panel.current?.querySelector<HTMLElement>("a[href], button")?.focus();
  }, [menuAbierto]);

  // Escape + trampa de foco. La trampa se arma sobre TODA la cabecera y no
  // sólo sobre el panel, porque el botón que lo abrió queda fuera del panel
  // en el DOM pero es parte visual del menú abierto.
  useEffect(() => {
    if (!menuAbierto) return;
    const raiz = cabecera.current;
    if (!raiz) return;

    const focables = () =>
      Array.from(raiz.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"))
        // getClientRects descarta de una lo que está en display:none —los
        // enlaces de escritorio en mobile— sin hacer getComputedStyle.
        .filter((el) => el.getClientRects().length > 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        cerrarYDevolverFoco();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focables();
      if (items.length === 0) return;
      const primero = items[0];
      const ultimo = items[items.length - 1];
      const activo = document.activeElement;
      const adentro = raiz.contains(activo);

      if (e.shiftKey && (activo === primero || !adentro)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (activo === ultimo || !adentro)) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuAbierto, cerrarYDevolverFoco]);

  // Si la ventana crece hasta escritorio con el menú abierto, el panel sobra
  // y dejaría el scroll bloqueado contra un menú que ya no se ve.
  useEffect(() => {
    if (!menuAbierto) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const revisar = () => {
      if (mq.matches) cerrarMenu();
    };
    revisar();
    mq.addEventListener("change", revisar);
    return () => mq.removeEventListener("change", revisar);
  }, [menuAbierto, cerrarMenu]);

  /* ------------------------------------------------------------- acciones */
  const abrirContacto = () => {
    setMenuAbierto(false);
    abrir();
  };

  // Lenis intercepta los clicks en a[href^="#"] a nivel document, o sea
  // DESPUÉS de este handler. Suelto el bloqueo a mano —las dos cosas, clase y
  // style— para que el html ya esté scrolleable cuando Lenis calcule el salto;
  // la limpieza del efecto llega demasiado tarde para eso.
  const irAlAncla = () => {
    const raiz = document.documentElement;
    raiz.classList.remove("lenis-stopped");
    raiz.style.overflow = "";
    setMenuAbierto(false);
    // El <a> que tenía el foco se desmonta con el panel y el foco caería a
    // <body>: lo devuelvo a la hamburguesa, como hacen Escape y CERRAR.
    // preventScroll para no pelearme con el scrollTo que dispara Lenis.
    disparador.current?.focus({ preventScroll: true });
  };

  const etiquetaIdioma = `${t.otherLocaleLabel} — ${DESTINO_IDIOMA[otro]}`;

  // Entre sm y md la hamburguesa y el panel conviven con la barra, y el <nav>
  // queda por encima del panel: sin esto se verían dos CTA y dos switches de
  // idioma al mismo tiempo, los de la barra y los del panel.
  const visibleEnBarra = menuAbierto ? "hidden" : "hidden sm:inline-block";

  return (
    <header
      ref={cabecera}
      /* El panel móvil vive dentro de la cabecera, así que hereda su contexto
         de apilamiento. En z-[90] quedaba por debajo de la viñeta (190) y del
         grano (200), que son fixed sobre <body>: a pantalla completa la viñeta
         le tiraba 0.6 de negro encima y se comía el contraste de los índices y
         los titulares. Con el menú abierto subo a z-[210] —por encima de las
         decorativas, por debajo de los overlays z-[240]— y vuelvo a z-[90] al
         cerrar, que es lo que deja la capa de contacto (z-[140]) tapando el
         nav como corresponde. */
      className={`fixed inset-x-0 top-0 ${menuAbierto ? "z-[210]" : "z-[90]"}`}
    >
      {/* Fondo en capa aparte: un backdrop-filter no transiciona de 0 a 24px
          de forma pareja, así que lo que se anima es la opacidad de la capa. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border-b border-line bg-black/70 backdrop-blur-xl transition-opacity duration-500 ${
          scrolleado ? "opacity-100" : "opacity-0"
        }`}
      />

      <nav
        aria-label={t.nav.menu}
        className={`relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-5 transition-[padding] duration-500 sm:px-8 lg:px-12 ${
          scrolleado ? "py-3.5" : "py-5 sm:py-6"
        }`}
      >
        {/* ------------------------------------------------- marca (izquierda) */}
        <Link
          href={`/${lang}`}
          data-cursor="link"
          className="group flex shrink-0 items-center gap-3"
        >
          <MarkGlyph className="h-6 w-6 transition-transform duration-700 ease-cine group-hover:rotate-180" />
          <Logotype className="h-[15px] w-auto" priority sizes="140px" />
        </Link>

        {/* --------------------------------------------------- enlaces (centro) */}
        <ul className="hidden items-center gap-9 md:flex">
          {t.nav.links.map((enlace) => (
            <li key={enlace.id}>
              <a
                href={`#${enlace.id}`}
                data-cursor="link"
                className="text-[11px] uppercase tracking-[0.22em] text-ink-dim transition-colors duration-500 hover:text-ink"
              >
                {enlace.label}
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={abrir}
              data-cursor="link"
              className="text-[11px] uppercase tracking-[0.22em] text-ink-dim transition-colors duration-500 hover:text-ink"
            >
              {t.nav.contact}
            </button>
          </li>
        </ul>

        {/* ---------------------------------------------------- idioma + CTA */}
        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <Link
            href={`/${otro}`}
            hrefLang={otro}
            lang={otro}
            aria-label={etiquetaIdioma}
            data-cursor="link"
            className={`${visibleEnBarra} text-[10px] uppercase tracking-[0.3em] text-ink-faint transition-colors duration-500 hover:text-gold`}
          >
            {t.otherLocaleLabel}
          </Link>

          {/* div y no span: MagneticButton renderiza un motion.div, y un div
              dentro de un span es HTML inválido. El padre es flex, así que el
              layout no cambia. */}
          <div className={visibleEnBarra}>
            <MagneticButton variant="outline" icon="arrow" onClick={abrirContacto}>
              {t.nav.cta}
            </MagneticButton>
          </div>

          {/* Hamburguesa dibujada a mano: dos filetes de 1px que giran hasta
              formar la cruz. Mismo peso que el resto de los filetes del sitio. */}
          <button
            ref={disparador}
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? t.nav.close : t.nav.menu}
            aria-expanded={menuAbierto}
            data-cursor="link"
            className="group relative -mr-2 grid h-10 w-10 place-items-center md:hidden"
          >
            <span
              aria-hidden="true"
              className={`absolute h-px w-[18px] bg-ink transition-[transform,background-color] duration-500 ease-cine group-hover:bg-gold ${
                menuAbierto ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px w-[18px] bg-ink transition-[transform,background-color] duration-500 ease-cine group-hover:bg-gold ${
                menuAbierto ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* ------------------------------------------------------- panel móvil */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducido ? 0 : 0.6, ease: EASE }}
            className="fixed inset-0 z-0 flex flex-col overflow-y-auto overscroll-contain bg-black/95 backdrop-blur-2xl"
          >
            {/* Halo difuso: la única presencia del oro acá es como luz. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="glow-gold absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-2xl" />
            </div>

            <div className="relative flex min-h-full flex-col px-5 pb-12 pt-[104px] sm:px-8">
              <ul className="flex flex-col">
                {t.nav.links.map((enlace, i) => (
                  <motion.li
                    key={enlace.id}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reducido ? 0 : 0.9,
                      delay: reducido ? 0 : 0.06 + i * 0.07,
                      ease: EASE,
                    }}
                    className="border-b border-line-soft"
                  >
                    <a
                      href={`#${enlace.id}`}
                      onClick={irAlAncla}
                      data-cursor="link"
                      className="group flex items-baseline gap-5 py-5"
                    >
                      <span className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                        {`0${i + 1}`}
                      </span>
                      <span className="font-serif text-[clamp(2rem,9vw,3.2rem)] leading-[1.02] tracking-[-0.025em] text-ink transition-colors duration-500 group-hover:text-gold">
                        {enlace.label}
                      </span>
                    </a>
                  </motion.li>
                ))}

                <motion.li
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reducido ? 0 : 0.9,
                    delay: reducido ? 0 : 0.06 + t.nav.links.length * 0.07,
                    ease: EASE,
                  }}
                  className="border-b border-line-soft"
                >
                  <button
                    type="button"
                    onClick={abrirContacto}
                    data-cursor="link"
                    className="group flex w-full items-baseline gap-5 py-5 text-left"
                  >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                      {`0${t.nav.links.length + 1}`}
                    </span>
                    <span className="font-serif text-[clamp(2rem,9vw,3.2rem)] leading-[1.02] tracking-[-0.025em] text-ink transition-colors duration-500 group-hover:text-gold">
                      {t.nav.contact}
                    </span>
                  </button>
                </motion.li>
              </ul>

              <div className="mt-auto flex flex-col gap-8 pt-14">
                <MagneticButton variant="solid" icon="arrow" onClick={abrirContacto}>
                  {t.nav.cta}
                </MagneticButton>

                <div className="hairline" />

                <div className="flex items-center justify-between">
                  <Link
                    href={`/${otro}`}
                    hrefLang={otro}
                    lang={otro}
                    aria-label={etiquetaIdioma}
                    onClick={cerrarMenu}
                    data-cursor="link"
                    className="text-[11px] uppercase tracking-[0.3em] text-ink-faint transition-colors duration-500 hover:text-gold"
                  >
                    {t.otherLocaleLabel}
                  </Link>

                  <button
                    type="button"
                    onClick={cerrarYDevolverFoco}
                    data-cursor="link"
                    className="text-[11px] uppercase tracking-[0.3em] text-ink-faint transition-colors duration-500 hover:text-ink"
                  >
                    {t.nav.close}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
