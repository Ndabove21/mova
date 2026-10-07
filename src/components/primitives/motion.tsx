"use client";

import { motion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const linea: Variants = {
  oculta: { opacity: 0, y: "0.62em" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE, delay: i * 0.09 },
  }),
};

/**
 * Texto que se revela línea por línea, cada una subiendo desde detrás de la
 * anterior.
 *
 * Cada string del array es una línea: dónde corta es una decisión de
 * composición, no del navegador. Por eso los titulares de MOVA ya vienen
 * partidos en el diccionario.
 *
 * El `overflow-hidden` del span exterior es lo que hace el efecto: la línea no
 * aparece, entra desde abajo del renglón.
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
  /** Clases por línea — sirve para pintar sólo la última con el degradé. */
  lineClassName?: string;
  as?: "p" | "h1" | "h2" | "h3";
  delay?: number;
}) {
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName}`}
            custom={i + delay}
            variants={linea}
            initial="oculta"
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px" }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Filete de 1px que se dibuja de izquierda a derecha al entrar en cuadro. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`hairline origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: EASE }}
    />
  );
}
