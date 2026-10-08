"use client";

/**
 * El eclipse: disco negro con luz de canto.
 *
 * El canto se dibuja como un TRAZO SVG, no como un degradé cónico recortado
 * con una máscara radial. La versión con máscara funcionaba en Chrome pero se
 * rompía en otros navegadores: pedirle a un `radial-gradient` un corte de 3 px
 * sobre un elemento de 2300 px es un salto del 99,87% al 99,89%, y cuando el
 * navegador rasteriza esa transición con poca precisión —o directamente ignora
 * la máscara— lo que queda a la vista es el sector brillante del degradé
 * entero: una cuña dorada enorme en vez de un filo.
 *
 * Con `vector-effect="non-scaling-stroke"` el trazo mide siempre los mismos
 * píxeles en pantalla, no importa cuánto se escale el SVG. Eso da un canto
 * nítido a cualquier tamaño y en cualquier motor.
 */
export function Eclipse({
  className = "",
  rimWidth = 3,
  drift = true,
  disc = true,
}: {
  /** Tamaño y posición los pone quien lo usa. */
  className?: string;
  /** Grosor del canto de luz, en píxeles de pantalla. */
  rimWidth?: number;
  /** Anillo secundario que gira muy lento. */
  drift?: boolean;
  /** false dibuja sólo el canto: sirve cuando lo que va adentro del círculo
   *  es otra cosa —en el hero, el campo de metal—. */
  disc?: boolean;
}) {
  return (
    <div className={`pointer-events-none relative aspect-square ${className}`} aria-hidden="true">
      {/* Resplandor exterior cálido */}
      <div className="glow-gold animate-breathe absolute -inset-[18%] rounded-full blur-2xl" />
      {/* Resplandor frío */}
      <div className="glow-blue absolute -inset-[12%] rounded-full blur-2xl" />

      {/* Disco: negro con una caída sutil para que lea como esfera */}
      {disc && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(120% 120% at 68% 22%, #0d0d13 0%, #050508 45%, #020203 100%)",
          }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          {/* El reparto de luz del eclipse: frío abajo a la izquierda, brillo
              arriba, oro cayendo a la derecha. Un degradé lineal en diagonal
              reproduce esa lectura sin necesitar un cónico. */}
          <linearGradient id="eclipse-rim" x1="0.08" y1="0.92" x2="0.86" y2="0.06">
            <stop offset="0%" stopColor="#456b85" stopOpacity="0.25" />
            <stop offset="22%" stopColor="#8fb9d8" stopOpacity="0.75" />
            <stop offset="44%" stopColor="#fffaf2" stopOpacity="0.98" />
            <stop offset="62%" stopColor="#f3d6ae" stopOpacity="0.95" />
            <stop offset="82%" stopColor="#d8b27a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#9a7338" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="eclipse-rim-thin" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d8b27a" stopOpacity="0" />
            <stop offset="38%" stopColor="#8fb9d8" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#d8b27a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d8b27a" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="49.6"
          stroke="url(#eclipse-rim)"
          strokeWidth={rimWidth}
          vectorEffect="non-scaling-stroke"
        />

        {drift && (
          <g className="animate-rim" style={{ transformOrigin: "50% 50%" }}>
            <circle
              cx="50"
              cy="50"
              r="47.4"
              stroke="url(#eclipse-rim-thin)"
              strokeWidth={Math.max(1, rimWidth * 0.5)}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
