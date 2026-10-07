"use client";

import { useEffect, useRef } from "react";
import type { Dictionary } from "@/i18n";
import { HERO_VIDEO, HERO_POSTER } from "@/lib/site";
import { Eclipse } from "@/components/primitives/Eclipse";
import { Wordmark } from "@/components/primitives/Wordmark";

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
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Reel de fondo — se activa cuando HERO_VIDEO deja de ser null */}
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

      {/* Eclipse + isologo */}
      <div className="relative flex flex-1 items-center justify-center px-5 pt-24 pb-10 sm:px-8">
        <div
          ref={eclipseRef}
          className="absolute top-1/2 left-1/2 w-[min(92vw,66svh,760px)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <Eclipse className="w-full" rimWidth={3} />
        </div>

        <div ref={markRef} className="relative z-10 text-center will-change-transform">
          <Wordmark
            className="mx-auto w-[min(62vw,460px)]"
            title="MOVA — AI Creative Studio"
          />
          <p className="text-ink-dim mt-5 text-[0.6rem] font-light tracking-[0.62em] uppercase sm:mt-7 sm:text-[0.72rem] sm:tracking-[0.74em]">
            <span className="sr-only">MOVA — </span>
            {t.hero.eyebrow}
          </p>
        </div>
      </div>

      {/* Pie del hero: la frase, el cuerpo y las acciones */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-12 sm:px-8 sm:pb-14 lg:px-12">
        <div className="hairline mb-8" />
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1 className="font-editorial text-ink text-[2.1rem] leading-[1.04] tracking-[-0.015em] text-balance sm:text-[3rem] lg:col-span-7 lg:text-[3.7rem]">
            {t.hero.title[0]}
            <br />
            <span className="text-eclipse">{t.hero.title[1]}</span>
          </h1>

          <div className="lg:col-span-5">
            <p className="text-ink-dim max-w-[46ch] text-[0.95rem] leading-relaxed font-light sm:text-base">
              {t.hero.body}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#trabajos"
                className="bg-ink text-void hover:bg-gold rounded-full px-7 py-3 text-[12px] font-medium tracking-[0.16em] uppercase transition-colors duration-300"
              >
                {t.hero.ctaPrimary}
              </a>
              <a
                href="#contacto"
                className="border-ink/25 text-ink hover:border-ink/60 rounded-full border px-7 py-3 text-[12px] font-light tracking-[0.16em] uppercase transition-colors duration-300"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3 sm:mt-12">
          <span className="text-ink-faint text-[10px] tracking-[0.3em] uppercase">
            {t.hero.scroll}
          </span>
          <span className="bg-line relative h-10 w-px overflow-hidden">
            <span className="bg-gold animate-scroll-hint absolute inset-0 block" />
          </span>
        </div>
      </div>
    </section>
  );
}
