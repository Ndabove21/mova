"use client";

import { useEffect, useRef } from "react";

/**
 * Metal fundido.
 *
 * Un campo de ruido fractal con deformación de dominio, plegado sobre sí mismo
 * para que aparezcan cantos duros —los pliegues son lo que hace que lea como
 * metal líquido y no como humo—, iluminado por un realce especular sobre esos
 * cantos.
 *
 * Es un único fragment shader en WebGL2, sin three.js: traer un motor 3D
 * entero (~150 KB) para dibujar un cuadrado a pantalla completa no se paga.
 *
 * Cuidados de rendimiento, porque esto es un FONDO y no puede comerse el
 * presupuesto de la página:
 *   - se dibuja a resolución reducida (`quality`) y se estira; es un campo
 *     difuso, nadie ve la diferencia y se pintan cuatro veces menos píxeles
 *   - se detiene cuando sale de pantalla y cuando la pestaña se oculta
 *   - con prefers-reduced-motion dibuja UN cuadro y se detiene: queda una
 *     imagen fija, que es lo que esa preferencia pide
 *   - si no hay WebGL2 no rompe: deja un degradé CSS de reemplazo
 */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;      // 0..1, centro en 0.5
uniform float uScale;
uniform float uDetail;     // octavas
uniform float uSpeed;
uniform float uSwirl;
uniform float uFold;
uniform float uGlow;
uniform float uCore;
uniform float uBlack;
uniform float uBright;
uniform float uGrain;
uniform float uMouseStr;
uniform vec3  uC1;         // sombra
uniform vec3  uC2;         // cuerpo del metal
uniform vec3  uC3;         // brillo

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = rot(0.42 + uSwirl * 0.8);
  for (int i = 0; i < 6; i++) {
    if (float(i) >= uDetail) break;
    v += a * noise(p);
    p = m * p * 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  // Coordenadas que preservan la proporción: si no, el metal se estira en
  // pantallas anchas y se nota que es un plano.
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t = uTime * uSpeed;

  vec2 p = uv * uScale + (uMouse - 0.5) * uMouseStr * 2.0;

  // Deformación de dominio en dos pasadas: la primera mueve, la segunda
  // retuerce lo ya movido. De ahí sale el aspecto de flujo.
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.30)),
                fbm(p + vec2(5.2, 1.3) - t * 0.22));
  vec2 r = vec2(fbm(p + 3.4 * q + vec2(1.7, 9.2) + t * 0.18),
                fbm(p + 3.4 * q + vec2(8.3, 2.8) - t * 0.15));

  float v = fbm(p + 3.0 * r + uFold * q);

  // El pliegue: abs() alrededor del medio genera un canto donde el campo
  // cruza 0.5. Es la línea brillante que recorre el metal fundido.
  float m = abs(v * 2.0 - 1.0);
  float canto = clamp(1.0 - m, 0.0, 1.0);

  // Cobertura: una máscara de frecuencia muy baja que deja zonas enteras sin
  // metal. Sin esto el campo llena la pantalla de punta a punta y deja de
  // leerse como vetas fundidas para parecer una textura de mármol.
  // Se aplica a la INTENSIDAD, no al canto: si se multiplica el canto antes de
  // elevarlo, el filo desaparece junto con el relleno y queda todo negro.
  float cobertura = mix(0.22, 1.0, smoothstep(0.24, 0.64, fbm(uv * 0.8 + vec2(t * 0.05, -t * 0.04))));

  // Realce especular. uCore chico = filo fino: el exponente sube, así que sólo
  // sobrevive la cresta y no toda la ladera.
  float nucleo = pow(canto, mix(34.0, 5.0, clamp(uCore, 0.0, 1.0))) * cobertura;

  // El cuerpo del metal aparece cerca del canto; el resto queda en sombra. Es
  // lo que mantiene el fondo negro y el texto legible encima.
  float cuerpo = smoothstep(0.26, 0.88, canto) * cobertura;

  vec3 col = uC1;
  col = mix(col, uC2, cuerpo);
  col = mix(col, uC3, clamp(nucleo * uGlow, 0.0, 1.0));

  // Punto de negro: todo lo que esté por debajo se va a negro puro, que es lo
  // que mantiene el fondo del sitio realmente negro.
  col = max(col - uBlack, vec3(0.0)) / max(1e-4, 1.0 - uBlack);
  col *= uBright;

  // Viñeta suave para que los bordes no compitan con el contenido.
  float vig = 1.0 - smoothstep(0.52, 1.30, length(uv));
  col *= mix(0.28, 1.0, clamp(vig, 0.0, 1.0));

  if (uGrain > 0.0) {
    float g = hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5;
    col += g * uGrain;
  }

  fragColor = vec4(max(col, vec3(0.0)), 1.0);
}`;

export type MoltenMetalProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  detail?: number;
  glow?: number;
  coreSize?: number;
  swirl?: number;
  fold?: number;
  blackPoint?: number;
  brightness?: number;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  opacity?: number;
  /** Escala de render. 0.5 = un cuarto de los píxeles. */
  quality?: number;
  className?: string;
  /** Para enmascarar el campo desde quien lo usa. */
  style?: React.CSSProperties;
};

function aRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(n.slice(0, 2), 16) / 255,
    parseInt(n.slice(2, 4), 16) / 255,
    parseInt(n.slice(4, 6), 16) / 255,
  ];
}

export function MoltenMetal({
  color1 = "#0a0a0c",
  color2 = "#7f6a50",
  color3 = "#f7e6c8",
  speed = 0.35,
  scale = 4,
  detail = 4,
  glow = 1.45,
  coreSize = 0.08,
  swirl = 1,
  fold = -0.2,
  blackPoint = 0.02,
  brightness = 1.1,
  grain = true,
  grainIntensity = 0.05,
  mouseInteraction = true,
  mouseStrength = 0.3,
  opacity = 1,
  quality = 0.55,
  className = "",
  style,
}: MoltenMetalProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  // Los parámetros viajan por ref: cambiarlos no debe recompilar el shader.
  const props = useRef({
    speed, scale, detail, glow, coreSize, swirl, fold,
    blackPoint, brightness, grain, grainIntensity, mouseInteraction, mouseStrength,
    c1: aRgb(color1), c2: aRgb(color2), c3: aRgb(color3),
  });
  props.current = {
    speed, scale, detail, glow, coreSize, swirl, fold,
    blackPoint, brightness, grain, grainIntensity, mouseInteraction, mouseStrength,
    c1: aRgb(color1), c2: aRgb(color2), c3: aRgb(color3),
  };

  useEffect(() => {
    const cv = canvas.current;
    const box = caja.current;
    if (!cv || !box) return;

    const gl = cv.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      // Sin WebGL2 queda el degradé de reemplazo del contenedor.
      box.dataset.fallback = "true";
      return;
    }

    const compilar = (tipo: number, src: string) => {
      const sh = gl.createShader(tipo)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("[MoltenMetal]", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };

    const vs = compilar(gl.VERTEX_SHADER, VERT);
    const fs = compilar(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      box.dataset.fallback = "true";
      return;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      box.dataset.fallback = "true";
      return;
    }
    gl.useProgram(prog);

    // Un triángulo que cubre la pantalla: menos vértices y sin costura en la
    // diagonal, que es lo que pasa con dos triángulos.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u("uRes"), time: u("uTime"), mouse: u("uMouse"),
      scale: u("uScale"), detail: u("uDetail"), speed: u("uSpeed"),
      swirl: u("uSwirl"), fold: u("uFold"), glow: u("uGlow"),
      core: u("uCore"), black: u("uBlack"), bright: u("uBright"),
      grain: u("uGrain"), mstr: u("uMouseStr"),
      c1: u("uC1"), c2: u("uC2"), c3: u("uC3"),
    };

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = Math.max(0.25, Math.min(1, quality));

    let w = 0;
    let h = 0;
    const medir = () => {
      const r = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width * dpr * q));
      h = Math.max(1, Math.round(r.height * dpr * q));
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(box);

    const raton = { x: 0.5, y: 0.5 };
    const suave = { x: 0.5, y: 0.5 };
    const mover = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      raton.x = (e.clientX - r.left) / Math.max(1, r.width);
      raton.y = 1 - (e.clientY - r.top) / Math.max(1, r.height);
    };
    if (mouseInteraction && !quieto) {
      window.addEventListener("pointermove", mover, { passive: true });
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    io.observe(box);
    const onVis = () => (visible = !document.hidden);
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    let t0 = 0;
    let tiempo = 0;

    const dibujar = (ms: number) => {
      if (!t0) t0 = ms;
      const p = props.current;
      // Avanza por delta y no por reloj absoluto: si la pestaña estuvo oculta,
      // el metal no pega un salto al volver.
      const dt = Math.min(0.05, (ms - t0) / 1000);
      t0 = ms;
      if (!quieto) tiempo += dt;

      suave.x += (raton.x - suave.x) * 0.06;
      suave.y += (raton.y - suave.y) * 0.06;

      gl.uniform2f(U.res, w, h);
      gl.uniform1f(U.time, tiempo);
      gl.uniform2f(U.mouse, p.mouseInteraction ? suave.x : 0.5, p.mouseInteraction ? suave.y : 0.5);
      gl.uniform1f(U.scale, p.scale);
      gl.uniform1f(U.detail, Math.max(1, Math.min(6, p.detail)));
      gl.uniform1f(U.speed, p.speed);
      gl.uniform1f(U.swirl, p.swirl);
      gl.uniform1f(U.fold, p.fold);
      gl.uniform1f(U.glow, p.glow);
      gl.uniform1f(U.core, p.coreSize);
      gl.uniform1f(U.black, p.blackPoint);
      gl.uniform1f(U.bright, p.brightness);
      gl.uniform1f(U.grain, p.grain ? p.grainIntensity : 0);
      gl.uniform1f(U.mstr, p.mouseStrength);
      gl.uniform3fv(U.c1, p.c1);
      gl.uniform3fv(U.c2, p.c2);
      gl.uniform3fv(U.c3, p.c3);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const bucle = (ms: number) => {
      raf = requestAnimationFrame(bucle);
      if (!visible) {
        t0 = ms;
        return;
      }
      dibujar(ms);
    };

    if (quieto) {
      // Un solo cuadro y nada más: queda una textura fija.
      requestAnimationFrame((ms) => dibujar(ms));
    } else {
      raf = requestAnimationFrame(bucle);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", mover);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [quality, mouseInteraction]);

  return (
    <div
      ref={caja}
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden bg-black data-[fallback=true]:bg-[radial-gradient(120%_90%_at_60%_30%,rgba(216,178,122,0.16),rgba(143,185,216,0.07)_45%,#050505_80%)] ${className}`}
      style={{ opacity, ...style }}
    >
      <canvas ref={canvas} className="block h-full w-full" />
    </div>
  );
}
