"use client";

import { useEffect, useRef } from "react";
import type { Dictionary } from "@/i18n";
import { HERO_VIDEO, HERO_POSTER } from "@/lib/site";
import { Eclipse } from "@/components/primitives/Eclipse";
import { Wordmark } from "@/components/primitives/Wordmark";
import { LineReveal } from "@/components/primitives/motion";

export function Hero({ t }: { t: Dictionary }) {
  const eclipseRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  // Parallax suave: el eclipse se hunde y el isologo flota un poco más lento.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const tick = () => {
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      const p = Math.min(y / vh, 1.2);
      if (eclipseRef.current) {
        eclipseRef.current.style.transform = `translate3d(0, ${p * 120}px, 0) scale(${1 + p * 0.08})`;
        eclipseRef.current.style.opacity = `${Math.max(0, 1 - p * 0.9)}`;
      }
      if (markRef.current) {
        markRef.current.style.transform = `translate3d(0, ${p * 54}px, 0)`;
        markRef.current.style.opacity = `${Math.max(0, 1 - p * 1.15)}`;
      }
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {/* Primera pantalla: un objeto encendido en el vacío y un nombre.
          Nada más. Lo que la vuelve extraña es justamente lo que falta. */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5">
        {HERO_VIDEO && (
          <div className="absolute inset-0 -z-10">
            <video
              className="h-full w-full object-cover opacity-45"
              src={HERO_VIDEO}
              poster={HERO_POSTER ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
            <div className="from-void via-void/55 to-void absolute inset-0 bg-gradient-to-b" />
          </div>
        )}

        <div
          ref={eclipseRef}
          className="absolute top-1/2 left-1/2 w-[min(92vw,66svh,720px)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <Eclipse className="w-full" rimWidth={3} />
        </div>

        <div ref={markRef} className="relative z-10 text-center will-change-transform">
          <Wordmark
            className="mx-auto w-[min(60vw,420px)]"
            title="MOVA — AI Creative Studio"
          />
          <p className="text-ink-faint mt-6 text-[0.6rem] tracking-[0.62em] uppercase sm:mt-8 sm:text-[0.72rem] sm:tracking-[0.74em]">
            <span className="sr-only">MOVA — </span>
            {t.hero.eyebrow}
          </p>
        </div>

        <div className="absolute bottom-10 left-5 flex items-center gap-3 sm:left-8 lg:left-12">
          <span className="text-ink-faint text-[10px] tracking-[0.3em] uppercase">
            {t.hero.scroll}
          </span>
          <span className="bg-line relative h-10 w-px overflow-hidden">
            <span className="bg-gold animate-scroll-hint absolute inset-0 block" />
          </span>
        </div>
      </section>

      {/* Segunda pantalla: recién acá aparece la frase. */}
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-20 pb-28 sm:px-8 sm:pt-28 sm:pb-40 lg:px-12">
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
    </>
  );
}
