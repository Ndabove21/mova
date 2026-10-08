"use client";

import { useCallback, useEffect, useRef } from "react";
import { MoltenMetal } from "@/components/primitives/MoltenMetal";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Rule } from "@/components/primitives/motion";
import { RevealText } from "@/components/primitives/RevealText";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useContacto } from "@/components/layout/ContactProvider";
import type { Dictionary } from "@/i18n";

/* ==========================================================================
   Sección 05 — Experiencias inmersivas
   A la izquierda un objeto: negro, metálico, líquido, que reacciona al
   puntero. No hay three.js en el proyecto, así que la profundidad se finge
   como en matte painting —capas a distintas distancias que se desplazan a
   distintas velocidades—. Es la ilusión más barata y la más creíble.
   ========================================================================== */

/**
 * La silueta del objeto.
 *
 * Tres elipses que se suman (el `mask-composite` por defecto es `add`) en vez
 * de un círculo: un círculo perfecto leería como logo o como avatar, y lo que
 * tiene que leer es una gota de metal sin forma fija. Los radios son
 * deliberadamente desparejos —58/42/30%— para que ningún borde se repita.
 */
const SILUETA = `radial-gradient(58% 63% at 45% 40%, #000 36%, rgba(0,0,0,0.78) 64%, transparent 88%),
radial-gradient(44% 39% at 66% 67%, #000 28%, rgba(0,0,0,0.7) 58%, transparent 84%),
radial-gradient(31% 35% at 30% 69%, #000 24%, transparent 80%)`;

/**
 * Canto de luz dorada que orbita el objeto. Oro sólo en dos arcos y
 * transparente el resto del recorrido: una luz que rodea, no un aro de color.
 */
const ANILLO = `conic-gradient(
  from 140deg,
  rgba(216,178,122,0) 0deg,
  rgba(216,178,122,0.10) 44deg,
  rgba(246,221,184,0.72) 104deg,
  rgba(216,178,122,0.30) 152deg,
  rgba(216,178,122,0) 208deg,
  rgba(216,178,122,0) 296deg,
  rgba(216,178,122,0.24) 338deg,
  rgba(216,178,122,0) 360deg
)`;

/** 1px real: el filete se recorta contra el borde exterior, no se dibuja dentro. */
const MASCARA_ANILLO =
  "radial-gradient(closest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))";

type Capa = {
  /** Caja de la capa dentro del cuadrado. */
  caja: string;
  /** Degradado propio cuando el halo de la hoja de estilos no alcanza. */
  fondo?: string;
  /** Desplazamiento máximo en px. Cuanto más cerca lee la capa, más se mueve. */
  fx: number;
  fy: number;
};

/**
 * Seis capas. Los factores van de 6 a 26px y con signos cruzados: si todas
 * se fueran para el mismo lado el conjunto se leería como una sola imagen
 * movida, y lo que da volumen es justamente que se separen entre sí.
 */
const CAPAS: Capa[] = [
  // Halo frío general, lo más lejano: apenas se mueve.
  { caja: "glow-blue -inset-[13%] blur-3xl opacity-80 mix-blend-screen", fx: -7, fy: 11 },
  // Núcleo azul profundo: la masa del objeto, lo que lo hace pesar.
  {
    caja: "inset-[8%] blur-3xl mix-blend-screen",
    fondo:
      "radial-gradient(closest-side, rgba(69,107,133,0.55), rgba(69,107,133,0.10) 58%, transparent 100%)",
    fx: 6,
    fy: -9,
  },
  // Luz cálida de contra, arriba a la derecha.
  { caja: "glow-gold top-[-9%] right-[-7%] h-[64%] w-[64%] blur-3xl mix-blend-screen", fx: -15, fy: 10 },
  // Rebote frío, abajo a la izquierda.
  { caja: "glow-blue bottom-[-11%] left-[-5%] h-[58%] w-[58%] blur-2xl mix-blend-screen", fx: 18, fy: -13 },
  // Oro sobre el metal: en `overlay` tiñe los medios tonos de la foto y deja
  // el negro negro. Si fuera `screen` lavaría el fondo y ya no sería iluminación.
  { caja: "glow-gold top-[27%] left-[17%] h-[36%] w-[36%] blur-2xl mix-blend-overlay", fx: 26, fy: 21 },
  // Especular: el reflejo chico y duro que delata la superficie líquida.
  {
    caja: "top-[21%] left-[52%] h-[22%] w-[22%] blur-2xl mix-blend-screen",
    fondo:
      "radial-gradient(closest-side, rgba(255,249,238,0.40), rgba(255,249,238,0.06) 46%, transparent 100%)",
    fx: -23,
    fy: -18,
  },
];

export function Immersive({ t }: { t: Dictionary }) {
  const { abrir } = useContacto();

  const caja = useRef<HTMLDivElement | null>(null);
  const capas = useRef<Array<HTMLDivElement | null>>([]);
  const foto = useRef<HTMLDivElement | null>(null);

  // Posición objetivo (−1..1 desde el centro) y posición actual, en refs: el
  // parallax se escribe directo al DOM. Con estado de React, cada píxel de
  // movimiento del puntero volvería a renderizar seis capas con blur.
  const destino = useRef({ x: 0, y: 0 });
  const actual = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  const bucle = useCallback(() => {
    const { x: dx, y: dy } = destino.current;
    const a = actual.current;

    // 0.07 es lento a propósito: el objeto tiene que arrastrarse como líquido
    // pesado, no pegarse al puntero como un reflejo.
    a.x += (dx - a.x) * 0.07;
    a.y += (dy - a.y) * 0.07;

    for (let i = 0; i < CAPAS.length; i++) {
      const el = capas.current[i];
      if (!el) continue;
      const c = CAPAS[i];
      el.style.transform = `translate3d(${(a.x * c.fx).toFixed(2)}px, ${(a.y * c.fy).toFixed(2)}px, 0)`;
    }
    // La foto se mueve menos que cualquier halo: es el cuerpo, no la luz.
    // Acá va SÓLO el desplazamiento. La sobre-escala la sostiene la clase
    // `scale-[1.04]`, que en Tailwind v4 compila a la propiedad independiente
    // `scale` y no a `transform`: las dos se multiplican en vez de pisarse, así
    // que repetir el scale acá daría 1.0816 de golpe al entrar el puntero.
    if (foto.current) {
      foto.current.style.transform = `translate3d(${(a.x * 7).toFixed(2)}px, ${(a.y * 7).toFixed(2)}px, 0)`;
    }

    // Cortamos el bucle cuando ya no queda nada que mover: un rAF eterno por
    // una sección decorativa es batería tirada.
    if (Math.abs(dx - a.x) > 0.0015 || Math.abs(dy - a.y) > 0.0015) {
      raf.current = requestAnimationFrame(bucle);
    } else {
      raf.current = null;
    }
  }, []);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    // Quieto si el sistema pidió menos movimiento. Y sólo con puntero fino:
    // en touch el `pointermove` llega mientras se scrollea, así que el objeto
    // temblaría al pasar la sección sin que nadie lo haya tocado.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const arrancar = () => {
      if (raf.current === null) raf.current = requestAnimationFrame(bucle);
    };

    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      destino.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      destino.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      arrancar();
    };

    // Al salir vuelve al centro con la misma inercia: el objeto se reacomoda,
    // no se resetea de golpe.
    const salir = () => {
      destino.current.x = 0;
      destino.current.y = 0;
      arrancar();
    };

    el.addEventListener("pointermove", mover, { passive: true });
    el.addEventListener("pointerleave", salir);
    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", salir);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [bucle]);

  // El metal se reserva para la última palabra del titular: con el degradado
  // en las tres, deja de ser un acento y pasa a ser el color del texto.
  const titulo = t.immersive.title.map((palabra, i) =>
    i === t.immersive.title.length - 1 ? <span className="text-metal">{palabra}</span> : palabra
  );

  return (
    <section
      id="immersive"
      // Nombra la región sin duplicar el titular en un nodo oculto: el h2
      // entra animado por líneas y no expone un id al que apuntar.
      aria-label={t.immersive.label}
      // overflow-hidden porque los halos salen del cuadrado y en mobile
      // llegarían más allá del viewport.
      className="relative overflow-hidden bg-black py-28 sm:py-40 lg:py-48"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-7">
          <SectionLabel index={t.immersive.index} label={t.immersive.label} />
          <div data-reveal style={{ "--reveal-delay": "140ms" } as React.CSSProperties}>
            <MagneticButton variant="outline" icon="arrow" onClick={abrir}>
              {t.immersive.cta}
            </MagneticButton>
          </div>
        </header>

        <Rule className="mt-9" delay={200} />

        <div className="mt-16 grid grid-cols-1 items-center gap-y-16 sm:mt-20 lg:mt-24 lg:grid-cols-12 lg:gap-x-16">
          {/* En mobile el titular va primero: el objeto es la ilustración de
              una idea, y la idea se lee antes. En desktop vuelve a la izquierda.

              Sin `data-cursor`: el objeto reacciona al puntero pero no es un
              enlace ni abre nada. El anillo de 50px significa "clickeable" en
              el resto del sitio, y acá sería una promesa de click que no existe.
              El parallax no depende del atributo: los listeners van en `caja`. */}
          <figure className="group order-2 mx-auto w-full max-w-[560px] lg:order-1 lg:col-span-7 lg:max-w-[620px]">
            <div
              ref={caja}
              data-reveal="blur"
              className="relative isolate aspect-square"
              style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            >
              {/* Cuerpo: la foto recortada con la silueta orgánica. El filtro
                  vive acá y no en la imagen para no pelearse con `.img-cine`,
                  que sigue devolviéndole color en hover. */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: SILUETA,
                  maskImage: SILUETA,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                }}
              >
                <div ref={foto} className="h-full w-full scale-[1.04]">
                  {/* El cuerpo de la gota es metal fundido de verdad, no una
                      foto desaturada: un campo de ruido con deformación de
                      dominio, plegado para que aparezcan cantos duros. Es lo
                      que la sección pedía —una forma metálica y líquida que
                      reacciona al puntero— y además es la misma materia del
                      isologo del hero, así que el sitio abre y vuelve sobre lo
                      mismo. Se pinta a media resolución: va detrás de una
                      máscara orgánica y de seis halos con blur, nadie ve el
                      píxel. */}
                  <MoltenMetal
                    className="h-full w-full"
                    color1="#06060a"
                    color2="#6f6354"
                    color3="#f2e3c6"
                    speed={0.26}
                    scale={2.6}
                    detail={4}
                    glow={1.5}
                    coreSize={0.11}
                    swirl={1.15}
                    fold={-0.3}
                    blackPoint={0.05}
                    brightness={1.05}
                    grain
                    grainIntensity={0.035}
                    mouseInteraction
                    mouseStrength={0.45}
                    quality={0.45}
                  />
                </div>
              </div>

              {/* Halos: cada uno a su distancia, cada uno para su lado. */}
              {CAPAS.map((c, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  ref={(el) => {
                    capas.current[i] = el;
                  }}
                  className={`pointer-events-none absolute rounded-full ${c.caja}`}
                  // `will-change` y no sólo el translate3d: un elemento con
                  // mix-blend-mode no se compone aislado —necesita el backdrop
                  // del grupo—, así que sin promover la capa de antemano el
                  // primer pointermove repinta seis superficies con 64px de
                  // blur en el mismo frame. El tirón se ve justo ahí.
                  style={{ ...(c.fondo ? { background: c.fondo } : {}), willChange: "transform" }}
                />
              ))}

              {/* Canto de luz en órbita, por encima de todo. */}
              <div
                aria-hidden="true"
                className="animate-rim pointer-events-none absolute inset-[3%] rounded-full"
                style={{
                  background: ANILLO,
                  WebkitMask: MASCARA_ANILLO,
                  mask: MASCARA_ANILLO,
                }}
              />
            </div>
          </figure>

          <div className="order-1 lg:order-2 lg:col-span-5 lg:self-center">
            <RevealText
              as="h2"
              lines={titulo}
              className="font-serif text-[clamp(2rem,5.5vw,4.2rem)] leading-[1.02] tracking-[-0.025em]"
            />
            <p
              data-reveal="blur"
              style={{ "--reveal-delay": "260ms" } as React.CSSProperties}
              className="mt-8 max-w-[38ch] text-[1.0625rem] leading-[1.65] text-ink-dim"
            >
              {t.immersive.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
