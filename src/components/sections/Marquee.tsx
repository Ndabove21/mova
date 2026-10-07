"use client";

import { useMemo } from "react";
import type { Dictionary } from "@/i18n";
import { WORKS } from "@/data/works";
import ScrollVelocity from "@/components/primitives/ScrollVelocity";
import ImageTrail from "@/components/primitives/ImageTrail";

/**
 * La franja que separa servicios de trabajos: dos bandas de texto corriendo en
 * sentidos opuestos, que aceleran y se dan vuelta con el scroll.
 *
 * Encima corre el rastro de frames. La combinación es deliberada —es una tira
 * de película: texto que pasa y fotogramas que aparecen al barrerla con el
 * mouse—. Los frames salen de los posters del portfolio, así que mientras no
 * haya material cargado el rastro simplemente no existe y quedan las dos
 * bandas, que se sostienen solas.
 */
export function Marquee({ t }: { t: Dictionary }) {
  const frames = useMemo(
    () => WORKS.map((w) => w.poster).filter((p): p is string => Boolean(p)),
    []
  );

  return (
    <section className="border-line-soft relative border-y">
      <ImageTrail items={frames} ancho={180} umbral={110} className="py-12 sm:py-16">
        <div className="space-y-3 sm:space-y-4">
        <ScrollVelocity
          texts={[t.marquee[0]]}
          velocity={46}
          className="font-editorial text-ink-faint text-[2.1rem] leading-none sm:text-[3.1rem]"
        />
        <ScrollVelocity
          texts={[t.marquee[1]]}
          velocity={-34}
          className="text-gold/65 text-[0.8rem] leading-none tracking-[0.4em] uppercase sm:text-[0.95rem]"
        />
        </div>
      </ImageTrail>
    </section>
  );
}
