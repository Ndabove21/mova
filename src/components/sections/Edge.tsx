import type { Dictionary } from "@/i18n";
import { SectionHead } from "@/components/primitives/SectionHead";
import { Eclipse } from "@/components/primitives/Eclipse";

export function Edge({ t }: { t: Dictionary }) {
  return (
    <section
      id="estudio"
      className="relative mx-auto w-full max-w-[1440px] overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-40 hidden w-[620px] opacity-55 lg:block"
      >
        <Eclipse className="w-full" rimWidth={2} />
      </div>

      <div className="relative">
        <SectionHead eyebrow={t.edge.eyebrow} title={t.edge.title} lead={t.edge.lead} />

        <dl className="mt-16 grid gap-px sm:mt-20 sm:grid-cols-2">
          {t.edge.items.map((item, i) => (
            <div
              key={item.k}
              data-reveal
              style={{ "--reveal-delay": `${(i % 2) * 110}ms` } as React.CSSProperties}
              className="border-line-soft border-t py-8 sm:px-1 sm:py-10"
            >
              <dt className="font-editorial text-eclipse text-[1.7rem] leading-tight sm:text-[2rem]">
                {item.k}
              </dt>
              <dd className="text-ink-dim mt-3 max-w-[44ch] text-[0.95rem] leading-relaxed font-light">
                {item.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
