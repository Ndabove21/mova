"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * MOVA armado letra por letra.
 *
 * El cliente mandó la M, el aro, la V y la A como piezas sueltas, así que el
 * logotipo no es una imagen: se compone acá. Eso permite que cada letra entre
 * por su cuenta —que es lo que convierte la portada en un plano y no en un
 * encabezado— y que el conjunto siga siendo nítido a cualquier densidad,
 * porque cada pieza se sirve en su propio tamaño.
 *
 * Las proporciones salen de medir las piezas recortadas y ajustar el espaciado
 * a ojo, no de repartir el ancho en partes iguales:
 *
 * - La O va un 7% más alta que las demás. Es un círculo, y un círculo a la
 *   misma altura que una letra de remates rectos se ve más chico: necesita
 *   desbordar arriba y abajo para leer del mismo tamaño. Ese 7% ya está
 *   DENTRO del ancho porcentual —las medidas se tomaron sobre las piezas ya
 *   escaladas—, así que no hay que volver a aplicarlo.
 * - El par V–A lleva un gap NEGATIVO. Las dos son diagonales que se abren en
 *   direcciones opuestas, así que el hueco óptico entre ellas es mucho mayor
 *   que el real; sin meterlas una dentro de la otra, "MOVA" se lee como
 *   "MOV A".
 *
 * El alineado es al centro vertical y no a la línea de base, justamente porque
 * la O desborda parejo arriba y abajo.
 */

type Pieza = { letra: "M" | "O" | "V" | "A"; ancho: number; gap: number };

const PIEZAS: Pieza[] = [
  { letra: "M", ancho: 30.154, gap: 0.237 },
  { letra: "O", ancho: 19.628, gap: 0.119 },
  { letra: "V", ancho: 26.593, gap: -1.108 },
  { letra: "A", ancho: 24.377, gap: 0 },
];

/** Medidas de origen, para que next/image reserve el espacio exacto. */
const FUENTE: Record<Pieza["letra"], [number, number]> = {
  M: [1514, 835],
  O: [1225, 1109],
  V: [1483, 956],
  A: [1406, 959],
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function MovaLockup({
  className = "",
  /** Segundos antes de que entre la primera letra. */
  delay = 0,
  priority = false,
  sizes = "(max-width: 768px) 88vw, 900px",
}: {
  className?: string;
  delay?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const reducido = useReducedMotion() ?? false;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="img"
      aria-label="MOVA"
    >
      {PIEZAS.map((p, i) => (
        <motion.span
          key={p.letra}
          className="relative block shrink-0"
          style={{
            width: `${p.ancho}%`,
            marginRight: `${p.gap}%`,
          }}
          initial={reducido ? false : { opacity: 0, y: 26, filter: "blur(16px)" }}
          animate={reducido ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.3, ease: EASE, delay: delay + i * 0.18 }}
        >
          <Image
            src={`/images/letras/${p.letra}.png`}
            alt=""
            width={FUENTE[p.letra][0]}
            height={FUENTE[p.letra][1]}
            sizes={sizes}
            priority={priority}
            className="h-auto w-full select-none"
          />
        </motion.span>
      ))}
    </div>
  );
}
