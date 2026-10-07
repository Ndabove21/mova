"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/**
 * Texto en banda continua que acelera con el scroll.
 *
 * La velocidad del scroll entra en la ecuación: si bajás rápido las palabras se
 * apuran, si subís cambian de sentido. Por eso la banda no se siente un GIF
 * pegado sino algo que responde a lo que hace la persona.
 *
 * Con movimiento reducido no corre: las palabras quedan quietas y legibles.
 */
export default function ScrollVelocity({
  texts,
  velocity = 55,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
}: {
  texts: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
}) {
  return (
    <>
      {texts.map((texto, i) => (
        <Banda
          key={texto}
          texto={texto}
          // Las impares van al revés: dos bandas en el mismo sentido se leen como una sola.
          velocidadBase={i % 2 !== 0 ? -velocity : velocity}
          className={className}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
        />
      ))}
    </>
  );
}

function Banda({
  texto,
  velocidadBase,
  className,
  damping,
  stiffness,
  numCopies,
}: {
  texto: string;
  velocidadBase: number;
  className: string;
  damping: number;
  stiffness: number;
  numCopies: number;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocidadScroll = useVelocity(scrollY);
  const suave = useSpring(velocidadScroll, { damping, stiffness });
  const factor = useTransform(suave, [0, 1000], [0, 5], { clamp: false });

  const copiaRef = useRef<HTMLSpanElement>(null);
  const [anchoCopia, setAnchoCopia] = useState(0);
  const [quieto, setQuieto] = useState(false);

  useLayoutEffect(() => {
    setQuieto(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const medir = () => setAnchoCopia(copiaRef.current?.offsetWidth ?? 0);
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  // Envuelve la posición para que la cinta nunca muestre un hueco.
  const x = useTransform(baseX, (v) => {
    if (anchoCopia === 0) return "0px";
    const rango = anchoCopia;
    const mod = (((v + anchoCopia) % rango) + rango) % rango;
    return `${mod - anchoCopia}px`;
  });

  const sentido = useRef(1);
  useAnimationFrame((_, delta) => {
    if (quieto) return;
    let avance = sentido.current * velocidadBase * (delta / 1000);
    const f = factor.get();
    if (f < 0) sentido.current = -1;
    else if (f > 0) sentido.current = 1;
    avance += sentido.current * avance * f;
    baseX.set(baseX.get() + avance);
  });

  return (
    <div className="relative overflow-hidden" aria-hidden="true">
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {Array.from({ length: numCopies }, (_, i) => (
          <span key={i} ref={i === 0 ? copiaRef : null} className={`shrink-0 ${className}`}>
            {texto}&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
}
