import type { Dictionary } from "@/i18n";
import { SectionHead } from "@/components/primitives/SectionHead";

/**
 * Una lista, no una grilla de tarjetas.
 *
 * Seis filas separadas por el mismo filete de 1px que estructura el resto del
 * sitio. Sin cajas, sin hover, sin números: la jerarquía la da el tamaño de la
 * letra y el espacio en blanco, que es todo lo que hace falta.
 */
export function Services({ t }: { t: Dictionary }) {
  return (
    <section
      id="servicios"
      className="mx-auto w-full max-w-[1440px] px-5 py-32 sm:px-8 sm:py-44 lg:px-12"
    >
      <SectionHead
        eyebrow={t.services.eyebrow}
        title={t.services.title}
        lead={t.services.lead}
      />

      <ul className="mt-20 sm:mt-28">
        {t.services.items.map((s, i) => (
          <li
            key={s.title}
            data-reveal
            style={{ "--reveal-delay": `${Math.min(i, 4) * 70}ms` } as React.CSSProperties}
            className="border-line-soft border-t last:border-b"
          >
            <div className="grid gap-3 py-9 sm:grid-cols-12 sm:gap-8 sm:py-11">
              <h3 className="text-[clamp(1.3rem,2.5vw,1.85rem)] leading-[1.15] tracking-[-0.025em] sm:col-span-5">
                {s.title}
              </h3>
              <p className="text-ink-dim text-[1.0625rem] leading-[1.6] sm:col-span-6 sm:col-start-7">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
