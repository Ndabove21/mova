"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import { HERO_MODE, HERO_VIDEO, HERO_POSTER } from "@/lib/site";
import { LineReveal } from "@/components/primitives/motion";
import { LogoSting } from "@/components/primitives/LogoSting";

/**
 * La recepción.
 *
 * El visitante entra directamente al isologo animado, a pantalla completa. No
 * hay nada encima: el video ya trae la marca, el descriptor y el claim, así
 * que repetirlos en HTML sería decir dos veces lo mismo.
 *
 * El video queda fijo (`sticky`) mientras se scrollea la primera pantalla y
 * media: la frase del estudio entra montada sobre él y el velo negro va
 * subiendo hasta apagarlo del todo. Para cuando arranca el manifiesto —"todo
 * lo que ves empieza en negro"— la pantalla, efectivamente, es negra.
 *
 * La recepción se resuelve de dos maneras, según `HERO_MODE`:
 *
 *   "render" — el isologo dibujado en vectores. Es lo que está activo: el
 *              master del video es 1280×720 y acá se pintaba a 2880 px
 *              físicos, así que se ablandaba.
 *   "video"  — el archivo del cliente. `object-contain` y no `cover`: el
 *              logotipo ocupa casi todo el ancho del cuadro y recortar para
 *              llenar la pantalla se comería las letras de los costados.
 */
export function Hero({ t }: { t: Dictionary }) {
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const esVideo = HERO_MODE === "video" && Boolean(HERO_VIDEO);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  /** Sólo para el isologo renderizado: detiene partículas y reflejo. */
  const [stingPausado, setStingPausado] = useState(false);
  /** Con movimiento reducido el isologo ya nace quieto: un botón de pausa ahí
   *  miente. Se resuelve en el cliente, así que arranca en false. */
  const [hayMovimiento, setHayMovimiento] = useState(false);

  useEffect(() => {
    setHayMovimiento(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Autoplay sólo si no se pidió menos movimiento. Si el navegador lo rechaza
  // (algunas políticas de ahorro de batería), el botón queda en "Reproducir".
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !esVideo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().then(
      () => setPlaying(true),
      () => setPlaying(false)
    );
  }, []);

  // No gastar CPU ni batería con el video fuera de pantalla.
  useEffect(() => {
    const v = videoRef.current;
    const el = section.current;
    if (!v || !el || !esVideo) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (playingRef.current) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Se lee dentro del observer sin volver a suscribirlo en cada cambio.
  const playingRef = useRef(false);
  playingRef.current = playing;

  // El velo sube con el scroll: el video se apaga justo cuando entra el
  // manifiesto, que habla de pantallas negras.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (scrim.current) scrim.current.style.opacity = "0.45";
      return;
    }
    let frame = 0;
    const tick = () => {
      const el = section.current;
      if (el) {
        const vh = window.innerHeight || 1;
        const recorrido = Math.max(1, el.offsetHeight - vh);
        const p = Math.min(1, Math.max(0, (window.scrollY - el.offsetTop) / recorrido));
        const s = p * p * (3 - 2 * p); // smoothstep
        if (scrim.current) scrim.current.style.opacity = `${0.08 + 0.9 * s}`;
        if (media.current) media.current.style.transform = `scale(${1 + 0.07 * s})`;
        if (hint.current) hint.current.style.opacity = `${Math.max(0, 1 - p / 0.14)}`;
        if (controls.current) {
          const o = Math.max(0, 1 - s * 1.15);
          controls.current.style.opacity = `${o}`;
          controls.current.style.pointerEvents = o < 0.12 ? "none" : "auto";
        }
      }
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true), () => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().then(() => setPlaying(true), () => {});
  };

  const boton =
    "text-ink-faint hover:text-ink text-[10px] tracking-[0.26em] uppercase transition-colors duration-300";

  return (
    <section ref={section} className="relative">
      {/* Escenario fijo */}
      <div className="sticky top-0 z-0 h-[100svh] overflow-hidden">
        <div ref={media} className="absolute inset-0 will-change-transform">
          {!esVideo ? (
            <LogoSting
              className="h-full w-full"
              descriptor={t.hero.eyebrow}
              claim={t.footer.claim}
              paused={stingPausado}
            />
          ) : (
            /* El elemento mide exactamente la banda del video (16:9), no todo
               el contenedor: así la máscara puede fundir el canto superior e
               inferior con el negro de la página. En un teléfono vertical, sin
               eso, el video queda como una caja pegada sobre el fondo. */
            <div className="absolute inset-0 flex items-center justify-center">
              <video
                ref={videoRef}
                className="aspect-video max-h-full w-full object-contain"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 6%, #000 94%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 6%, #000 94%, transparent 100%)",
                }}
                poster={HERO_POSTER ?? undefined}
                muted
                loop
                playsInline
                preload="auto"
                aria-label="MOVA — AI Creative Studio"
              >
                <source src="/video/hero.webm" type="video/webm" />
                <source src={HERO_VIDEO ?? undefined} type="video/mp4" />
              </video>
            </div>
          )}
        </div>

        <div ref={scrim} className="bg-void absolute inset-0" style={{ opacity: 0.08 }} />

        {/* Para que el nav se lea sobre los fotogramas más claros */}
        <div
          aria-hidden="true"
          className="from-void/85 absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent"
        />

        <div
          ref={hint}
          className="absolute bottom-10 left-5 flex items-center gap-3 sm:left-8 lg:left-12"
        >
          <span className="text-ink-faint text-[10px] tracking-[0.3em] uppercase">
            {t.hero.scroll}
          </span>
          <span className="bg-line relative h-10 w-px overflow-hidden">
            <span className="bg-gold animate-scroll-hint absolute inset-0 block" />
          </span>
        </div>

        {/* WCAG 2.2.2: cualquier cosa que se mueva sola más de 5s tiene que
            poder detenerse. Vale para el video y también para el isologo. */}
        <div
          ref={controls}
          hidden={!esVideo && !hayMovimiento}
          className="absolute right-5 bottom-10 flex items-center gap-5 sm:right-8 lg:right-12"
        >
          <button
            type="button"
            onClick={esVideo ? togglePlay : () => setStingPausado((v) => !v)}
            className={boton}
          >
            {(esVideo ? playing : !stingPausado) ? t.hero.pause : t.hero.play}
          </button>
          {esVideo && (
            <button
              type="button"
              onClick={toggleSound}
              className={boton}
              aria-pressed={!muted}
            >
              {muted ? t.hero.soundOn : t.hero.soundOff}
            </button>
          )}
        </div>
      </div>

      {/* La frase entra montada sobre el escenario, una pantalla más abajo.
          `pointer-events-none` en el envoltorio para no tapar los controles
          del video, que viven en la capa de atrás. */}
      <div className="pointer-events-none relative z-10 -mt-[100svh] pt-[100svh]">
        <div className="pointer-events-auto mx-auto w-full max-w-[1440px] px-5 pt-24 pb-32 sm:px-8 sm:pt-32 sm:pb-44 lg:px-12">
          <LineReveal
            as="h1"
            className="max-w-[18ch] text-[clamp(2.1rem,6vw,4.6rem)] leading-[1.0] tracking-[-0.035em]"
            lines={[
              t.hero.title[0],
              <span key="2" className="text-eclipse">
                {t.hero.title[1]}
              </span>,
            ]}
          />

          <div className="mt-16 grid sm:mt-24 lg:grid-cols-12">
            <div className="lg:col-span-6 lg:col-start-7">
              <p
                data-reveal
                className="text-ink-dim max-w-[46ch] text-[1.0625rem] leading-[1.65]"
              >
                {t.hero.body}
              </p>
              <div
                data-reveal
                style={{ "--reveal-delay": "110ms" } as React.CSSProperties}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <a
                  href="#trabajos"
                  className="bg-ink text-void hover:bg-gold rounded-full px-8 py-3.5 text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-300"
                >
                  {t.hero.ctaPrimary}
                </a>
                <a
                  href="#contacto"
                  className="border-line text-ink hover:border-ink/55 rounded-full border px-8 py-3.5 text-[11px] tracking-[0.18em] uppercase transition-colors duration-300"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
