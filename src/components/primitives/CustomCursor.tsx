"use client";

import { useEffect, useRef, useState } from "react";

type Modo = "idle" | "link" | "button" | "media";

/**
 * Cursor propio.
 *
 * Un punto de 8px que sigue al puntero al instante y un anillo que lo
 * persigue con retardo. Los elementos se declaran con `data-cursor`:
 *
 *   data-cursor="link"                       → el anillo se abre a 50px
 *   data-cursor="button"                     → anillo con una flecha
 *   data-cursor="media" data-cursor-label=".." → anillo grande con texto
 *
 * Se monta sólo donde hay puntero fino y el sistema no pidió menos
 * movimiento: en touch no hay cursor nativo que reemplazar, y ocultarlo sin
 * tener con qué sustituirlo dejaría la página sin ningún indicador.
 */
export function CustomCursor() {
  const punto = useRef<HTMLDivElement>(null);
  const anillo = useRef<HTMLDivElement>(null);
  const [montado, setMontado] = useState(false);
  const [modo, setModo] = useState<Modo>("idle");
  const [etiqueta, setEtiqueta] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMontado(true);
  }, []);

  useEffect(() => {
    if (!montado) return;
    const raiz = document.documentElement;
    raiz.classList.add("cursor-activo");

    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let ax = px;
    let ay = py;
    let raf = 0;

    const mover = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (punto.current) {
        punto.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      }
    };

    const tick = () => {
      ax += (px - ax) * 0.18;
      ay += (py - ay) * 0.18;
      if (anillo.current) {
        anillo.current.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const sobre = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      if (!el) {
        setModo("idle");
        setEtiqueta("");
        return;
      }
      const m = (el.dataset.cursor as Modo) || "link";
      setModo(m);
      setEtiqueta(el.dataset.cursorLabel ?? "");
    };

    const salir = () => {
      setModo("idle");
      setEtiqueta("");
    };

    window.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerover", sobre, { passive: true });
    document.addEventListener("pointerleave", salir);

    return () => {
      raiz.classList.remove("cursor-activo");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerover", sobre);
      document.removeEventListener("pointerleave", salir);
    };
  }, [montado]);

  if (!montado) return null;

  return (
    <>
      <div ref={punto} className="cursor-punto" aria-hidden="true" />
      <div
        ref={anillo}
        className="cursor-anillo"
        data-activo={modo !== "idle"}
        data-modo={modo}
        aria-hidden="true"
      >
        {modo === "media" && etiqueta}
        {modo === "button" && (
          <svg viewBox="0 0 16 10" className="h-2.5 w-4 fill-none stroke-current" strokeWidth="1.2">
            <path d="M0 5h14M10 1l4 4-4 4" />
          </svg>
        )}
      </div>
    </>
  );
}
