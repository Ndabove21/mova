"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { X } from "lucide-react";

import { CineImage } from "@/components/primitives/CineImage";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { PlaceholderTag } from "@/components/primitives/PlaceholderTag";
import { RevealText } from "@/components/primitives/RevealText";
import type { Dictionary } from "@/i18n";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * El plano de apertura: una sola imagen a sangre con el titular encima.
 *
 * Es la sección más cinematográfica del sitio, así que no compite con nada:
 * ni grilla, ni tarjetas, ni número de sección. Un plano, un titular, un CTA.
 *
 * Tres decisiones que no son obvias:
 *
 * 1. La capa de media es un hermano ABSOLUTO del contenido, no su contenedor.
 *    Así el `data-cursor="media"` sólo se dispara sobre la imagen: el bloque de
 *    texto queda por encima con sus propios eventos y no miente diciendo WATCH
 *    sobre un párrafo. El wrapper del contenido va `pointer-events-none` para
 *    no tapar la imagen entera con su caja. El `group` y los handlers de hover,
 *    en cambio, van en la sección: si fueran de la capa de media, pasar el
 *    puntero por el titular cortaría el video a mitad de camino.
 * 2. El parallax se hace sobre una capa 16% más alta que la sección y corrida
 *    8% hacia arriba. El desplazamiento es ±4% de ESA altura (~±4,6% de la
 *    sección), así que nunca llega a destapar un borde.
 * 3. El modal de video es local a propósito. El hero tiene el suyo: compartir
 *    estado entre dos secciones obligaría a subirlo a un provider para un
 *    overlay que se ve dos veces en toda la visita.
 *
 * La sección NO lleva `isolate`: el modal es hijo suyo y necesita apilarse en
 * el contexto raíz, o cualquier elemento fijo de fuera —la navbar— le quedaría
 * encima. Tampoco hay `transform` en ningún ancestro del modal, que es lo que
 * rompería su `position: fixed`.
 */
export function IntroSection({ t }: { t: Dictionary }) {
  const seccion = useRef<HTMLElement>(null);
  const videoFondo = useRef<HTMLVideoElement>(null);
  const videoModal = useRef<HTMLVideoElement>(null);
  const dialogo = useRef<HTMLDivElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  /* La caja del CTA, para devolverle el foco cuando el modal se abrió desde la
     imagen (un div no focusable) o desde Safari, que no enfoca los <button> al
     hacer clic: en los dos casos `document.activeElement` era <body> y el foco
     quedaría tirado en la nada al cerrar. */
  const cajaCta = useRef<HTMLDivElement>(null);

  const [abierto, setAbierto] = useState(false);

  /* La preferencia se lee en un efecto, no durante el render: si se leyera en
     el render, el servidor y el cliente devolverían valores distintos y la
     hidratación se rompería justo para quien pidió menos movimiento. */
  const [reducido, setReducido] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducido(mq.matches);
    const alCambiar = (e: MediaQueryListEvent) => setReducido(e.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  const abrir = useCallback(() => setAbierto(true), []);

  const cerrar = useCallback(() => {
    /* Pausar ANTES de bajar el estado: AnimatePresence espera la salida más
       larga de sus hijos, así que el diálogo sigue montado durante el fundido
       y el audio del showreel seguiría sonando por encima de la página. */
    videoModal.current?.pause();
    setAbierto(false);
  }, []);

  /* Zoom lento + parallax atados al scroll de la propia sección. */
  const { scrollYProgress } = useScroll({
    target: seccion,
    offset: ["start end", "end start"],
  });
  const escala = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const deriva = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  /* El video de fondo arranca recién al pasar el puntero: en reposo pesa el
     poster y nada más. Con el modal abierto no tiene sentido que siga. */
  const entrarMedia = useCallback(() => {
    if (reducido || abierto) return;
    videoFondo.current?.play().catch(() => {});
  }, [reducido, abierto]);

  const salirMedia = useCallback(() => {
    const v = videoFondo.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }, []);

  useEffect(() => {
    if (abierto) salirMedia();
  }, [abierto, salirMedia]);

  /* Modal: Escape, foco atrapado adentro, scroll del fondo congelado y foco
     devuelto al elemento que lo abrió. `lenis-stopped` es la misma clase que
     usa la capa de contacto para frenar el scroll suave. */
  useEffect(() => {
    if (!abierto) return;

    const raiz = document.documentElement;
    const previo = document.activeElement as HTMLElement | null;
    botonCerrar.current?.focus();
    /* La clase es la que usa la capa de contacto, pero sólo hace efecto si
       Lenis está activo. El overflow inline cubre el caso contrario
       (prefers-reduced-motion apaga Lenis) y se devuelve al cerrar. */
    raiz.classList.add("lenis-stopped");
    raiz.style.overflow = "hidden";

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        /* Por `cerrar` y no por `setAbierto`: si no, salir con Escape dejaría
           el showreel sonando durante todo el fundido. */
        cerrar();
        return;
      }
      if (e.key !== "Tab") return;
      const caja = dialogo.current;
      if (!caja) return;
      const focos = caja.querySelectorAll<HTMLElement>(
        'button, a[href], video[controls], [tabindex]:not([tabindex="-1"])'
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

    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("keydown", alTeclear);
      raiz.classList.remove("lenis-stopped");
      raiz.style.overflow = "";
      /* <body> no es focusable: si el disparador fue la imagen, devolverle el
         foco ahí equivale a perderlo. El CTA es el ancla real de la sección. */
      const destino =
        previo && previo !== document.body
          ? previo
          : cajaCta.current?.querySelector<HTMLElement>("button");
      destino?.focus();
    };
  }, [abierto, cerrar]);

  return (
    <section
      ref={seccion}
      id="intro"
      aria-label={t.intro.title.join(" ")}
      className="group relative w-full overflow-hidden bg-black"
      onPointerEnter={entrarMedia}
      onPointerLeave={salirMedia}
    >
      {/* ── Plano ─────────────────────────────────────────────────────── */}
      {/* El cursor promete WATCH sobre toda la imagen, así que la imagen tiene
          que abrir el showreel: un anillo con etiqueta y sin acción se lee como
          un bug. No lleva rol ni tabindex a propósito —el camino accesible es
          el <button> del CTA, que hace exactamente lo mismo—; duplicarlo en el
          orden de tabulación sólo agregaría una parada muda. */}
      <div
        className="absolute inset-0 overflow-hidden"
        data-cursor="media"
        data-cursor-label={t.cursor.watch}
        onClick={abrir}
      >
        <motion.div
          style={reducido ? undefined : { y: deriva, scale: escala }}
          className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform"
        >
          {/* Decorativa: el titular ya dice lo que hay que leer acá. */}
          <CineImage
            src="/images/intro.jpg"
            alt=""
            className="absolute inset-0 h-full w-full"
            sizes="100vw"
            quality={88}
            overlay={false}
          />
          <video
            ref={videoFondo}
            src="/videos/intro.mp4"
            poster="/images/intro.jpg"
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            className="ease-cine absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
          />
        </motion.div>

        {/* Velo a la izquierda: es lo único que sostiene la legibilidad del
            titular sobre una imagen que no controlamos. En mobile el bloque de
            texto ocupa casi todo el ancho —el titular llega al 80-85%, donde el
            velo de escritorio ya está en ~0.20 de alfa— y justo ahí el
            object-cover deja la franja clara de la foto. Por eso el velo es más
            cerrado hasta sm; de sm en adelante vuelve la composición del spec,
            con el texto en el tercio izquierdo. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/35 sm:via-black/55 sm:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/35 to-transparent"
        />
        {/* El azul de la pileta, extendido fuera del encuadre. Iluminación,
            no relleno: difuso, lejos del texto y sin borde propio. */}
        <div
          aria-hidden="true"
          className="glow-blue pointer-events-none absolute -bottom-[18%] -left-[14%] h-[46vw] max-h-[620px] w-[46vw] max-w-[620px] blur-[80px]"
        />
      </div>

      {/* ── Titular ───────────────────────────────────────────────────── */}
      <div className="pointer-events-none relative mx-auto flex min-h-[80svh] w-full max-w-[1440px] flex-col justify-end px-5 pb-20 sm:px-8 sm:pb-28 lg:min-h-[100svh] lg:px-12 lg:pb-36">
        <div className="pointer-events-auto max-w-[62rem]">
          <div data-reveal className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-gold/55" />
            <span className="text-ink-faint text-[10px] tracking-[0.3em] uppercase">
              {t.intro.eyebrow}
            </span>
          </div>

          <RevealText
            as="h2"
            lines={t.intro.title}
            delay={1}
            className="text-ink mt-6 font-serif text-[clamp(2.6rem,8vw,7rem)] leading-[0.95] tracking-[-0.03em]"
          />

          <p
            data-reveal="blur"
            style={{ "--reveal-delay": "280ms" } as React.CSSProperties}
            className="text-ink-dim mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.65]"
          >
            {t.intro.body}
          </p>

          <div
            ref={cajaCta}
            data-reveal
            style={{ "--reveal-delay": "420ms" } as React.CSSProperties}
            className="mt-11"
          >
            <MagneticButton variant="outline" icon="play" onClick={abrir}>
              {t.intro.cta}
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* ── Showreel ──────────────────────────────────────────────────────
          z-240: por encima del grano (200) y de la navbar, pero por debajo del
          cursor propio (250), que es el único puntero visible del sitio —si lo
          tapáramos, los controles del video quedarían sin puntero. */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            ref={dialogo}
            role="dialog"
            aria-modal="true"
            aria-label={t.hero.showreel}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            /* La salida es más corta que la entrada a propósito: mientras el
               overlay se funde, la trampa de foco ya se soltó (el efecto limpia
               con el estado, no con la animación) y se podría tabular a lo que
               hay detrás, que todavía está tapado. Cuanto más breve ese hueco,
               mejor. Es el mismo 0,4 s que usa el modal del hero. */
            exit={{ opacity: 0, transition: { duration: reducido ? 0 : 0.4, ease: EASE } }}
            transition={{ duration: reducido ? 0 : 0.6, ease: EASE }}
            className="fixed inset-0 z-[240] flex items-center justify-center bg-black/95 px-4 py-20 backdrop-blur-sm sm:px-8"
          >
            {/* Clic en el fondo = cerrar. Es un div y no un botón a propósito:
                el cierre accesible es el botón de abajo y la tecla Escape. */}
            <div aria-hidden="true" className="absolute inset-0" onClick={cerrar} />

            {/* El ancho también lo acota el alto disponible: con sólo
                `max-w-[1200px]`, un hijo `aspect-video` mide ancho×9/16 y en un
                viewport bajo (1366×768, o mobile apaisado) se pasa del alto
                útil —100svh menos el py-20 del overlay, o sea 10rem— y lo que
                sobresale no scrollea porque el overlay es `fixed`. Framer no
                pisa `max-width`: sólo anima transform, opacity y filter.
                prefers-reduced-motion: el movimiento se apaga por JS porque el
                override CSS de globals.css sólo alcanza animaciones y
                transiciones CSS, y Framer escribe estilos inline. */}
            <motion.div
              initial={reducido ? { opacity: 0 } : { opacity: 0, scale: 0.97, filter: "blur(8px)" }}
              animate={
                reducido ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }
              }
              exit={
                reducido
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      opacity: 0,
                      scale: 0.98,
                      filter: "blur(6px)",
                      transition: { duration: 0.35, ease: EASE },
                    }
              }
              transition={{ duration: reducido ? 0 : 1.1, ease: EASE }}
              className="relative w-full max-w-[min(1200px,calc((100svh-10rem)*16/9))]"
            >
              <div className="border-line bg-black-2 relative aspect-video w-full overflow-hidden border">
                {/* Sin pista de subtítulos todavía: el showreel es placeholder.
                    Cuando entre el corte real hay que sumar un <track kind="captions">. */}
                <video
                  ref={videoModal}
                  src="/videos/showreel.mp4"
                  poster="/images/poster-showreel.jpg"
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  className="h-full w-full object-contain"
                />
                <PlaceholderTag src="videos/showreel.mp4" />
              </div>
            </motion.div>

            <button
              ref={botonCerrar}
              type="button"
              onClick={cerrar}
              data-cursor="link"
              className="border-line text-ink-dim hover:text-gold hover:border-gold/60 absolute top-6 right-5 inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[10px] tracking-[0.3em] uppercase transition-colors duration-500 sm:top-8 sm:right-8"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.4} aria-hidden="true" />
              {t.work.close}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
