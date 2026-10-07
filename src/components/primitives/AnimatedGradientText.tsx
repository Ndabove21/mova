"use client";

/**
 * Texto con un gradiente que viaja de punta a punta.
 *
 * A diferencia de ShinyText —un reflejo angosto que cruza y vuelve—, acá el
 * color se desplaza de forma continua. Sólo se lee en piezas grandes; en
 * tipografía chica no se nota y sólo cuesta pintura.
 *
 * Los tres colores por defecto son el eclipse: halo frío → brillo → oro. La
 * versión original de Canttaglia tenía dos (plata sobre negro); acá hace falta
 * el paso intermedio porque la marca justamente vive del cruce frío/cálido.
 */
export default function AnimatedGradientText({
  children,
  /** Segundos que tarda el gradiente en dar una vuelta */
  speed = 11,
  colorFrom = "var(--color-halo)",
  colorMid = "#fffaf2",
  colorTo = "var(--color-gold)",
  className = "",
  as: Tag = "span",
}: {
  children: React.ReactNode;
  speed?: number;
  colorFrom?: string;
  colorMid?: string;
  colorTo?: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
}) {
  return (
    <Tag
      className={`gradient-travel ${className}`}
      style={
        {
          "--gr-from": colorFrom,
          "--gr-mid": colorMid,
          "--gr-to": colorTo,
          "--gr-loop": `${speed}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
