"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor con estela luminosa, dibujado en canvas.
 *
 * Los colores son los del eclipse —oro en el núcleo, halo frío en la caída— y
 * no los de un neón genérico: en un sitio que es negro con luz de canto, el
 * cursor tiene que ser otra luz de canto, no un widget pegado encima.
 *
 * Se apaga solo donde molestaría: en pantallas táctiles (no hay puntero que
 * seguir) y con `prefers-reduced-motion`. Nunca intercepta clics.
 */
export default function GlowCursor({
  color = "#e4b27a",
  secondaryColor = "#a6c6e2",
  trailLength = 24,
  trailWidth = 6,
  trailTaper = 0.85,
  followSpeed = 0.18,
  glowIntensity = 1,
  glowSpread = 1,
  hotspot = 0.55,
  brightness = 1,
  opacity = 0.42,
  pulseSpeed = 1,
  idleFade = true,
  idleTimeout = 900,
  fadeDuration = 700,
  blendMode = "screen",
  disabled = false,
}: {
  color?: string;
  secondaryColor?: string;
  trailLength?: number;
  trailWidth?: number;
  trailTaper?: number;
  followSpeed?: number;
  glowIntensity?: number;
  glowSpread?: number;
  hotspot?: number;
  brightness?: number;
  opacity?: number;
  pulseSpeed?: number;
  idleFade?: boolean;
  idleTimeout?: number;
  fadeDuration?: number;
  blendMode?: string;
  disabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* Arranca apagado y se enciende en el cliente: en el servidor no hay forma de
     saber si hay puntero fino, y renderizar el canvas igual dejaba un elemento
     muerto en pantallas táctiles y con movimiento reducido. */
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    if (disabled) return;
    // Sin puntero fino no hay nada que seguir, y con movimiento reducido molesta.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActivo(true);
  }, [disabled]);

  useEffect(() => {
    if (!activo) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let ancho = 0;
    let alto = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const medir = () => {
      ancho = window.innerWidth;
      alto = window.innerHeight;
      canvas.width = ancho * dpr;
      canvas.height = alto * dpr;
      canvas.style.width = `${ancho}px`;
      canvas.style.height = `${alto}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    medir();
    window.addEventListener("resize", medir);

    const puntero = { x: ancho / 2, y: alto / 2 };
    const seguidor = { x: puntero.x, y: puntero.y };
    const estela: { x: number; y: number }[] = [];
    let ultimoMovimiento = 0;
    let visible = 0;
    let cuadro = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      puntero.x = e.clientX;
      puntero.y = e.clientY;
      ultimoMovimiento = cuadro;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Duraciones medidas en cuadros, a ~60fps
    const cuadrosInactivo = (idleTimeout / 1000) * 60;
    const cuadrosFundido = Math.max(1, (fadeDuration / 1000) * 60);

    const dibujar = () => {
      cuadro++;
      seguidor.x += (puntero.x - seguidor.x) * followSpeed;
      seguidor.y += (puntero.y - seguidor.y) * followSpeed;

      estela.unshift({ x: seguidor.x, y: seguidor.y });
      if (estela.length > trailLength) estela.pop();

      const quieto = idleFade && cuadro - ultimoMovimiento > cuadrosInactivo;
      visible += (((quieto ? 0 : 1) - visible) / cuadrosFundido) * 4;
      visible = Math.max(0, Math.min(1, visible));

      ctx.clearRect(0, 0, ancho, alto);
      if (visible < 0.01) {
        raf = requestAnimationFrame(dibujar);
        return;
      }

      const pulso = 1 + Math.sin(cuadro * 0.03 * pulseSpeed) * 0.12;

      estela.forEach((p, i) => {
        const t = i / Math.max(1, estela.length - 1);
        // El taper adelgaza la cola; el hotspot decide dónde está el núcleo.
        const radio = trailWidth * (1 - t * trailTaper) * glowSpread * 6 * pulso;
        if (radio <= 0) return;

        const alfa = opacity * visible * glowIntensity * brightness * (1 - t) ** 1.6;
        if (alfa <= 0.002) return;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radio);
        g.addColorStop(0, mezclarAlfa(color, Math.min(1, alfa)));
        g.addColorStop(hotspot, mezclarAlfa(secondaryColor, Math.min(1, alfa * 0.4)));
        g.addColorStop(1, mezclarAlfa(secondaryColor, 0));

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radio, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(dibujar);
    };
    raf = requestAnimationFrame(dibujar);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", medir);
      window.removeEventListener("pointermove", onMove);
    };
  }, [
    activo, color, secondaryColor, trailLength, trailWidth, trailTaper,
    followSpeed, glowIntensity, glowSpread, hotspot, brightness, opacity,
    pulseSpeed, idleFade, idleTimeout, fadeDuration,
  ]);

  if (!activo) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[85] hidden md:block"
      style={{ mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"] }}
    />
  );
}

/** #rrggbb + alfa → rgba(). Acepta también rgb()/rgba() ya armados. */
function mezclarAlfa(color: string, alfa: number): string {
  if (color.startsWith("#")) {
    const h = color.slice(1);
    const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alfa})`;
  }
  return color;
}
