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
    <header className={`max-w-[42ch] ${className}`}>
      <p
        data-reveal
        className="text-ink-faint text-[10px] tracking-[0.34em] uppercase"
      >
        {eyebrow}
      </p>
      <h2
        data-reveal
        style={{ "--reveal-delay": "70ms" } as React.CSSProperties}
        className="mt-7 text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.02] tracking-[-0.03em] text-balance"
      >
        {title}
      </h2>
      {lead && (
        <p
          data-reveal
          style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
          className="text-ink-dim mt-5 text-[1.0625rem] leading-[1.6]"
        >
          {lead}
        </p>
      )}
    </header>
  );
}
