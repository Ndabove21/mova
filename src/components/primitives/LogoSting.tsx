"use client";

import { useEffect, useRef } from "react";

/**
 * El isologo de MOVA, renderizado.
 *
 * Reemplaza al video de recepción por la misma idea dibujada en vectores: el
 * master que mandó el cliente es de 1280×720 y el hero lo pintaba a 2880 px
 * físicos en una pantalla retina —2,25× de escalado—, así que se veía blando.
 * Acá no hay resolución: las letras son trazos y el brillo es un gradiente, de
 * modo que a cualquier densidad el canto queda limpio.
 *
 * Tres capas, de atrás hacia adelante:
 *   1. Partículas en canvas (polvo cálido y frío a la deriva).
 *   2. Las letras: un bloom difuso detrás y el trazo metálico encima.
 *   3. Un reflejo angosto que cruza las letras, recortado con una máscara SVG
 *      —las máscaras SVG sí aceptan trazos, los clip-path de CSS no—.
 *
 * El descriptor y el claim son texto HTML, no píxeles quemados: ahora los lee
 * Google y los lee un lector de pantalla.
 */

/** Grosor del trazo a escala de recepción. En el nav y el footer va 20. */
const TRAZO = 26;

const PATHS = (
  <>
    {/* M */}
    <polyline points="15,220 15,22 105,205 195,22 195,220" />
    {/* O */}
    <circle cx="320" cy="121" r="99" />
    {/* V */}
    <polyline points="460,22 545,218 630,22" />
    {/* A */}
    <polyline points="690,220 775,22 860,220" />
    <line x1="721" y1="152" x2="829" y2="152" />
  </>
);

export function LogoSting({
  className = "",
  /** Texto bajo el logotipo */
  descriptor,
  claim,
  paused = false,
}: {
  className?: string;
  descriptor: string;
  claim: string;
  /** Detiene partículas y reflejo, igual que el botón de pausa del video. */
  paused?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const host = useRef<HTMLDivElement>(null);
  // Por ref y no por dependencia: no hace falta rearmar el canvas al pausar.
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const cv = canvas.current;
    const box = host.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || !box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    type P = {
      x: number; y: number; r: number;
      vx: number; vy: number;
      a: number; calida: boolean; brillo: boolean;
    };
    let motas: P[] = [];

    const nueva = (inicial: boolean): P => ({
      x: Math.random() * w,
      y: inicial ? Math.random() * h : h + 40,
      // Casi todas chicas; unas pocas grandes hacen el bokeh.
      r: Math.random() < 0.07 ? 6 + Math.random() * 11 : 1 + Math.random() * 3.2,
      vx: (Math.random() - 0.5) * 0.14,
      vy: -(0.08 + Math.random() * 0.3),
      a: 0.12 + Math.random() * 0.5,
      calida: Math.random() < 0.68,
      brillo: Math.random() < 0.08,
    });

    const medir = () => {
      const r = box.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // La densidad sigue al área: en un teléfono no hacen falta 140 motas.
      const n = Math.round(Math.min(150, Math.max(40, (w * h) / 11000)));
      motas = Array.from({ length: n }, () => nueva(true));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(box);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(box);

    let t = 0;
    const dibujar = () => {
      raf = requestAnimationFrame(dibujar);
      if (!visible || pausedRef.current) return;
      t += 0.0055;
      ctx.clearRect(0, 0, w, h);

      for (const p of motas) {
        p.x += p.vx + Math.sin(t + p.y * 0.012) * 0.16;
        p.y += p.vy;
        if (p.y < -40) Object.assign(p, nueva(false));

        const alfa = p.a * (p.brillo ? 0.9 + Math.sin(t * 9 + p.x) * 0.4 : 1);
        if (alfa <= 0.01) continue;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        const c = p.calida ? "216,178,122" : "143,185,216";
        g.addColorStop(0, `rgba(${p.brillo ? "255,250,242" : c}, ${Math.min(1, alfa)})`);
        g.addColorStop(0.45, `rgba(${c}, ${alfa * 0.35})`);
        g.addColorStop(1, `rgba(${c}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(dibujar);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={host} className={`relative ${className}`}>
      {/* Halos del eclipse: cálido arriba a la derecha, frío abajo a la izquierda */}
      <div
        aria-hidden="true"
        className="glow-gold animate-breathe pointer-events-none absolute top-[6%] left-[18%] h-[70%] w-[70%] rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="glow-halo pointer-events-none absolute bottom-[4%] left-[6%] h-[60%] w-[60%] rounded-full blur-3xl"
      />

      <canvas
        ref={canvas}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      />

      <div className="relative flex h-full flex-col items-center justify-center px-5">
        <svg
          viewBox="0 0 875 240"
          className="w-[min(78vw,980px)]"
          role="img"
          aria-label="MOVA"
          fill="none"
        >
          <defs>
            {/* El metal: frío a la izquierda, brillo al centro, oro a la derecha */}
            <linearGradient
              id="sting-metal"
              gradientUnits="userSpaceOnUse"
              x1="15"
              y1="10"
              x2="860"
              y2="230"
            >
              <stop offset="0%" stopColor="#8fa6b8" />
              <stop offset="14%" stopColor="#cfdbe6" />
              <stop offset="33%" stopColor="#ffffff" />
              <stop offset="48%" stopColor="#e9e5df" />
              <stop offset="62%" stopColor="#d6cdbf" />
              <stop offset="76%" stopColor="#e4b27a" />
              <stop offset="90%" stopColor="#f6ddb8" />
              <stop offset="100%" stopColor="#b1763a" />
            </linearGradient>

            {/* El reflejo que cruza */}
            <linearGradient id="sting-sweep" gradientUnits="userSpaceOnUse" x1="0" x2="300">
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="45%" stopColor="#fffdf8" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#fff6e6" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* Las máscaras SVG sí aceptan trazos; los clip-path de CSS, no. */}
            <mask id="sting-mask" maskUnits="userSpaceOnUse" x="-40" y="-40" width="955" height="320">
              <g
                stroke="#fff"
                strokeWidth={TRAZO}
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="12"
                fill="none"
              >
                {PATHS}
              </g>
            </mask>

            <filter id="sting-bloom" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>

          {/* Bloom: una copia difusa que le da peso de luz al trazo */}
          <g
            stroke="url(#sting-metal)"
            strokeWidth={TRAZO}
            strokeLinejoin="miter"
            strokeMiterlimit="12"
            filter="url(#sting-bloom)"
            opacity="0.5"
          >
            {PATHS}
          </g>

          {/* El trazo */}
          <g
            stroke="url(#sting-metal)"
            strokeWidth={TRAZO}
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeMiterlimit="12"
          >
            {PATHS}
          </g>

          {/* El reflejo, recortado contra las letras */}
          <g mask="url(#sting-mask)" style={{ mixBlendMode: "screen" }}>
            <rect
              className={`sting-sweep ${paused ? "is-paused" : ""}`}
              x="-340"
              y="-40"
              width="300"
              height="320"
              fill="url(#sting-sweep)"
            />
          </g>
        </svg>

        {/* Descriptor y claim: texto de verdad, no píxeles quemados en un video */}
        <p className="text-ink-dim mt-7 text-center text-[0.58rem] tracking-[0.58em] uppercase sm:mt-9 sm:text-[0.72rem] sm:tracking-[0.72em]">
          {descriptor}
        </p>
        <p className="text-ink-faint mt-4 text-center text-[0.55rem] tracking-[0.38em] uppercase sm:mt-5 sm:text-[0.66rem] sm:tracking-[0.46em]">
          {claim}
        </p>
      </div>
    </div>
  );
}
