"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ChangeEvent, PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SectionLabel } from "@/components/primitives/SectionLabel";
import { Rule } from "@/components/primitives/motion";
import { PlaceholderTag } from "@/components/primitives/PlaceholderTag";
import type { Dictionary } from "@/i18n";

const REAL_SRC = "/images/reality.jpg";
const GENERADA_SRC = "/images/generated.jpg";

/** Mismo encuadre servido en los dos lados: un solo `sizes` para las dos capas. */
const SIZES = "(max-width: 1023px) 100vw, (max-width: 1439px) 92vw, 1360px";

/*
 * Las dos capas van SIN prop `quality`. Next 16 valida la calidad pedida
 * contra `images.qualities`, que por defecto es `[75]`: cualquier otro valor
 * hace que `/_next/image` responda 400 y la sección quede un rectángulo negro.
 * No tocar sin agregar antes el valor a `images.qualities` en next.config.ts.
 */

/** Curva del sitio. Sólo se usa cuando el cambio viene del teclado. */
const CURVA = "420ms cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Píxeles de movimiento que hacen falta para decidir hacia dónde va un gesto
 * táctil. Por debajo de esto el dedo todavía no dijo nada y no tocamos el
 * corte: así un scroll vertical que arranca encima de la pieza no se la roba.
 */
const UMBRAL_EJE = 8;

/**
 * Sección 03 — REALITY → MOVA.
 *
 * El argumento del estudio no se explica, se muestra: la misma toma a la
 * izquierda y lo que MOVA hace con ella a la derecha, con el espectador
 * moviendo el límite. Por eso el componente es una sola pieza interactiva y
 * no hay copy de apoyo más allá de dos líneas y la pista de arrastre.
 */
export function RealityMova({ t }: { t: Dictionary }) {
  const marcoRef = useRef<HTMLDivElement | null>(null);

  /** 0–100. Arranca en 50 (constante: no hay nada que hidratar distinto). */
  const [pos, setPos] = useState(50);
  /**
   * Gesto en curso. Va en ref y no en estado porque los handlers de puntero lo
   * leen y escriben de forma sincrónica dentro del mismo evento: con estado,
   * un `pointermove` que llegue antes del re-render leería el valor viejo.
   * `confirmado` = ya sabemos que el gesto es horizontal y es nuestro.
   */
  const gesto = useRef<{ x: number; y: number; confirmado: boolean } | null>(null);
  /** Último cambio hecho con teclado: sólo entonces el límite se desliza. */
  const [conTeclado, setConTeclado] = useState(false);
  const [enfocado, setEnfocado] = useState(false);
  const [reducido, setReducido] = useState(false);

  // El chequeo va en efecto, no en render: en el servidor no hay matchMedia y
  // leerlo al pintar desincronizaría la hidratación.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducido(mq.matches);
    const alCambiar = (e: MediaQueryListEvent) => setReducido(e.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  /** Posición del puntero traducida a porcentaje del marco, acotada. */
  function posDesdeX(clientX: number): number | null {
    const marco = marcoRef.current;
    if (!marco) return null;
    const caja = marco.getBoundingClientRect();
    if (caja.width === 0) return null;
    const bruto = ((clientX - caja.left) / caja.width) * 100;
    return Math.min(100, Math.max(0, bruto));
  }

  function aplicar(clientX: number) {
    const siguiente = posDesdeX(clientX);
    if (siguiente === null) return;
    setConTeclado(false);
    setPos(siguiente);
  }

  function alPulsar(e: ReactPointerEvent<HTMLDivElement>) {
    // setPointerCapture: el arrastre sigue vivo aunque el dedo o el mouse se
    // vayan fuera del marco, que es lo que uno espera al tirar del límite.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Navegador sin pointer capture: el arrastre igual funciona dentro del marco.
    }
    const conMouse = e.pointerType === "mouse";
    gesto.current = { x: e.clientX, y: e.clientY, confirmado: conMouse };
    // Con mouse el apretar es un click deliberado y el hover-scrub ya venía
    // siguiendo al puntero: saltar el corte ahí mismo es lo esperado. Con dedo
    // o lápiz no, porque el marco es `touch-pan-y` y en este instante el
    // navegador todavía no decidió si el gesto es nuestro o un scroll de
    // página; si saltáramos acá, cualquiera que scrollee la home pasando el
    // dedo por encima dejaría el comparador movido a una posición al azar.
    if (conMouse) aplicar(e.clientX);
  }

  function alMover(e: ReactPointerEvent<HTMLDivElement>) {
    // Hover-scrub: con mouse seguimos al puntero sin apretar, porque el efecto
    // así se descubre solo.
    if (e.pointerType === "mouse") {
      aplicar(e.clientX);
      return;
    }

    // Sin mouse hace falta un gesto abierto: un pointermove suelto no existe.
    const g = gesto.current;
    if (!g) return;

    if (!g.confirmado) {
      const dx = Math.abs(e.clientX - g.x);
      const dy = Math.abs(e.clientY - g.y);
      // Zona muerta: el dedo todavía no se definió, no movemos nada.
      if (dx < UMBRAL_EJE && dy < UMBRAL_EJE) return;
      // Se definió vertical: es scroll de página. Cerramos el gesto para no
      // robárselo; el `pointercancel` del navegador llega un instante después.
      if (dy >= dx) {
        gesto.current = null;
        return;
      }
      g.confirmado = true;
    }

    aplicar(e.clientX);
  }

  function alSoltar(e: ReactPointerEvent<HTMLDivElement>) {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Sin captura activa no hay nada que liberar.
    }
    gesto.current = null;
  }

  // El input está oculto y sin pointer-events, así que un change sólo puede
  // venir del teclado: ahí sí vale deslizar el límite en vez de saltarlo.
  function alCambiarRango(e: ChangeEvent<HTMLInputElement>) {
    setConTeclado(true);
    setPos(Number(e.target.value));
  }

  const suave = conTeclado && !reducido;

  const capaReal: CSSProperties = {
    clipPath: `inset(0 ${100 - pos}% 0 0)`,
    transition: suave ? `clip-path ${CURVA}` : "none",
  };

  const manija: CSSProperties = {
    left: `${pos}%`,
    transition: suave ? `left ${CURVA}` : "none",
  };

  return (
    <section
      id="reality"
      aria-labelledby="reality-titulo"
      className="relative overflow-hidden bg-black py-28 sm:py-40 lg:py-48"
    >
      {/* Luz fría del lado "realidad", muy difusa: ilumina, no rellena. */}
      <div
        aria-hidden="true"
        className="glow-blue pointer-events-none absolute -top-32 -right-24 h-[460px] w-[460px] rounded-full opacity-70 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionLabel index={t.reality.index} label={t.reality.label} />

          {/* Titular de la sección. Es micro-texto por diseño, pero sigue
              siendo el h2 que nombra el bloque. */}
          <h2
            id="reality-titulo"
            data-reveal
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
            className="text-ink-faint text-[10px] leading-[2] tracking-[0.26em] uppercase md:text-right"
          >
            {t.reality.lines.map((linea) => (
              <span key={linea} className="block">
                {linea}
              </span>
            ))}
          </h2>
        </div>

        <Rule className="mt-10" delay={200} />

        <figure data-reveal="blur" className="mt-12 sm:mt-16">
          <div
            ref={marcoRef}
            onPointerDown={alPulsar}
            onPointerMove={alMover}
            onPointerUp={alSoltar}
            onPointerCancel={alSoltar}
            data-cursor="media"
            data-cursor-label={t.cursor.drag}
            // touch-pan-y y no touch-none: el gesto horizontal es nuestro, pero
            // el scroll vertical de la página tiene que seguir funcionando
            // sobre una pieza que en mobile ocupa casi todo el alto.
            // ring en vez de border: el filete no altera la caja, así el
            // porcentaje del puntero y el del recorte coinciden exactamente.
            className="group relative aspect-[4/5] w-full cursor-ew-resize touch-pan-y overflow-hidden bg-black-2 ring-1 ring-line select-none md:aspect-[16/9]"
          >
            {/* Capa de fondo: el resultado. Va abajo para que el recorte de la
                toma real lo revele sin necesidad de un segundo clip. */}
            <div className="pointer-events-none absolute inset-0">
              <Image
                src={GENERADA_SRC}
                alt=""
                fill
                sizes={SIZES}
                className="object-cover"
              />
              {/* La etiqueta de placeholder del lado generado va en su propia
                  esquina para no taparse con la del lado real. */}
              <div className="pointer-events-none absolute top-0 right-0 h-10 w-52">
                <PlaceholderTag src={GENERADA_SRC} />
              </div>
            </div>

            {/* Capa superior: la toma real, recortada desde la derecha.
                Mismo contenedor absolute inset-0 y el mismo object-cover que
                la de abajo: si los encuadres no son idénticos, el límite deja
                de leerse como un corte y el efecto se cae. */}
            <div className="pointer-events-none absolute inset-0" style={capaReal}>
              <Image
                src={REAL_SRC}
                alt=""
                fill
                sizes={SIZES}
                className="object-cover"
              />
              <PlaceholderTag src={REAL_SRC} />
            </div>

            {/* Velo bajo: las etiquetas tienen que mantener contraste sea cual
                sea la imagen que les toque debajo. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-4 pb-4 sm:px-6 sm:pb-5">
              {/* ink-dim y no ink-faint: a 10px el contraste no puede depender
                  de qué frame toque debajo del velo. La jerarquía entre los dos
                  lados la marca el punto de oro, no la opacidad del texto. */}
              <span className="text-ink-dim text-[10px] tracking-[0.3em] uppercase">
                {t.reality.realityLabel}
              </span>
              <span className="text-ink flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase">
                <span aria-hidden="true" className="bg-gold h-[3px] w-[3px] rounded-full" />
                {t.reality.generatedLabel}
              </span>
            </div>

            {/* Control real para teclado: input range nativo, oculto a la vista
                pero enfocable. Trae gratis flechas, Home y End, y el foco se
                ve en la manija de abajo. */}
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(pos)}
              onChange={alCambiarRango}
              onFocus={() => setEnfocado(true)}
              onBlur={() => setEnfocado(false)}
              aria-label={t.reality.sliderLabel}
              aria-describedby="reality-hint"
              className="pointer-events-none sr-only"
            />

            {/* Manija. Es puro indicador: el valor lo comunica el input. */}
            <div
              aria-hidden="true"
              style={manija}
              className="bg-ink/75 pointer-events-none absolute inset-y-0 z-10 w-px -translate-x-1/2"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span
                  className={`glow-gold absolute -inset-6 rounded-full blur-md transition-opacity duration-700 ${
                    enfocado ? "opacity-100" : "opacity-0 group-hover:opacity-80"
                  }`}
                />
                <span
                  className={`text-ink relative grid h-12 w-12 place-items-center rounded-full border backdrop-blur-[2px] transition-colors duration-500 ${
                    enfocado
                      ? "border-gold bg-black/60"
                      : "border-ink/45 bg-black/35 group-hover:border-ink/80"
                  }`}
                >
                  <span className="flex items-center">
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.25} />
                    <ChevronRight className="-ml-1.5 h-4 w-4" strokeWidth={1.25} />
                  </span>
                </span>
              </div>
            </div>
          </div>

          <figcaption
            id="reality-hint"
            data-cursor="link"
            className="text-ink-faint mt-5 flex items-center gap-3 text-[10px] tracking-[0.26em] uppercase"
          >
            <span aria-hidden="true" className="hairline block w-8 shrink-0" />
            {t.reality.hint}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
