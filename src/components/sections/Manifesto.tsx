import type { Dictionary } from "@/i18n";

export function Manifesto({ t }: { t: Dictionary }) {
  return (
    <section
      id="manifiesto"
      className="relative mx-auto w-full max-w-[1440px] overflow-hidden px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44"
    >
      {/* Luz de canto detrás del texto */}
      <div
        aria-hidden="true"
        className="glow-gold pointer-events-none absolute top-1/2 -left-32 h-[520px] w-[520px] -translate-y-1/2 rounded-full blur-3xl"
      />

      <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-10">
        <p
          data-reveal
          className="text-ink-faint text-[10px] tracking-[0.34em] uppercase lg:col-span-3"
        >
          {t.manifesto.eyebrow}
        </p>

        <div className="lg:col-span-9">
          <p
            data-reveal
            className="font-editorial text-[2.3rem] leading-[1.08] tracking-[-0.02em] text-balance sm:text-[3.4rem] lg:text-[4.2rem]"
          >
            <span className="text-eclipse">{t.manifesto.statement}</span>
          </p>

          <div className="mt-12 grid max-w-3xl gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8">
            {t.manifesto.body.map((p, i) => (
              <p
                key={i}
                data-reveal
                style={{ "--reveal-delay": `${120 + i * 110}ms` } as React.CSSProperties}
                className="text-ink-dim text-[0.95rem] leading-relaxed font-light"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
