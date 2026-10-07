"use client";

import { useMemo } from "react";

/**
 * Texto con un brillo que lo recorre.
 *
 * En MOVA no es un adorno: el isologo es metal con luz de canto, así que un
 * reflejo cruzando la letra es la misma idea puesta en movimiento. Por eso se
 * usa con cuentagotas —dos lugares en todo el sitio, siempre sobre el tagline—
 * y nunca en texto corrido, donde pelea con la lectura.
 *
 * Es CSS puro: un gradiente desplazándose, recortado contra la tipografía. No
 * hay JS por cuadro.
 */
export default function ShinyText({
  text,
  speed = 4.5,
  delay = 0,
  color = "var(--color-ink-faint)",
  shineColor = "var(--color-gold)",
  spread = 130,
  direction = "left",
  pauseOnHover = false,
  disabled = false,
  className = "",
  as: Tag = "span",
}: {
  text: string;
  /** Segundos que tarda el brillo en cruzar el texto */
  speed?: number;
  delay?: number;
  color?: string;
  shineColor?: string;
  /** Ancho del reflejo, en porcentaje del ancho de la caja */
  spread?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  disabled?: boolean;
  className?: string;
  as?: "span" | "p" | "div";
}) {
  // El gradiente depende sólo de las props, no del cuadro: se arma una vez.
  const estilo = useMemo(
    () => ({
      // El color base va como variable, NO como `color`: un `color` inline gana
      // por especificidad contra el `color: transparent` de la clase, el relleno
      // queda opaco y tapa el gradiente recortado — el brillo no se ve nunca.
      "--shiny-base": color,
      backgroundImage: `linear-gradient(${
        direction === "left" ? "100deg" : "260deg"
      }, transparent 35%, ${shineColor} 50%, transparent 65%)`,
      backgroundSize: `${spread}% 100%`,
      animationDuration: `${speed}s`,
      animationDelay: `${delay}s`,
    }) as React.CSSProperties,
    [color, shineColor, spread, speed, delay, direction]
  );

  if (disabled) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag
      className={`shiny-text ${pauseOnHover ? "shiny-pause-hover" : ""} ${className}`}
      style={estilo}
    >
      {text}
    </Tag>
  );
}
