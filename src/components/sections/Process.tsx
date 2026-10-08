/**
 * Sección 06 — HOW WE CREATE.
 *
 * El proceso se lee como una tira de contactos: cinco encuadres en fila, cada
 * uno con su número sobre una línea de tiempo. Nada de flechas ni de cajas
 * conectadas —la secuencia la cuenta el orden de lectura y el escalonado del
 * revelado, no un diagrama—.
 *
 * Es Server Component a propósito: todo el movimiento es CSS (hover y
 * [data-reveal], que observa el IntersectionObserver global de layout/Reveals),
 * así que no hace falta hidratar nada. Eso también deja el respeto por
 * prefers-reduced-motion en manos de globals.css, donde ya está resuelto.
 */
import { ProcessGlyph } from "@/components/primitives/ProcessGlyph";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { Rule } from "@/components/primitives/motion";
import { PROCESS } from "@/data/process";
import type { Dictionary } from "@/i18n";

/* Se guarda como literal completo para que el scanner de Tailwind la vea. */
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function Process({ t }: { t: Dictionary }) {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="relative overflow-hidden bg-black"
    >
      {/* Halo quieto, no animado: da profundidad al negro sin competir con el
          brillo de los glyphs, que es lo único que debe moverse en hover. */}
      <div
        aria-hidden="true"
        className="glow-gold pointer-events-none absolute -top-32 right-[-8rem] h-[560px] w-[560px] opacity-40 blur-[70px]"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-28 sm:px-8 sm:py-40 lg:px-12 lg:py-48">
        {/* El titular visible de la sección es la etiqueta de SectionLabel, que
            es un span: el h2 va oculto para no romper el orden de headings. */}
        <h2 id="process-title" className="sr-only">
          {t.process.label}
        </h2>

        <SectionLabel index={t.process.index} label={t.process.label} />

        <div className="relative mt-16 sm:mt-20 lg:mt-24">
          {/* Línea de tiempo: sólo en lg, el único ancho donde las cinco etapas
              están realmente en fila. top-[10px] = centro de la fila h-5 de los
              números, para que el filete los cruce a su altura. */}
          <Rule className="absolute inset-x-0 top-[10px] hidden lg:block" delay={140} />

          <ol className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-0">
            {PROCESS.map((p, i) => {
              /* PROCESS y t.process.steps son la misma secuencia: se emparejan
                 por índice, no por id, para que el copy no dependa de claves. */
              const step = t.process.steps[i];

              return (
                <li
                  key={p.id}
                  className="group relative"
                  data-reveal
                  /* 110ms por etapa: suficiente para leerlas en cascada sin que
                     la última llegue tarde a cuadro. */
                  style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
                >
                  {/* El número lleva el fondo de la sección para tapar el filete:
                      la línea de tiempo parece interrumpirse en cada etapa en
                      lugar de atravesarla. */}
                  <div className="flex h-5 items-center">
                    <span
                      className={`bg-black pr-4 text-[10px] tracking-[0.3em] text-ink-faint transition-colors duration-700 group-hover:text-gold ${EASE}`}
                    >
                      {p.n}
                    </span>
                  </div>

                  <h3 className="mt-5 text-[11px] tracking-[0.26em] text-ink uppercase">
                    {step.title}
                  </h3>

                  {/* max-w en mobile y sm: a ancho completo el glyph pesaría más
                      que el texto y el bloque dejaría de leerse como una ficha.
                      En lg la columna ya mide ~230px y el tope sobra. */}
                  <div className="relative mt-6 aspect-square w-full max-w-[220px] overflow-hidden border border-line-soft bg-black-2 lg:max-w-none">
                    <div
                      aria-hidden="true"
                      className={`glow-gold pointer-events-none absolute top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-0 blur-[40px] transition-opacity duration-1000 group-hover:opacity-100 ${EASE}`}
                    />
                    {/* relative: el glyph tiene que pintar por encima del halo,
                        que está en flujo posicionado. */}
                    <ProcessGlyph
                      glyph={p.glyph}
                      className={`relative w-full opacity-75 transition-[opacity,transform] duration-[1200ms] group-hover:scale-[1.04] group-hover:opacity-100 ${EASE}`}
                    />
                  </div>

                  <p className="mt-6 max-w-[34ch] text-[0.85rem] leading-relaxed text-ink-dim">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
