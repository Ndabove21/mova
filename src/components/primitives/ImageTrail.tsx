"use client";

import { useEffect, useRef } from "react";

/**
 * Rastro de imágenes que aparecen al mover el puntero.
 *
 * Cada cierta distancia recorrida suelta el siguiente frame de la lista, que
 * entra, se queda un momento y se va. Para un estudio de video el efecto es
 * casi literal: el rastro son fotogramas sueltos apareciendo al pasar.
 *
 * Las imágenes se precargan al montar para que la primera pasada no salga a
 * tirones. Como el cursor, se apaga en pantallas táctiles y con movimiento
 * reducido: sin puntero no hay rastro, y el efecto es puro movimiento.
 */
export default function ImageTrail({
  items,
  /** Distancia en píxeles entre una imagen y la siguiente */
  umbral = 90,
  /** Cuánto vive cada imagen, en milisegundos */
  duracion = 900,
  /** Suelta unas imágenes al entrar en pantalla, para que se vea que hay algo
      antes de que el visitante mueva el mouse. */
  siembra = 3,
  ancho = 190,
  proporcion = 16 / 9,
  maxVisibles = 8,
  className = "",
  children,
}: {
  items: string[];
  umbral?: number;
  duracion?: number;
  siembra?: number;
  ancho?: number;
  /** ancho / alto. 16/9 porque acá los frames son de video, no fotos de board. */
  proporcion?: number;
  maxVisibles?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const zonaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zona = zonaRef.current;
    if (!zona || items.length === 0) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Precarga: sin esto la primera vuelta muestra huecos.
    items.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    let ultimaX = 0;
    let ultimaY = 0;
    let primera = true;
    let indice = 0;
    const vivas: HTMLElement[] = [];
    const relojes: number[] = [];

    /** Única fábrica de frames. El original creaba el elemento en el
     *  pointermove Y además llamaba acá, así que soltaba dos por movimiento:
     *  el de arriba quedaba sin temporizador, nunca se desvanecía y sólo salía
     *  del DOM cuando lo empujaba el tope de visibles. */
    const soltar = (x: number, y: number) => {
      const el = document.createElement("div");
      el.className = "trail-img";
      el.style.cssText = `left:${x}px;top:${y}px;width:${ancho}px;height:${Math.round(
        ancho / proporcion
      )}px;background-image:url("${items[indice % items.length]}")`;
      indice++;

      zona.appendChild(el);
      vivas.push(el);
      // Techo de elementos en pantalla: sin esto un barrido rápido llena el DOM.
      while (vivas.length > maxVisibles) vivas.shift()?.remove();

      relojes.push(
        window.setTimeout(() => {
          el.classList.add("trail-img--sale");
          relojes.push(
            window.setTimeout(() => {
              el.remove();
              const i = vivas.indexOf(el);
              if (i > -1) vivas.splice(i, 1);
            }, 500)
          );
        }, duracion)
      );
    };

    const onMove = (e: PointerEvent) => {
      const caja = zona.getBoundingClientRect();
      const x = e.clientX - caja.left;
      const y = e.clientY - caja.top;

      if (primera) {
        ultimaX = x;
        ultimaY = y;
        primera = false;
        return;
      }

      if (Math.hypot(x - ultimaX, y - ultimaY) < umbral) return;
      ultimaX = x;
      ultimaY = y;
      soltar(x, y);
    };

    zona.addEventListener("pointermove", onMove, { passive: true });

    // La siembra se dispara recién cuando la franja entra en pantalla, escalonada,
    // para que el visitante la vea aparecer y entienda que responde al movimiento.
    let observador: IntersectionObserver | undefined;
    if (siembra > 0) {
      observador = new IntersectionObserver(
        (entradas) => {
          if (!entradas[0]?.isIntersecting) return;
          observador?.disconnect();
          const caja = zona.getBoundingClientRect();
          for (let i = 0; i < siembra; i++) {
            relojes.push(
              window.setTimeout(() => {
                soltar(caja.width * (0.22 + 0.28 * i), caja.height * (i % 2 === 0 ? 0.38 : 0.6));
              }, 260 * i)
            );
          }
        },
        { threshold: 0.35 }
      );
      observador.observe(zona);
    }

    return () => {
      zona.removeEventListener("pointermove", onMove);
      observador?.disconnect();
      relojes.forEach((r) => window.clearTimeout(r));
      vivas.forEach((el) => el.remove());
    };
  }, [items, umbral, duracion, ancho, proporcion, maxVisibles, siembra]);

  return (
    <div ref={zonaRef} className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
