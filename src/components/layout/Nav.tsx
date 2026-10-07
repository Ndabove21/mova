"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/lib/site";
import { MarkGlyph, Wordmark } from "@/components/primitives/Wordmark";

export function Nav({ t, lang }: { t: Dictionary; lang: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const other: Locale = lang === "es" ? "en" : "es";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquear el scroll de fondo con el menú abierto
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-void/70 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav
          className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:h-20 sm:px-8 lg:px-12"
          aria-label={lang === "es" ? "Navegación principal" : "Main navigation"}
        >
          <Link
            href={`/${lang}`}
            className="group flex items-center gap-2.5"
            aria-label="MOVA — inicio"
          >
            <MarkGlyph className="h-6 w-6 shrink-0 transition-transform duration-700 group-hover:rotate-180" />
            <Wordmark className="h-[13px] w-auto" title="MOVA" />
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {t.nav.links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="text-ink-dim hover:text-ink text-[13px] font-light tracking-[0.14em] uppercase transition-colors duration-300"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href={`/${other}`}
              className="text-ink-faint hover:text-ink text-[12px] font-light tracking-[0.18em] transition-colors duration-300"
              hrefLang={other}
              aria-label={lang === "es" ? "EN — Switch to English" : "ES — Cambiar a español"}
            >
              {t.otherLocaleLabel}
            </Link>

            <a
              href="#contacto"
              className="border-ink/25 text-ink hover:border-gold hover:text-gold hidden rounded-full border px-5 py-2 text-[12px] font-light tracking-[0.16em] uppercase transition-colors duration-300 sm:inline-block"
            >
              {t.nav.cta}
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-ink -mr-1 flex h-9 w-9 items-center justify-center md:hidden"
              aria-label={t.nav.menu}
              aria-expanded={open}
              aria-controls="menu-movil"
            >
              <span className="relative block h-[9px] w-5">
                <span className="bg-ink absolute inset-x-0 top-0 h-px" />
                <span className="bg-ink absolute inset-x-0 bottom-0 h-px" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        hidden={!open}
        className="bg-void/97 fixed inset-0 z-[60] backdrop-blur-2xl md:hidden"
      >
        <div className="flex h-16 items-center justify-between px-5 sm:h-20">
          <MarkGlyph className="h-6 w-6" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-ink-dim hover:text-ink text-[12px] tracking-[0.18em] uppercase"
          >
            {t.nav.close}
          </button>
        </div>

        <nav className="px-5 pt-10" aria-label={t.nav.menu}>
          <ul className="flex flex-col gap-1">
            {t.nav.links.map((l, i) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="font-editorial text-ink hover:text-gold block py-3 text-[2.25rem] leading-none transition-colors"
                >
                  <span className="text-ink-faint mr-4 align-super text-[0.7rem] tracking-widest">
                    0{i + 1}
                  </span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hairline my-10" />

          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="border-gold/50 text-gold inline-block rounded-full border px-7 py-3 text-[12px] tracking-[0.16em] uppercase"
          >
            {t.nav.cta}
          </a>
        </nav>
      </div>
    </>
  );
}
