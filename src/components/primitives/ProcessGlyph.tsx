/**
 * Las cinco visualizaciones abstractas de HOW WE CREATE.
 *
 * Dibujadas en SVG y no en imágenes: son nítidas a cualquier densidad, pesan
 * bytes en vez de kilobytes y se pintan con los tokens de la marca, así que
 * siguen el color del sitio si alguna vez cambia.
 *
 * La secuencia cuenta el proceso: una esfera cerrada (la idea) → polvo que se
 * dispersa (generar) → el polvo se ordena en facetas (refinar) → las facetas
 * se vuelven una cinta en movimiento (animar) → la cinta se cierra en un
 * volumen entregable (entregar).
 */
export function ProcessGlyph({
  glyph,
  className = "",
}: {
  glyph: "sphere" | "scatter" | "facet" | "ribbon" | "cube";
  className?: string;
}) {
  const comun = { strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`pg-${glyph}`} cx="38%" cy="30%">
          <stop offset="0%" stopColor="#f2f0ea" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#d8b27a" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#050505" stopOpacity="0" />
        </radialGradient>
      </defs>

      {glyph === "sphere" && (
        <>
          <circle cx="60" cy="60" r="32" fill={`url(#pg-${glyph})`} />
          <circle cx="60" cy="60" r="32" stroke="var(--color-gold)" strokeOpacity="0.55" />
          <path d="M34 48c14 10 38 10 52 0" stroke="var(--color-silver)" strokeOpacity="0.3" {...comun} />
        </>
      )}

      {glyph === "scatter" &&
        Array.from({ length: 46 }, (_, i) => {
          // Espiral determinista: siempre el mismo dibujo, sin aleatoriedad.
          const t = i / 45;
          const a = t * Math.PI * 5.2;
          const r = 8 + t * 34;
          return (
            <circle
              key={i}
              cx={60 + Math.cos(a) * r}
              cy={60 + Math.sin(a) * r * 0.78}
              r={0.7 + (1 - t) * 1.8}
              fill={i % 3 === 0 ? "var(--color-gold)" : "var(--color-silver)"}
              fillOpacity={0.9 - t * 0.6}
            />
          );
        })}

      {glyph === "facet" && (
        <>
          <path d="M60 24 90 54 72 96 44 92 28 56Z" stroke="var(--color-silver)" strokeOpacity="0.5" {...comun} />
          <path d="M60 24 72 96M28 56 90 54M44 92 60 24" stroke="var(--color-gold)" strokeOpacity="0.4" {...comun} />
          <circle cx="60" cy="60" r="30" fill={`url(#pg-${glyph})`} />
        </>
      )}

      {glyph === "ribbon" && (
        <>
          <path
            d="M20 76c16-44 28 26 42-12s26 18 38-18"
            stroke="var(--color-gold)"
            strokeOpacity="0.75"
            {...comun}
          />
          <path
            d="M20 88c16-44 28 26 42-12s26 18 38-18"
            stroke="var(--color-silver)"
            strokeOpacity="0.35"
            {...comun}
          />
          <path
            d="M20 64c16-44 28 26 42-12s26 18 38-18"
            stroke="var(--color-blue)"
            strokeOpacity="0.25"
            {...comun}
          />
        </>
      )}

      {glyph === "cube" && (
        <>
          <path d="M60 26 92 44v34L60 96 28 78V44Z" stroke="var(--color-silver)" strokeOpacity="0.5" {...comun} />
          <path d="M60 26v34l32-16M60 60v36M60 60 28 44" stroke="var(--color-gold)" strokeOpacity="0.45" {...comun} />
          <circle cx="60" cy="60" r="28" fill={`url(#pg-${glyph})`} />
        </>
      )}
    </svg>
  );
}
