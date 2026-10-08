/** Filete de 1px que se dibuja de izquierda a derecha al entrar en cuadro. */
export function Rule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      data-reveal="rule"
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={`hairline ${className}`}
    />
  );
}
