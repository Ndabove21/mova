export function SectionHead({
  eyebrow,
  title,
  lead,
  className = "",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <header className={`grid gap-6 lg:grid-cols-12 lg:gap-10 ${className}`}>
      <p
        data-reveal
        className="text-ink-faint text-[10px] tracking-[0.34em] uppercase lg:col-span-3"
      >
        {eyebrow}
      </p>
      <div className="lg:col-span-9">
        <h2
          data-reveal
          className="font-editorial text-ink text-[2rem] leading-[1.06] tracking-[-0.015em] text-balance sm:text-[2.7rem] lg:text-[3.2rem]"
        >
          {title}
        </h2>
        {lead && (
          <p
            data-reveal
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
            className="text-ink-dim mt-5 max-w-[54ch] text-[0.95rem] leading-relaxed font-light sm:text-base"
          >
            {lead}
          </p>
        )}
      </div>
    </header>
  );
}
