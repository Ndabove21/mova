import type { Dictionary } from "@/i18n";
import { SectionHead } from "@/components/primitives/SectionHead";

export function Process({ t }: { t: Dictionary }) {
  return (
    <section
      id="proceso"
      className="bg-void-2/60 relative border-y border-line-soft"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <SectionHead
          eyebrow={t.process.eyebrow}
          title={t.process.title}
          lead={t.process.lead}
        />

        <ol className="relative mt-16 grid gap-10 sm:mt-20 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-4">
          {/* Línea de tiempo, sólo en desktop */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[7px] right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-line to-transparent lg:block"
          />

          {t.process.steps.map((s, i) => (
            <li
              key={s.n}
              data-reveal
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
              className="relative"
            >
              <span
                aria-hidden="true"
                className="bg-gold relative z-10 mb-6 block h-[15px] w-[15px] rounded-full ring-4 ring-void-2"
                style={{ boxShadow: "0 0 18px rgba(228,178,122,0.55)" }}
              />
              <p className="text-ink-faint text-[10px] tracking-[0.28em]">{s.n}</p>
              <h3 className="font-editorial text-ink mt-2.5 text-[1.5rem] leading-tight">
                {s.title}
              </h3>
              <p className="text-ink-dim mt-3 max-w-[36ch] text-[0.9rem] leading-relaxed font-light">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
