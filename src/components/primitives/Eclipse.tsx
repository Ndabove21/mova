"use client";

/**
 * El eclipse: disco negro con luz de canto. Es el corazón visual de MOVA.
 *
 * Construido con conic-gradient + máscara radial en vez de WebGL: pesa
 * nada, se ve nítido en cualquier densidad y no pide una GPU en mobile.
 */

const RIM = `conic-gradient(
  from 0deg,
  rgba(228,178,122,0.30) 0deg,
  rgba(255,247,235,0.95) 34deg,
  rgba(228,178,122,0.90) 74deg,
  rgba(169,108,46,0.45) 118deg,
  rgba(169,108,46,0.08) 160deg,
  rgba(70,99,126,0.06) 196deg,
  rgba(70,99,126,0.32) 236deg,
  rgba(166,198,226,0.70) 282deg,
  rgba(166,198,226,0.28) 318deg,
  rgba(228,178,122,0.30) 360deg
)`;

const RIM_THIN = `conic-gradient(
  from 180deg,
  rgba(255,255,255,0) 0deg,
  rgba(166,198,226,0.35) 60deg,
  rgba(255,255,255,0) 150deg,
  rgba(228,178,122,0.28) 260deg,
  rgba(255,255,255,0) 340deg
)`;

export function Eclipse({
  className = "",
  rimWidth = 3,
  drift = true,
}: {
  /** Tamaño y posición los pone quien lo usa. */
  className?: string;
  /** Grosor del canto de luz, en px. */
  rimWidth?: number;
  /** Anillo secundario que gira muy lento. */
  drift?: boolean;
}) {
  const ringMask = `radial-gradient(closest-side, transparent calc(100% - ${rimWidth}px), #000 calc(100% - ${rimWidth}px + 0.5px))`;

  return (
    <div className={`pointer-events-none relative aspect-square ${className}`} aria-hidden="true">
      {/* Resplandor exterior cálido, arriba a la derecha */}
      <div className="glow-gold animate-breathe absolute -inset-[18%] rounded-full blur-2xl" />
      {/* Resplandor frío, abajo a la izquierda */}
      <div className="glow-halo absolute -inset-[12%] rounded-full blur-2xl" />

      {/* Disco: negro con una caída sutil para que lea como esfera */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(120% 120% at 68% 22%, #0d0d13 0%, #050508 45%, #020203 100%)",
        }}
      />

      {/* Canto de luz principal */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: RIM,
          WebkitMask: ringMask,
          mask: ringMask,
        }}
      />

      {/* Canto secundario, en deriva lenta */}
      {drift && (
        <div
          className="animate-rim absolute inset-[2.5%] rounded-full"
          style={{
            background: RIM_THIN,
            WebkitMask: `radial-gradient(closest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))`,
            mask: `radial-gradient(closest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))`,
          }}
        />
      )}
    </div>
  );
}
