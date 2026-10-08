"use client";

import { useEffect, useRef } from "react";
import { CineImage } from "@/components/primitives/CineImage";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Rule } from "@/components/primitives/motion";
import { RevealText } from "@/components/primitives/RevealText";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { useContacto } from "@/components/layout/ContactProvider";
import type { Dictionary } from "@/i18n";

/* ==========================================================================
   Sección 07 — ABOUT
   Doble página de revista: a la izquierda un retrato vertical, a la derecha
   el texto con mucho aire. El único movimiento propio es el parallax de la
   imagen —si el bloque de texto también se desplazara, la página entera
   parecería desarmarse al scrollear—.
   ========================================================================== */

/**
 * Margen de la capa de imagen por fuera del marco, en porcentaje de su alto.
 * La capa mide 100% + 2 × MARGEN y arranca corrida hacia arriba, así el
 * parallax puede moverla sin que nunca se vea el fondo detrás.
 */
const MARGEN = 0.08;

/**
 * Amplitud del desplazamiento, en porcentaje del alto del marco. Tiene que ser
 * menor que MARGEN: a 5.5% contra 8% quedan 2.5 puntos de reserva para los
 * redondeos del navegador y para el rebote del scroll suave.
 */
const AMPLITUD = 0.055;

export function About({ t }: { t: Dictionary }) {
  const { abrir } = useContacto();

  const marco = useRef<HTMLDivElement | null>(null);
  const capa = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const elMarco = marco.current;
    const elCapa = capa.current;
    if (!elMarco || !elCapa) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    // El parallax es de escritorio. En mobile la imagen ocupa casi todo el
    // ancho y el recorrido del dedo es largo: el desplazamiento se leería como
    // un deslizamiento de la foto, no como profundidad.
    const ancho = window.matchMedia("(min-width: 1024px)");

    let raf: number | null = null;
    let activo = false;

    const pintar = () => {
      raf = null;
      const r = elMarco.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Recorrido normalizado del marco por la pantalla: +1 cuando acaba de
      // asomar por abajo, 0 cuando está centrado, −1 cuando termina de salir
      // por arriba. Normalizar por (medio viewport + medio marco) y no por el
      // viewport solo es lo que hace que el 0 caiga exactamente en el centro.
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      const limitado = p < -1 ? -1 : p > 1 ? 1 : p;

      // El signo negativo es todo el efecto: mientras el marco sube, el
      // contenido baja dentro de él, o sea se queda atrás respecto de la
      // página. Con el signo positivo la imagen se adelantaría.
      elCapa.style.transform = `translate3d(0, ${(-limitado * r.height * AMPLITUD).toFixed(2)}px, 0)`;
    };

    // El scroll dispara muchas más veces que los frames que se pintan: se
    // agenda un solo rAF por frame y se descartan los avisos intermedios.
    const alScrollear = () => {
      if (raf === null) raf = requestAnimationFrame(pintar);
    };

    const encender = () => {
      if (activo) return;
      activo = true;
      window.addEventListener("scroll", alScrollear, { passive: true });
      window.addEventListener("resize", alScrollear, { passive: true });
      alScrollear();
    };

    const apagar = () => {
      if (!activo) return;
      activo = false;
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      // Se devuelve la capa a su posición de reposo: si se apagó por un cambio
      // de ancho, quedaría congelada en el último desplazamiento.
      elCapa.style.transform = "";
    };

    // Se reevalúa ante cada cambio de media query —rotar una tablet o cambiar
    // la preferencia del sistema no debería dejar el efecto a medias—.
    const evaluar = () => {
      if (quieto.matches || !ancho.matches) apagar();
      else encender();
    };

    evaluar();
    quieto.addEventListener("change", evaluar);
    ancho.addEventListener("change", evaluar);

    return () => {
      quieto.removeEventListener("change", evaluar);
      ancho.removeEventListener("change", evaluar);
      apagar();
    };
  }, []);

  return (
    <section
      id="about"
      aria-labelledby="about-titulo"
      // overflow-hidden: el halo cálido sale del contenedor por la derecha y
      // en mobile empujaría el scroll horizontal.
      className="relative overflow-hidden bg-black-2 py-28 sm:py-40 lg:py-48"
    >
      {/* Luz cálida difusa detrás de la columna de texto: el eco del haz que
          atraviesa la foto, para que las dos mitades compartan una sola
          fuente de luz en lugar de leerse como dos piezas pegadas. */}
      <div
        aria-hidden="true"
        className="glow-gold pointer-events-none absolute top-[12%] right-[-14rem] h-[640px] w-[640px] opacity-45 blur-[90px]"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionLabel index={t.about.index} label={t.about.label} />

        <Rule className="mt-9" delay={160} />

        <div className="mt-16 grid grid-cols-1 items-center gap-y-14 sm:mt-20 lg:mt-24 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-0">
          {/* En mobile la imagen abre el bloque: es el plano de establecimiento
              y el titular entra después, ya con el clima puesto. */}
          <figure className="group mx-auto w-full max-w-[460px] sm:max-w-[520px] lg:col-span-5 lg:mx-0 lg:max-w-none">
            <div
              ref={marco}
              data-reveal="blur"
              className="relative aspect-[3/4] overflow-hidden border border-line-soft bg-black"
            >
              <div
                ref={capa}
                // La capa se desborda arriba y abajo por MARGEN para que el
                // parallax tenga de dónde moverse. Se usa inset-y negativo y no
                // un alto en porcentaje: con aspect-ratio en el padre, el alto
                // porcentual depende de que el navegador lo resuelva como
                // definido, y los insets no dependen de eso.
                // will-change evita que vuelva a promover la capa en cada frame.
                // El margen sale de la constante para que no pueda desfasarse
                // de AMPLITUD y dejar el fondo a la vista.
                className="absolute inset-x-0 will-change-transform"
                style={{ top: `${-MARGEN * 100}%`, bottom: `${-MARGEN * 100}%` }}
              >
                <CineImage
                  src="/images/about.jpg"
                  alt=""
                  className="h-full w-full"
                  sizes="(min-width: 1024px) 45vw, (min-width: 640px) 520px, 92vw"
                  // Sin velo: no hay texto encima y el degradado a negro se
                  // comería el pie del paisaje, que es donde camina la figura.
                  overlay={false}
                  quality={80}
                />
              </div>

              {/* Canto de luz sobre el borde interno izquierdo: oro como
                  iluminación de recorte, en 1px, nunca como relleno. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-px"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(216,178,122,0.5) 34%, rgba(216,178,122,0.08) 74%, transparent)",
                }}
              />
            </div>
          </figure>

          {/* alt="" arriba porque la imagen es ambiente: lo que cuenta la
              sección está en este titular y en este párrafo. */}
          <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <div id="about-titulo">
              <RevealText
                as="h2"
                lines={t.about.title}
                className="font-serif text-[clamp(2rem,5.5vw,4.2rem)] leading-[1.02] tracking-[-0.025em]"
              />
            </div>

            <p
              data-reveal="blur"
              style={{ "--reveal-delay": "280ms" } as React.CSSProperties}
              className="mt-8 max-w-[42ch] text-[1.0625rem] leading-[1.65] text-ink-dim"
            >
              {t.about.body}
            </p>

            <div
              data-reveal
              style={{ "--reveal-delay": "420ms" } as React.CSSProperties}
              className="mt-12"
            >
              <MagneticButton variant="outline" icon="arrow" onClick={abrir}>
                {t.about.cta}
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
