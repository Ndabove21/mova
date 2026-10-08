"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

type Variante = "solid" | "outline" | "ghost";

/**
 * Botón magnético: al acercar el puntero, el botón se corre hacia él y la
 * etiqueta lo sigue un poco menos, lo que da la sensación de peso.
 *
 * Es el único componente de acción del sitio —todos los CTA pasan por acá—,
 * así que acá viven también el icono, el hover y el `data-cursor`. El
 * desplazamiento se apaga con `prefers-reduced-motion`, porque los resortes
 * son exactamente el tipo de movimiento que esa preferencia quiere evitar.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "outline",
  icon = "arrow",
  className = "",
  target,
  rel,
  ariaLabel,
  strength = 0.35,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variante;
  icon?: "arrow" | "play" | "none";
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  strength?: number;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.4 });

  const mover = (e: React.PointerEvent) => {
    const el = caja.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const soltar = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group/btn relative inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-[11px] tracking-[0.2em] uppercase transition-colors duration-500";
  const pinta: Record<Variante, string> = {
    solid: "bg-ink text-black hover:bg-gold",
    outline: "border border-line text-ink hover:border-gold/70 hover:text-gold",
    ghost: "text-ink-dim hover:text-ink",
  };

  const contenido = (
    <>
      {icon === "play" && (
        <span className="border-current/40 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-transform duration-500 group-hover/btn:scale-110">
          <Play className="h-2.5 w-2.5 translate-x-px fill-current" strokeWidth={0} />
        </span>
      )}
      <span>{children}</span>
      {icon === "arrow" && (
        <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full border border-current/35">
          <ArrowRight className="h-3 w-3 transition-transform duration-500 group-hover/btn:translate-x-4 group-hover/btn:opacity-0" />
          <ArrowRight className="absolute h-3 w-3 -translate-x-4 opacity-0 transition-transform duration-500 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
        </span>
      )}
    </>
  );

  const clases = `${base} ${pinta[variant]} ${className}`;

  return (
    <motion.div
      ref={caja}
      style={{ x: sx, y: sy }}
      onPointerMove={mover}
      onPointerLeave={soltar}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          target={target}
          rel={rel}
          aria-label={ariaLabel}
          data-cursor="button"
          className={clases}
        >
          {contenido}
        </a>
      ) : (
        <button type="button" onClick={onClick} aria-label={ariaLabel} data-cursor="button" className={clases}>
          {contenido}
        </button>
      )}
    </motion.div>
  );
}
