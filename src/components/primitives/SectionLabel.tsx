/**
 * El encabezado corto que abre cada sección: el número arriba y, debajo, un
 * corchete fino con la etiqueta. Es lo que le da al sitio su registro de
 * guion técnico —cada bloque numerado como un plano—.
 */
export function SectionLabel({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`} data-reveal>
      <span className="text-ink-faint text-[10px] tracking-[0.3em]">{index}</span>
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 10 14" aria-hidden="true" className="h-3 w-2 shrink-0 stroke-gold/70" fill="none">
          <path d="M9 1H1v12h8" strokeWidth="1" />
        </svg>
        <span className="text-ink text-[10px] tracking-[0.3em] uppercase">{label}</span>
      </div>
    </div>
  );
}
