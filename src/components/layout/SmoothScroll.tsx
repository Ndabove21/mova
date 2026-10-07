"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Scroll suave global. Se desactiva solo si el usuario pidió menos movimiento. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Anclas internas: que Lenis maneje el salto
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;
      const id = anchor.getAttribute("href")!.slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -8 });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
