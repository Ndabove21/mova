"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, X } from "lucide-react";

import { Eclipse } from "@/components/primitives/Eclipse";
import { MoltenMetal } from "@/components/primitives/MoltenMetal";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { PlaceholderTag } from "@/components/primitives/PlaceholderTag";
import type { Dictionary } from "@/i18n";

/**
 * Hero — la recepción.
 *
 * No es una portada con un titular sobre una foto: es un plano. El encuadre lo
 * arma un planeta eclipsado que entra por arriba a la izquierda y se va del
 * cuadro, así que de él sólo se ve el canto de luz dorada. Centrado, el
 * isologo en metal. Todo lo demás —índice, rubros, hint de scroll— vive en los
 * márgenes, chico y en mayúsculas, como las marcas de un negativo.
 *
 * El h1 de la página vive acá, en sr-only: LogoSting dibuja "MOVA" con trazos
 * SVG, de modo que sin este encabezado el documento no tendría un h1 real.
 */

const SHOWREEL_VIDEO = "/videos/showreel.mp4";
const SHOWREEL_POSTER = "/images/poster-showreel.jpg";

/** La misma curva que `--ease-cine` de globals.css: JS y CSS en el mismo ritmo. */
const EASE_CINE = [0.22, 1, 0.36, 1] as const;

/* Parallax: cuánto se queda atrás cada capa respecto del scroll. El planeta
   arrastra fuerte —se hunde en el cuadro— y el logotipo apenas, que es lo que
   lo hace flotar. Son fracciones del scroll y no píxeles, para que el efecto
   sea el mismo en cualquier alto de viewport. */
const ARRASTRE_PLANETA = 0.3;
const ARRASTRE_LOGO = 0.12;

export function Hero({ t }: { t: Dictionary }) {
  const reducido = useReducedMotion() ?? false;

  const seccion = useRef<HTMLElement>(null);
  const planeta = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);

  const [showreel, setShowreel] = useState(false);
  const dialogo = useRef<HTMLDivElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  /** Quién abrió el modal: al cerrarlo hay que devolverle el foco. */
  const disparador = useRef<HTMLElement | null>(null);

  const abrirShowreel = useCallback(() => {
    disparador.current = document.activeElement as HTMLElement | null;
    setShowreel(true);
  }, []);

  const cerrarShowreel = useCallback(() => {
    // Pausar antes de desmontar: el fundido de salida dura 400 ms y el audio
    // seguiría sonando sobre la página todo ese tiempo.
    video.current?.pause();
    setShowreel(false);
    disparador.current?.focus();
  }, []);

  /* --- Parallax ---------------------------------------------------------
     rAF propio en vez de useScroll: Lenis ya corre su loop y el cursor otro,
     no hace falta un tercer suscriptor del scroll. Leemos window.scrollY
     —Lenis scrollea de verdad, no con transform— y escribimos transform en
     dos divs que Framer no toca, para no pelearnos por la misma propiedad. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const capaPlaneta = planeta.current;
    const capaLogo = logo.current;
    const caja = seccion.current;
    if (!capaPlaneta || !capaLogo || !caja) return;

    let raf = 0;
    let ultimo = Number.NaN;
    // Pasado el hero no hay nada que mover: el observer deja el loop en vacío.
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0,
    });
    io.observe(caja);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const y = window.scrollY;
      // Medio píxel no se ve: así no reescribimos transform en cada frame quieto.
      if (Math.abs(y - ultimo) < 0.5) return;
      ultimo = y;
      capaPlaneta.style.transform = `translate3d(0, ${y * ARRASTRE_PLANETA}px, 0)`;
      capaLogo.style.transform = `translate3d(0, ${y * ARRASTRE_LOGO}px, 0)`;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  /* --- Modal del showreel ----------------------------------------------- */
  useEffect(() => {
    if (!showreel) return;

    botonCerrar.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrarShowreel();
        return;
      }
      if (e.key !== "Tab") return;
      // Trampa de foco: con el modal abierto el resto de la página está tapado,
      // y tabular hacia algo invisible deja al usuario sin saber dónde está.
      const caja = dialogo.current;
      if (!caja) return;
      const focos = caja.querySelectorAll<HTMLElement>("button, video[controls], a[href]");
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

    window.addEventListener("keydown", onKey);
    /* `lenis-stopped` es la clase con la que el resto del sitio congela el
       scroll suave, pero el selector es `.lenis.lenis-stopped` y con
       prefers-reduced-motion no se instancia Lenis: el html nunca recibe
       `lenis`. De ahí el overflow inline, que es el que cubre ese caso.
       El overflow va en <html>, no en <body>: globals.css ya le pone
       `overflow-x: hidden` al html, así que el html es el scroller y el
       overflow del body no se propaga al viewport (CSS Overflow §3.3). En
       body sería un no-op justo en el caso que esto cubre. */
    const raiz = document.documentElement;
    raiz.classList.add("lenis-stopped");
    raiz.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      raiz.classList.remove("lenis-stopped");
      raiz.style.overflow = "";
    };
  }, [showreel, cerrarShowreel]);

  /** Con menos movimiento todo aparece ya puesto, sin secuencia. */
  const entrada = (duration: number, delay: number) =>
    reducido ? { duration: 0, delay: 0 } : { duration, delay, ease: EASE_CINE };

  return (
    <section
      ref={seccion}
      id="hero"
      aria-labelledby="hero-titulo"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-black"
    >
      <h1 id="hero-titulo" className="sr-only">
        {`${t.brand.name} — ${t.brand.descriptor} — ${t.brand.claim}`}
      </h1>

      {/* ---------- Fondo: el metal fundido ----------
          Va debajo de todo. No es un adorno: el isologo de MOVA ES metal, así
          que el campo detrás es la misma materia extendida a la pantalla. La
          viñeta del shader abre un pozo oscuro en el centro, que es donde cae
          el logotipo — resuelve espectáculo y legibilidad de una. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={entrada(2.2, 0)}
      >
        {/* El metal se enmascara para que NO entre al centro: ahí va el
            logotipo, y necesita negro limpio detrás. Así el campo fluye por
            los bordes y deja un pozo oscuro en el medio — que además es lo que
            hace que el rectángulo del video de arriba sea invisible. */}
        <MoltenMetal
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 70% at 50% 44%, transparent 24%, #000 96%)",
            maskImage:
              "radial-gradient(ellipse 60% 56% at 50% 42%, transparent 14%, #000 88%)",
          }}
          className="absolute inset-0 h-full w-full"
          color1="#07070a"
          color2="#7f6a50"
          color3="#f7e6c8"
          speed={0.3}
          scale={3.2}
          detail={4}
          glow={1.1}
          coreSize={0.09}
          swirl={1}
          fold={-0.2}
          blackPoint={0.12}
          brightness={0.82}
          grain
          grainIntensity={0.04}
          mouseInteraction
          mouseStrength={0.28}
          opacity={0.42}
        />
      </motion.div>

      {/* ---------- Fondo: el planeta y los halos ---------- */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={entrada(1.6, 0)}
      >
        {/* El centro del disco tiene que quedar SIEMPRE fuera del cuadro: es
            lo que hace lectura de planeta y no de anillo. Por eso el
            desplazamiento va en % de `translate` y no en `top/left`: los % de
            translate resuelven contra la caja del elemento —que está clampeada
            en 1700px— y no contra el alto del contenedor, así el encuadre del
            arco es el mismo a 1440×844 que a 1920×1080. Con -72%/-70% el
            centro cae en (-0.22D, -0.20D): arriba y a la izquierda del cuadro,
            y del disco sólo entra un arco de ~0.24D por lado en ese ángulo.
            Va en un div interno porque el `transform` del externo lo reescribe
            el rAF del parallax en cada frame.
            El rotate gira el conic-gradient de Eclipse: su tramo brillante
            mira a la 1 h del disco, y con el centro arriba a la izquierda el
            cuadro sólo ve el sector de las 4-5 h. Sin girarlo, el arco visible
            caería en la parte apagada del degradé (alfa 0.08) en vez de en el
            oro. 60° lo deja entrando en blanco cálido por el borde superior y
            cayendo a oro profundo hacia el borde izquierdo. */}
        <div
          ref={planeta}
          className="absolute top-0 left-0 w-[min(150vw,1700px)] will-change-transform"
        >
          <div style={{ transform: "translate(-72%, -70%) rotate(60deg)" }}>
            <Eclipse disc={false} rimWidth={3} className="w-full" />
          </div>
        </div>

        {/* La luz entra por arriba a la izquierda y rebota en diagonal: halo
            cálido sobre el arco, frío abajo a la derecha. El cálido va tenue y
            SIN latido: Eclipse y LogoSting ya traen su propio `glow-gold`
            respirando, y tres capas de oro al 0.22 encima del mismo cuadrante
            dejan de leer como luz y empiezan a leer como relleno. Este queda
            sólo para estirar la luz del arco hacia el centro. */}
        <div className="glow-gold absolute -top-[14%] left-[4%] h-[70vh] w-[80vw] rounded-full opacity-50 blur-3xl" />
        <div className="glow-blue absolute -right-[14%] -bottom-[18%] h-[60vh] w-[65vw] rounded-full blur-3xl" />
      </motion.div>

      {/* ---------- Centro: el isologo ----------
          La zona se queda con el aire que sobra después del CTA y las marcas de
          margen, y el logotipo se centra ahí adentro. Centrarlo contra el alto
          completo de la sección lo haría pisar el claim con el botón en los
          viewports bajos (un 1440×700 deja apenas 380 px libres).

          Los min-h son el alto que mide el contenido de LogoSting en cada
          breakpoint (logotipo + descriptor + claim): ~155 px en mobile, ~253 px
          desde sm y ~358 px cuando el SVG llega a su ancho máximo de 980 px.
          Sin ese piso, en pantallas bajas —un teléfono en horizontal, 844×390—
          la zona se queda con menos alto que su contenido y el claim se derrama
          encima del botón. Como la sección es `min-h-[100svh]` y no `h-`, con el
          piso simplemente crece y el cluster inferior baja del fold, que es
          preferible al solape. */}
      <div className="relative z-10 min-h-[11rem] flex-1 sm:min-h-[18rem] lg:min-h-[23rem]">
        {/* aria-hidden: es la capa puramente visual. LogoSting expone el SVG
            como role="img" y el descriptor y el claim como <p>, de modo que sin
            esto el lector de pantalla anuncia tres veces lo mismo que ya dice
            el h1 de arriba. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0, filter: "blur(14px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={entrada(1.4, 0.5)}
        >
          <div ref={logo} className="flex h-full w-full items-center justify-center will-change-transform">
            {/* El isologo animado que mandó el cliente. Trae dentro el
                logotipo, el descriptor y el claim, así que no se repiten en
                HTML: el h1 sr-only de arriba ya los expone al lector de
                pantalla y a Google.

                `mix-blend-mode: screen` es la clave del montaje: el video
                viene compuesto sobre negro, y con screen el negro se vuelve
                neutro —result = fondo— de modo que sólo pasan el metal y las
                partículas, flotando sobre el campo fundido. Sin eso habría
                que recortar un rectángulo 16:9 contra el fondo.

                El ancho está topado en 980 px a propósito: el master es de
                1280 px de ancho y estirarlo a sangre lo ablanda. A este
                tamaño el escalado queda en ~1,5× en retina, que aguanta. */}
            <video
              className="w-[min(88vw,980px)] max-h-full object-contain"
              style={{
                // El canto del cuadro se funde con el fondo. Sin esto se ve el
                // rectángulo 16:9 del archivo: `mix-blend-mode: screen` no
                // sirve acá porque el `filter` de la animación de entrada crea
                // un contexto de apilado y aísla el blending del fondo.
                WebkitMaskImage:
                  "radial-gradient(ellipse 74% 72% at 50% 46%, #000 48%, transparent 94%)",
                maskImage:
                  "radial-gradient(ellipse 74% 72% at 50% 46%, #000 48%, transparent 94%)",
              }}
              poster="/images/poster-logo21.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/videos/logo21.webm" type="video/webm" />
              <source src="/videos/logo21.mp4" type="video/mp4" />
            </video>
          </div>
        </motion.div>
      </div>

      {/* ---------- Primer plano: CTA y marcas de margen ---------- */}
      <div className="relative z-20 mx-auto w-full max-w-[1440px] px-5 pb-10 sm:px-8 sm:pb-12 lg:px-12">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={entrada(0.9, 1.5)}
        >
          <MagneticButton variant="outline" icon="play" onClick={abrirShowreel}>
            {t.hero.showreel}
          </MagneticButton>
        </motion.div>

        <div className="mt-8 flex items-end justify-between gap-6 sm:mt-10">
          {/* Índice y rubros, como el pie de una ficha técnica */}
          <motion.div
            className="flex flex-col items-start gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={entrada(0.9, 1.8)}
          >
            <span className="text-ink-dim font-serif text-[clamp(2rem,4vw,2.9rem)] leading-none">
              {t.hero.index}
            </span>
            <span
              aria-hidden="true"
              className="h-6 w-px sm:h-8"
              style={{ background: "linear-gradient(to bottom, var(--color-line), transparent)" }}
            />
            <ul className="text-ink-faint space-y-1 text-[10px] tracking-[0.26em] uppercase">
              {t.hero.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </motion.div>

          {/* Hint de scroll: etiqueta, flecha y el filete que respira */}
          <motion.div
            className="flex flex-col items-end gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={entrada(0.9, 1.95)}
          >
            <span className="text-ink-faint text-[10px] tracking-[0.3em] uppercase">
              {t.hero.scroll}
            </span>
            <ArrowDown aria-hidden="true" className="text-ink-faint h-3 w-3" strokeWidth={1.25} />
            <span aria-hidden="true" className="animate-scroll-hint bg-ink/30 h-10 w-px" />
          </motion.div>
        </div>
      </div>

      {/* ---------- Showreel ----------
          z-[240]: por encima del grano (200) y la viñeta (190), por debajo del
          cursor propio (250), que sobre el video es el único puntero visible. */}
      <AnimatePresence>
        {showreel && (
          <motion.div
            ref={dialogo}
            role="dialog"
            aria-modal="true"
            aria-label={t.hero.showreel}
            // El aire vertical arranca chico y crece desde sm: con py-14 fijo,
            // en cualquier pantalla baja (un 1366×768, un teléfono en
            // horizontal) el contenido no entra y la fila de CERRAR se va
            // arriba del viewport, inalcanzable con el puntero.
            className="fixed inset-0 z-[240] flex flex-col items-center justify-center gap-4 bg-black/95 px-5 py-8 backdrop-blur-sm sm:gap-5 sm:px-8 sm:py-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducido ? 0 : 0.4, ease: EASE_CINE }}
            // Sólo el fondo cierra: un click dentro del cuadro es del video.
            onClick={(e) => {
              if (e.target === e.currentTarget) cerrarShowreel();
            }}
          >
            <div className="flex w-full max-w-[1200px] justify-end">
              <button
                ref={botonCerrar}
                type="button"
                onClick={cerrarShowreel}
                data-cursor="link"
                className="text-ink-dim hover:text-gold inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase transition-colors duration-500"
              >
                {t.work.close}
                <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>

            {/* max-h en vez de recalcular el ancho —la misma convención que el
                modal de SelectedWork—: el marco se achata en pantallas bajas y
                el video queda centrado con object-contain en vez de recortado.
                El techo va acotado también al viewport y no sólo a 70vh porque
                `sm:` es un breakpoint de ANCHO: un teléfono en horizontal
                (844×390) entra en sm y recibe py-14, así que 70vh + el aire
                vertical se pasa de pantalla y la fila de CERRAR se iría arriba
                del borde. Los 10.5rem son el alto fijo del conjunto —112 px de
                py-14, 20 px de gap y ~16 px de la fila de CERRAR— más holgura.
                Va en style y no en una clase arbitraria para no depender de
                cómo Tailwind escapa los espacios dentro de calc().
                PENDIENTE DE ASSET: cuando llegue el showreel real va adentro
                del <video> un <track kind="captions" src="/videos/showreel.en.vtt"
                srcLang="en" label="English" default />. Hasta entonces axe deja
                `video-caption` como "incomplete" (no es violación AA), y
                apuntar un track a un .vtt que no existe es peor que no tenerlo. */}
            <div
              className="border-line-soft bg-black-2 relative aspect-video w-full max-w-[1200px] overflow-hidden border"
              style={{ maxHeight: "min(70vh, calc(100svh - 10.5rem))" }}
            >
              <video
                ref={video}
                src={SHOWREEL_VIDEO}
                poster={SHOWREEL_POSTER}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="h-full w-full bg-black object-contain"
              />
              <PlaceholderTag src={SHOWREEL_VIDEO} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
