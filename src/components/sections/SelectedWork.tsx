"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

import { useContacto } from "@/components/layout/ContactProvider";
import { CineImage } from "@/components/primitives/CineImage";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { VideoCard } from "@/components/primitives/VideoCard";
import { Rule } from "@/components/primitives/motion";
import { WORKS, type Work } from "@/data/works";
import type { Dictionary } from "@/i18n";

/** La curva de todo el sitio. Tipada como tupla porque Framer espera bezier. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Vimeo y YouTube se guardan por ID (ver `src/data/works.ts`). Igual tolera que
 * alguien pegue la URL entera: el embed se sigue armando bien en vez de
 * romperse en silencio (un iframe en negro, sin error visible).
 *
 * El parámetro `v` se lee ANTES de recortar la query porque la forma más común
 * de YouTube es `watch?v=ID`: si recortáramos primero, el último segmento de
 * la ruta sería `watch` y ese sería el "id".
 */
function idDeVideo(src: string) {
  const v = src.match(/[?&]v=([^&]+)/);
  if (v) return v[1];
  const limpio = src.split("?")[0].replace(/\/$/, "");
  return limpio.slice(limpio.lastIndexOf("/") + 1);
}

/**
 * `works.ts` todavía no declara pista de subtítulos porque no hay VTT de las
 * piezas. El tipo local la deja opcional —`Work["full"]` es asignable a esto—
 * para poder renderizar el <track> en cuanto el dato exista, sin tener que
 * tocar el modelo de datos desde acá.
 */
type PiezaCompleta = NonNullable<Work["full"]> & {
  captions?: { src: string; srcLang: string; label: string };
};

function urlEmbed(full: NonNullable<Work["full"]>) {
  const id = idDeVideo(full.src);
  return full.kind === "vimeo"
    ? `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`
    : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

/**
 * Lo que va dentro del marco del modal: archivo propio, embed, o —si la pieza
 * todavía no tiene corte final— el fotograma apagado con el cartel encima.
 * Vive afuera del componente para que el `switch` por tipo de fuente no
 * ensucie el árbol de la sección.
 */
function Reproductor({ pieza, soon }: { pieza: Work; soon: string }) {
  const full: PiezaCompleta | undefined = pieza.full;

  if (!full) {
    return (
      <>
        <CineImage
          src={pieza.image}
          alt=""
          className="absolute inset-0 h-full w-full"
          imgClassName="opacity-25"
          sizes="(min-width: 1024px) 1180px, 100vw"
          overlay={false}
        />
        <div className="absolute inset-0 grid place-items-center p-6">
          <span className="border border-line bg-black/50 px-5 py-3 text-[10px] tracking-[0.3em] text-ink-dim uppercase backdrop-blur-sm">
            {soon}
          </span>
        </div>
      </>
    );
  }

  if (full.kind === "file") {
    return (
      <video
        src={full.src}
        poster={pieza.poster}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full bg-black object-contain"
      >
        {/* WCAG 1.2.2: todo video con audio necesita subtítulos. Mientras las
            piezas sean placeholder no hay VTT que cargar, así que la pista sale
            sola en cuanto `works.ts` declare `full.captions`. */}
        {full.captions && (
          <track
            kind="captions"
            src={full.captions.src}
            srcLang={full.captions.srcLang}
            label={full.captions.label}
            default
          />
        )}
      </video>
    );
  }

  return (
    <iframe
      src={urlEmbed(full)}
      title={pieza.title}
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="absolute inset-0 h-full w-full border-0"
    />
  );
}

/**
 * 04 — SELECTED WORK.
 *
 * Portfolio en registro editorial, no grilla de tarjetas: una pieza de apertura
 * a 7 columnas que se mira como un afiche y, al lado, el resto como índice
 * tipográfico. La jerarquía la hace el tamaño, no el color.
 */
export function SelectedWork({ t }: { t: Dictionary }) {
  const { abrir } = useContacto();
  const reduce = useReducedMotion();

  const principal = WORKS[0];
  const resto = WORKS.slice(1);

  const [pieza, setPieza] = useState<Work | null>(null);
  /** Quién abrió el modal, para devolverle el foco al cerrar. */
  const disparador = useRef<HTMLElement | null>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  /** La caja del diálogo: delimita el ciclo de Tab. */
  const dialogo = useRef<HTMLDivElement>(null);

  const abrirPieza = useCallback((w: Work) => {
    disparador.current = document.activeElement as HTMLElement | null;
    setPieza(w);
  }, []);

  const cerrar = useCallback(() => setPieza(null), []);

  useEffect(() => {
    if (!pieza) return;

    const raiz = document.documentElement;
    // `lenis-stopped` es la clase que ya usa el resto del sitio para congelar
    // el scroll de fondo (globals.css + ContactProvider), pero sola no alcanza:
    // la regla es `.lenis.lenis-stopped`, así que no hace nada si Lenis está
    // apagado (prefers-reduced-motion), y con Lenis activo el primer gesto de
    // rueda dispara `updateClassName()`, que borra toda clase `lenis-*` que su
    // propio estado no justifique. El overflow inline sobrevive a eso y cubre
    // los dos casos; es el mismo patrón de Hero.tsx e IntroSection.tsx.
    raiz.classList.add("lenis-stopped");
    raiz.style.overflow = "hidden";
    cerrarRef.current?.focus();

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPieza(null);
        return;
      }
      // Trampa de foco: `aria-modal` no impide tabular al fondo, y el fondo
      // está tapado por un velo opaco. Sin el ciclo, el teclado termina
      // operando controles invisibles sin forma de volver al diálogo.
      if (e.key !== "Tab") return;
      const caja = dialogo.current;
      if (!caja) return;
      const focos = caja.querySelectorAll<HTMLElement>(
        'button, a[href], video[controls], iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (focos.length === 0) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    window.addEventListener("keydown", alTeclear);

    return () => {
      window.removeEventListener("keydown", alTeclear);
      raiz.classList.remove("lenis-stopped");
      raiz.style.overflow = "";
      const volver = disparador.current;
      // Sólo si sigue en el documento: si la fila se desmontó, un focus() sobre
      // un nodo huérfano manda el foco al body y se pierde el lugar de lectura.
      if (volver?.isConnected) volver.focus();
    };
  }, [pieza]);

  return (
    <section id="work" aria-labelledby="work-heading" className="relative bg-black py-28 sm:py-40 lg:py-48">
      {/* El oro entra como luz difusa detrás de la pieza de apertura, nunca
          como fondo. El wrapper recorta: el halo es más grande que la sección. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="glow-gold absolute top-[18%] -left-32 h-[540px] w-[540px] opacity-70 blur-2xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* El nombre de la sección ya está en el SectionLabel, pero el landmark
            necesita un encabezado real para la navegación por teclado. */}
        <h2 id="work-heading" className="sr-only">
          {t.work.label}
        </h2>

        <header className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionLabel index={t.work.index} label={t.work.label} />

          <div
            className="flex flex-col items-start gap-6 lg:items-end"
            data-reveal
            style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
          >
            <span className="max-w-[20rem] text-[10px] leading-[2] tracking-[0.25em] text-ink-faint uppercase lg:text-right">
              {t.work.meta}
            </span>
            <MagneticButton variant="ghost" icon="arrow" onClick={abrir}>
              {t.work.viewAll}
            </MagneticButton>
          </div>
        </header>

        <Rule className="mt-12 mb-14 sm:mt-16 sm:mb-20" delay={180} />

        <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-12">
          {/* ---------- Pieza de apertura ---------- */}
          <figure className="relative lg:col-span-7" data-reveal="blur">
            <VideoCard
              image={principal.image}
              video={principal.video}
              // El número va en el nombre accesible porque se dibuja GIGANTE
              // dentro del botón: WCAG 2.5.3 pide que el nombre contenga el
              // texto visible del control, y "visible" lo es aunque lleve
              // aria-hidden — eso oculta al lector, no a la vista.
              alt={`${principal.n} — ${principal.title} — ${principal.category}`}
              aspect="aspect-[4/3]"
              sizes="(min-width: 1024px) 58vw, 100vw"
              cursorLabel={t.cursor.play}
              onClick={() => abrirPieza(principal)}
            >
              {/* Número y disco de PLAY van DENTRO del botón de VideoCard, así
                  que son spans decorativos: un control dentro de otro control
                  rompe el foco y la lectura. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-3 left-5 font-serif text-[clamp(3.5rem,10vw,8rem)] leading-[0.8] text-ink/25 sm:top-5 sm:left-8"
              >
                {principal.n}
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-5 left-5 grid h-16 w-16 place-items-center rounded-full border border-ink/40 bg-black/30 text-ink backdrop-blur-sm transition-colors duration-700 ease-cine group-hover:border-gold/70 group-hover:text-gold sm:bottom-8 sm:left-8"
              >
                <Play className="h-4 w-4 translate-x-px fill-current" strokeWidth={0} />
              </span>
            </VideoCard>

            {/* El título queda FUERA del botón —un h3 no es contenido válido
                dentro de un button— y deja pasar el puntero, para que el click
                y el arranque del video sigan siendo del botón de abajo.

                En mobile el bloque se apoya en el borde inferior (donde los dos
                degradés apilados suman ~85% de negro) y esquiva el disco de PLAY
                con padding, no subiéndose: a 390px la caja 4/3 mide ~262px y a
                media altura el velo baja a ~45%, que no garantiza AA sobre una
                foto clara. El disco es h-16 a left-5, o sea termina a 84px: el
                pl-[5.5rem] (88px) lo despeja. El velo propio del `before:` es el
                seguro para cuando el título cae en tres líneas; de sm en adelante
                sobra, y ahí su borde superior recto sí se notaría. */}
            <figcaption className="pointer-events-none absolute inset-x-5 bottom-5 z-10 pl-[5.5rem] before:absolute before:-inset-x-5 before:-top-8 before:-bottom-5 before:-z-10 before:bg-gradient-to-t before:from-black/85 before:via-black/55 before:to-transparent sm:inset-x-8 sm:bottom-8 sm:pl-24 sm:before:hidden">
              <h3 className="font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.05] tracking-[-0.02em] text-ink">
                {principal.title}
              </h3>
              <p className="mt-3 text-[10px] tracking-[0.3em] text-ink-faint uppercase">
                {principal.category} <span className="text-gold">/</span> {principal.year}
              </p>
            </figcaption>
          </figure>

          {/* ---------- Índice ---------- */}
          <div className="lg:col-span-5">
            <ul className="border-b border-line-soft">
              {resto.map((w, i) => (
                <li
                  key={w.id}
                  className="group relative border-t border-line-soft"
                  data-reveal
                  // El escalonado sale del índice, no del reloj: cualquier dato
                  // de tiempo en render rompe la hidratación.
                  style={{ "--reveal-delay": `${120 + i * 110}ms` } as React.CSSProperties}
                >
                  <div className="flex items-center gap-4 py-6 sm:gap-6 sm:py-7">
                    <span className="w-6 shrink-0 text-[10px] tracking-[0.2em] text-ink-faint tabular-nums">
                      {w.n}
                    </span>

                    <div className="min-w-0 flex-1 transition-transform duration-700 ease-cine group-hover:translate-x-2">
                      <h3
                        id={`work-${w.id}`}
                        className="font-serif text-[1.5rem] leading-[1.1] tracking-[-0.02em] text-ink"
                      >
                        {w.title}
                      </h3>
                      <p className="mt-2 text-[10px] tracking-[0.25em] text-ink-faint uppercase">
                        {w.category}
                      </p>
                    </div>

                    <ArrowRight
                      aria-hidden="true"
                      className="hidden h-4 w-4 shrink-0 -translate-x-2 text-gold opacity-0 transition duration-700 ease-cine group-hover:translate-x-0 group-hover:opacity-100 sm:block"
                    />

                    <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden">
                      <CineImage
                        src={w.image}
                        alt=""
                        className="absolute inset-0 h-full w-full"
                        sizes="112px"
                        overlay={false}
                      />
                    </div>
                  </div>

                  {/* Botón estirado sobre toda la fila: el área de click es la
                      fila entera y el nombre accesible lo da el h3, que así
                      puede seguir siendo un encabezado de verdad. */}
                  <button
                    type="button"
                    onClick={() => abrirPieza(w)}
                    aria-labelledby={`work-${w.id}`}
                    data-cursor="media"
                    data-cursor-label={t.cursor.play}
                    className="absolute inset-0 z-10"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ---------- Modal ---------- */}
      <AnimatePresence>
        {pieza && (
          <motion.div
            key="work-modal"
            // Debajo del cursor propio (250) y encima del grano (200).
            className="fixed inset-0 z-[240] flex items-center justify-center px-4 py-14 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* El fondo cierra con click. No necesita ser un control: el teclado
                tiene Escape y el botón CERRAR, que recibe el foco al abrir. */}
            <div
              aria-hidden="true"
              onClick={cerrar}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            <motion.div
              ref={dialogo}
              role="dialog"
              aria-modal="true"
              aria-label={pieza.title}
              // Lenis no debe interpretar la rueda sobre el diálogo como scroll
              // de página: con el fondo congelado el gesto no tiene a dónde ir.
              data-lenis-prevent
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(14px)" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(10px)" }}
              transition={{ duration: 0.85, ease: EASE }}
              className="relative z-10 flex w-full max-w-[1180px] flex-col gap-6"
            >
              <div className="flex items-start justify-between gap-5 sm:gap-8">
                <div className="min-w-0">
                  <h3 className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.02em] text-ink">
                    {pieza.title}
                  </h3>
                  <p className="mt-2 text-[10px] tracking-[0.3em] text-ink-faint uppercase">
                    {pieza.category} <span className="text-gold">/</span> {pieza.year}
                  </p>
                </div>

                {/* A mano y no MagneticButton: no es un CTA, y acá hace falta la
                    ref para poner el foco inicial al abrir el modal. */}
                <button
                  ref={cerrarRef}
                  type="button"
                  onClick={cerrar}
                  data-cursor="link"
                  className="inline-flex shrink-0 items-center gap-3 rounded-full border border-line px-5 py-3 text-[10px] tracking-[0.2em] text-ink-dim uppercase transition-colors duration-500 ease-cine hover:border-gold/70 hover:text-gold"
                >
                  <svg
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                    className="h-2.5 w-2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path d="M1 1l10 10M11 1L1 11" />
                  </svg>
                  {t.work.close}
                </button>
              </div>

              {/* max-h en vez de recalcular el ancho: el marco se achata en
                  pantallas bajas y el video queda centrado con object-contain. */}
              <div className="relative aspect-video max-h-[70vh] w-full overflow-hidden border border-line bg-black-2">
                <Reproductor pieza={pieza} soon={t.work.soon} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
