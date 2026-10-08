"use client";

import { useId } from "react";

/**
 * Isologotipo MOVA redibujado como vector monolineal geométrico.
 * Trazos (no contornos): peso uniforme, vértices en punta — el mismo
 * criterio del logo original. El degradé va de luz fría a luz cálida,
 * replicando el canto del eclipse.
 */
export function Wordmark({
  className = "",
  title = "MOVA",
}: {
  className?: string;
  title?: string;
}) {
  const id = useId();
  const grad = `mova-metal-${id}`;

  return (
    <svg
      viewBox="0 0 875 240"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <defs>
        <linearGradient
          id={grad}
          gradientUnits="userSpaceOnUse"
          x1="15"
          y1="10"
          x2="860"
          y2="230"
        >
          <stop offset="0%" stopColor="var(--color-blue-deep)" />
          <stop offset="14%" stopColor="var(--color-blue)" />
          <stop offset="40%" stopColor="#fffaf2" />
          <stop offset="68%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-gold-deep)" />
        </linearGradient>
      </defs>

      <g
        stroke={`url(#${grad})`}
        strokeWidth="20"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="12"
      >
        {/* M */}
        <polyline points="15,220 15,22 105,205 195,22 195,220" />
        {/* O */}
        <circle cx="320" cy="121" r="99" />
        {/* V */}
        <polyline points="460,22 545,218 630,22" />
        {/* A */}
        <polyline points="690,220 775,22 860,220" />
        <line x1="721" y1="152" x2="829" y2="152" />
      </g>
    </svg>
  );
}

/** Marca compacta para el nav: el eclipse reducido a un anillo. */
export function MarkGlyph({ className = "" }: { className?: string }) {
  const id = useId();
  const grad = `mova-ring-${id}`;
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={grad} x1="0.1" y1="0.9" x2="0.9" y2="0.1">
          <stop offset="0%" stopColor="var(--color-blue)" />
          <stop offset="45%" stopColor="#fffaf2" />
          <stop offset="100%" stopColor="var(--color-gold)" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="19" stroke={`url(#${grad})`} strokeWidth="2.5" />
    </svg>
  );
}
