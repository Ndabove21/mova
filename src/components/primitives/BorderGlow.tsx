"use client";

import { useCallback, useRef } from "react";

/**
 * Resplandor que sigue al puntero por el borde del contenedor.
 *
 * En oro, no en plata: en MOVA el borde de 1px es lo que estructura botones y
 * tarjetas, y lo que hace el efecto es encenderlo donde está el mouse —la misma
 * luz de canto del eclipse, a escala de un botón.
 *
 * El seguimiento va por variables CSS actualizadas en el pointermove: el
 * navegador repinta un gradiente, no hay JS por cuadro ni re-render de React.
 */

const ORO = "228, 178, 122";

/**
 * Props sueltos, para pegar el resplandor sobre un elemento que YA tiene borde
 * —un `<a>`, un `<button>`— sin envolverlo en un div de más.
 */
export function useBorderGlow({
  glowRadius = 180,
  glowIntensity = 1,
  glowColor = ORO,
  edgeSensitivity = 120,
}: {
  glowRadius?: number;
  glowIntensity?: number;
  glowColor?: string;
  edgeSensitivity?: number;
} = {}) {
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // Cuanto más cerca del borde, más fuerte: en el centro no aporta y ensucia.
      const dBorde = Math.min(x, y, r.width - x, r.height - y);
      const cerca = Math.max(0, 1 - dBorde / edgeSensitivity);
      el.style.setProperty("--bg-x", `${x}px`);
      el.style.setProperty("--bg-y", `${y}px`);
      el.style.setProperty("--bg-op", `${(cerca * glowIntensity).toFixed(3)}`);
    },
    [edgeSensitivity, glowIntensity]
  );

  const onPointerLeave = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).style.setProperty("--bg-op", "0");
  }, []);

  return {
    className: "border-glow",
    onPointerMove,
    onPointerLeave,
    style: {
      "--bg-radio": `${glowRadius}px`,
      "--bg-color": glowColor,
      "--bg-op": 0,
    } as React.CSSProperties,
  };
}

export default function BorderGlow({
  children,
  className = "",
  glowRadius = 180,
  glowIntensity = 1,
  glowColor = ORO,
  edgeSensitivity = 120,
  style,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Radio del resplandor, en píxeles */
  glowRadius?: number;
  glowIntensity?: number;
  /** Color del resplandor, como terna "r, g, b". Por defecto el oro del eclipse. */
  glowColor?: string;
  /** Cuán cerca del borde tiene que estar el puntero para encenderlo (px) */
  edgeSensitivity?: number;
  as?: "div" | "span" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const dBorde = Math.min(x, y, r.width - x, r.height - y);
      const cerca = Math.max(0, 1 - dBorde / edgeSensitivity);
      el.style.setProperty("--bg-x", `${x}px`);
      el.style.setProperty("--bg-y", `${y}px`);
      el.style.setProperty("--bg-op", `${(cerca * glowIntensity).toFixed(3)}`);
    },
    [edgeSensitivity, glowIntensity]
  );

  const onLeave = useCallback(() => {
    ref.current?.style.setProperty("--bg-op", "0");
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLSpanElement & HTMLLIElement>}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`border-glow ${className}`}
      style={
        {
          ...style,
          "--bg-radio": `${glowRadius}px`,
          "--bg-color": glowColor,
          "--bg-op": 0,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
