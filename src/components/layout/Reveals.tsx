"use client";

import { useEffect } from "react";

/**
 * Observa todo lo que tenga [data-reveal] y lo revela al entrar en viewport.
 * Un solo observer para toda la página; vuelve a escanear si el DOM cambia
 * (filtros del portfolio, por ejemplo).
 */
export function Reveals() {
  useEffect(() => {
    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (seen.has(el) || el.classList.contains("is-revealed")) return;
        seen.add(el);
        io.observe(el);
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
