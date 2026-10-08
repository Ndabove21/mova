"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fondo de mosaicos de vidrio.
 *
 * Una retícula de piezas traslúcidas con bisel, por las que recorre una onda
 * de luz en diagonal. Al pasar el puntero, las piezas que tiene debajo se
 * encienden: el vidrio reacciona a la mano.
 *
 * Decisiones que importan:
 *
 * - Los tintes son los de la marca —oro, plata, azul— y no un arcoíris. El
 *   sitio entero se apoya en que el color sea LUZ y no relleno; un mosaico
 *   multicolor detrás de todo rompería esa regla y arrastraría la página a la
 *   estética de plantilla que el brief descarta. Para la versión literal está
 *   `vivid`.
 *
 * - La retícula se arma recién en el cliente, cuando ya se midió el viewport.
 *   En el servidor devuelve null: así no hay dos árboles distintos que
 *   reconciliar y no se cae la hidratación.
 *
 * - La variación por pieza sale de un hash del índice, no de Math.random():
 *   el dibujo es el mismo en cada render y en cada visita.
 *
 * - La luz del puntero se escribe por ref sobre un puñado de piezas, no por
 *   estado: un setState por cada movimiento del mouse re-renderizaría ciento
 *   y pico de nodos sesenta veces por segundo.
 */

/** Ruido determinista en [0,1) a partir del índice. */
function hash(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const TINTES_MARCA = [
  "216, 178, 122", // oro
  "191, 197, 204", // plata
  "143, 185, 216", // azul
  "191, 197, 204",
  "216, 178, 122",
] as const;

/** Variante multicolor literal, por si se prefiere el efecto original. */
const TINTES_VIVID = [
  "216, 178, 122",
  "143, 185, 216",
  "198, 164, 214",
  "138, 206, 190",
  "224, 150, 140",
] as const;

export function GlassTiles({
  /** Lado aproximado de cada pieza, en px. Más grande = más barato y más calmo. */
  size = 148,
  /** Opacidad global de la capa. */
  opacity = 1,
  /** Encender las piezas bajo el puntero. */
  interactive = true,
  /** Multicolor en vez de la paleta de marca. */
  vivid = false,
  className = "",
}: {
  size?: number;
  opacity?: number;
  interactive?: boolean;
  vivid?: boolean;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [rejilla, setRejilla] = useState<{ cols: number; rows: number } | null>(null);
  const [quieto, setQuieto] = useState(false);

  // Medir y rearmar la retícula con el tamaño real del contenedor.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    setQuieto(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const medir = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const cols = Math.max(3, Math.ceil(r.width / size));
      const rows = Math.max(3, Math.ceil(r.height / size));
      // Techo de piezas: por encima de esto el navegador compone más capas de
      // las que el efecto justifica.
      const max = 190;
      const factor = cols * rows > max ? Math.sqrt((cols * rows) / max) : 1;
      setRejilla({
        cols: Math.max(3, Math.round(cols / factor)),
        rows: Math.max(3, Math.round(rows / factor)),
      });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [size]);

  // Luz que sigue al puntero.
  useEffect(() => {
    const el = host.current;
    if (!el || !rejilla || !interactive || quieto) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const piezas = Array.from(el.querySelectorAll<HTMLElement>("[data-gt]"));
    let px = -1;
    let py = -1;
    let raf = 0;
    let encendidas: HTMLElement[] = [];

    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const salir = () => {
      px = -1;
      py = -1;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const w = r.width / rejilla.cols;
      const h = r.height / rejilla.rows;

      for (const p of encendidas) p.style.setProperty("--gt-lit", "0");
      encendidas = [];
      if (px < 0) return;

      const cx = Math.floor(px / w);
      const cy = Math.floor(py / h);
      // Vecindario de 5×5 con caída: enciende un área, no una sola pieza.
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const c = cx + dx;
          const f = cy + dy;
          if (c < 0 || f < 0 || c >= rejilla.cols || f >= rejilla.rows) continue;
          const pieza = piezas[f * rejilla.cols + c];
          if (!pieza) continue;
          const d = Math.hypot(dx, dy) / 2.6;
          const v = Math.max(0, 1 - d) ** 1.8;
          if (v < 0.02) continue;
          pieza.style.setProperty("--gt-lit", v.toFixed(3));
          encendidas.push(pieza);
        }
      }
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerleave", salir);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerleave", salir);
      for (const p of encendidas) p.style.removeProperty("--gt-lit");
    };
  }, [rejilla, interactive, quieto]);

  const tintes = vivid ? TINTES_VIVID : TINTES_MARCA;

  return (
    <div
      ref={host}
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {rejilla && (
        <div
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: `repeat(${rejilla.cols}, 1fr)`,
            gridTemplateRows: `repeat(${rejilla.rows}, 1fr)`,
          }}
        >
          {Array.from({ length: rejilla.cols * rejilla.rows }, (_, i) => {
            const col = i % rejilla.cols;
            const fila = Math.floor(i / rejilla.cols);
            const r = hash(i);
            // El retardo baja en diagonal: la luz cruza el mosaico como una ola.
            // La ola baja en diagonal, pero con bastante ruido por pieza: una
            // diagonal perfecta se lee como barrido de plantilla.
            const delay = (col + fila) * 0.26 + r * 4.2;
            return (
              <span
                key={i}
                data-gt
                className="gt-tile"
                style={
                  {
                    "--gt-tint": tintes[Math.floor(r * tintes.length)],
                    "--gt-base": (0.18 + hash(i * 7 + 3) * 0.82).toFixed(2),
                    "--gt-delay": quieto ? "0s" : `-${delay.toFixed(2)}s`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
