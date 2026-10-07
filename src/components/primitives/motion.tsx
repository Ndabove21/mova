/**
 * Revelados al entrar en cuadro.
 *
 * Sin librería de animación: los dispara el mismo IntersectionObserver que ya
 * corre en `layout/Reveals.tsx`, y el movimiento vive en CSS. Antes esto era
 * framer-motion; para lo que hace acá —opacidad y un desplazamiento— eran
 * 55 KB de JavaScript por nada.
 */

/**
 * Titular que entra línea por línea desde abajo del renglón.
 *
 * Cada entrada del array es una línea: dónde corta es una decisión de
 * composición, no del navegador. El `overflow-hidden` del span exterior es lo
 * que hace el efecto — la línea no aparece, entra desde abajo.
 */
export function LineReveal({
  lines,
  className = "",
  lineClassName = "",
  as: Tag = "p",
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  /** Clases por línea — sirve para pintar sólo una con el degradé del eclipse. */
  lineClassName?: string;
  as?: "p" | "h1" | "h2" | "h3";
  /** Líneas de retraso extra, para encadenar dos bloques. */
  delay?: number;
}) {
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.09em]">
          <span
            data-reveal="line"
            style={{ "--reveal-delay": `${(i + delay) * 95}ms` } as React.CSSProperties}
            className={`block ${lineClassName}`}
          >
            {l}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Filete de 1px que se dibuja de izquierda a derecha al entrar en cuadro. */
export function Rule({ className = "" }: { className?: string }) {
  return <div data-reveal="rule" className={`hairline ${className}`} />;
}
