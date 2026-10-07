import type { Dictionary } from "@/i18n";
import { SectionHead } from "@/components/primitives/SectionHead";
import BorderGlow from "@/components/primitives/BorderGlow";

export function Services({ t }: { t: Dictionary }) {
  return (
    <section
      id="servicios"
      className="relative mx-auto w-full max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <SectionHead
        eyebrow={t.services.eyebrow}
        title={t.services.title}
        lead={t.services.lead}
      />

      <ul className="mt-16 grid gap-px sm:mt-20 md:grid-cols-2 xl:grid-cols-3">
        {t.services.items.map((s, i) => (
          <li
            key={s.n}
            data-reveal
            style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
            className="h-full"
          >
            <BorderGlow
              glowRadius={260}
              glowIntensity={0.7}
              edgeSensitivity={150}
              className="group border-line-soft hover:border-gold/35 relative h-full border-t p-7 transition-colors duration-500 sm:p-8">
            {/* Barrido cálido al pasar el mouse */}
            <span
              aria-hidden="true"
              className="from-gold/[0.07] pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span className="text-ink-faint group-hover:text-gold relative text-[10px] tracking-[0.28em] transition-colors duration-500">
              {s.n}
            </span>
            <h3 className="font-editorial text-ink relative mt-5 text-[1.5rem] leading-tight sm:text-[1.7rem]">
              {s.title}
            </h3>
            <p className="text-ink-dim relative mt-3.5 max-w-[42ch] text-[0.9rem] leading-relaxed font-light">
              {s.body}
            </p>
            </BorderGlow>
          </li>
        ))}
      </ul>
    </section>
  );
}
