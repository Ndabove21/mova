"use client";

import { motion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const linea: Variants = {
  oculta: { opacity: 0, y: "0.62em", filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE, delay: i * 0.09 },
  }),
};

/**
 * Titular que entra línea por línea desde abajo del renglón, con un desenfoque
 * que se resuelve. Cada entrada del array es una línea: dónde corta es una
 * decisión de composición, no del navegador.
 *
 * El `overflow-hidden` del span exterior es lo que hace el efecto —la línea no
 * aparece, entra—, pero recorta la caja arriba y abajo. El padding devuelve el
 * aire que necesitan las tildes y las colas; el margen negativo lo descuenta
 * para no tocar el interlineado.
 */
export function RevealText({
  lines,
  as: Tag = "p",
  className = "",
  lineClassName = "",
  delay = 0,
  once = true,
}: {
  lines: React.ReactNode[];
  as?: "p" | "h1" | "h2" | "h3" | "div";
  className?: string;
  /** Clases por línea — sirve para pintar una sola con el metal. */
  lineClassName?: string;
  /** Líneas de retraso extra, para encadenar bloques. */
  delay?: number;
  once?: boolean;
}) {
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        // El `overflow-hidden` es lo que hace el efecto —la línea entra desde
        // abajo del renglón en vez de aparecer—, pero recorta la caja por
        // arriba y por abajo. El padding le devuelve aire a las TILDES (Á, Í)
        // y a las colas (p, g), y el margen negativo lo descuenta para que el
        // interlineado no cambie. Sin el `pt`, "MÁS ALLÁ" se lee "MAS ALLA".
        <span key={i} className="-mt-[0.22em] -mb-[0.1em] block overflow-hidden pt-[0.22em] pb-[0.1em]">
          <motion.span
            className={`block ${lineClassName}`}
            custom={i + delay}
            variants={linea}
            initial="oculta"
            whileInView="visible"
            viewport={{ once, margin: "-12% 0px" }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
