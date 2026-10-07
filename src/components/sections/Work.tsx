"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/lib/site";
import { whatsappHref } from "@/lib/site";
import {
  CATEGORY_LABELS,
  WORKS,
  type Work,
  type WorkCategory,
} from "@/data/works";
import { SectionHead } from "@/components/primitives/SectionHead";

const TINTS: Record<NonNullable<Work["tint"]>, string> = {
  gold: "radial-gradient(120% 110% at 72% 18%, rgba(228,178,122,0.26), rgba(169,108,46,0.08) 42%, #060608 78%)",
  halo: "radial-gradient(120% 110% at 28% 22%, rgba(166,198,226,0.22), rgba(70,99,126,0.07) 42%, #050507 78%)",
  steel:
    "radial-gradient(120% 110% at 50% 85%, rgba(114,128,142,0.20), rgba(16,16,24,0.5) 48%, #040406 80%)",
};

const ASPECT: Record<Work["aspect"], string> = {
  "16/9": "aspect-[16/9]",
  "9/16": "aspect-[9/16]",
  "4/5": "aspect-[4/5]",
};

export function Work({ t, lang }: { t: Dictionary; lang: Locale }) {
  const [filter, setFilter] = useState<WorkCategory | "all">("all");
  const [open, setOpen] = useState<Work | null>(null);

  const categories = useMemo(() => {
    const present = new Set(WORKS.map((w) => w.category));
    return (Object.keys(CATEGORY_LABELS) as WorkCategory[]).filter((c) =>
      present.has(c)
    );
  }, []);

  const visible = useMemo(
    () => (filter === "all" ? WORKS : WORKS.filter((w) => w.category === filter)),
    [filter]
  );
  const featured = visible.filter((w) => w.wide);
  const rest = visible.filter((w) => !w.wide);

  return (
    <section
      id="trabajos"
      className="relative mx-auto w-full max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <SectionHead eyebrow={t.work.eyebrow} title={t.work.title} lead={t.work.lead} />

      {/* Filtros */}
      <div
        data-reveal
        className="mt-12 flex flex-wrap items-center gap-2 sm:mt-14"
        role="group"
        aria-label={t.work.title}
      >
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label={t.work.filterAll}
        />
        {categories.map((c) => (
          <FilterChip
            key={c}
            active={filter === c}
            onClick={() => setFilter(c)}
            label={CATEGORY_LABELS[c][lang]}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-ink-faint mt-16 text-sm">{t.work.empty}</p>
      ) : (
        <>
          {/* Pieza destacada: ancho completo */}
          {featured.map((w) => (
            <div key={w.slug} data-reveal className="mt-8">
              <WorkCard work={w} t={t} lang={lang} onOpen={() => setOpen(w)} />
            </div>
          ))}

          {/* El resto, empaquetado en columnas: los formatos verticales y
              horizontales conviven sin dejar huecos. */}
          {rest.length > 0 && (
            <ul className="mt-4 columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3">
              {rest.map((w, i) => (
                <li
                  key={w.slug}
                  data-reveal
                  style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
                  className="mb-4 break-inside-avoid sm:mb-5"
                >
                  <WorkCard work={w} t={t} lang={lang} onOpen={() => setOpen(w)} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <div data-reveal className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-ink-dim text-sm font-light">{t.work.cta}</span>
        <a
          href={whatsappHref(t.contact.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:text-ink text-sm underline-offset-4 transition-colors hover:underline"
        >
          {t.work.ctaLink}
        </a>
      </div>

      {open && <WorkModal work={open} t={t} lang={lang} onClose={() => setOpen(null)} />}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 ${
        active
          ? "border-gold/60 text-gold"
          : "border-line text-ink-faint hover:border-ink/35 hover:text-ink-dim"
      }`}
    >
      {label}
    </button>
  );
}

function WorkCard({
  work,
  t,
  lang,
  onOpen,
}: {
  work: Work;
  t: Dictionary;
  lang: Locale;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaceholder = !!work.placeholder;

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  };
  const pause = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const inner = (
    <>
      <div
        className={`relative w-full overflow-hidden rounded-sm ${
          work.wide ? "aspect-[16/9] lg:aspect-[21/9]" : ASPECT[work.aspect]
        }`}
        style={isPlaceholder ? { background: TINTS[work.tint ?? "steel"] } : undefined}
      >
        {isPlaceholder ? (
          <PlaceholderArt />
        ) : (
          <>
            {work.poster && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={work.poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            {work.preview && (
              <video
                ref={videoRef}
                src={work.preview}
                poster={work.poster}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            )}
          </>
        )}

        {/* Degradé para que el texto siempre tenga contraste */}
        <div
          aria-hidden="true"
          className="from-void/85 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <div>
            <p className="text-ink-faint text-[10px] tracking-[0.26em] uppercase">
              {CATEGORY_LABELS[work.category][lang]}
              {isPlaceholder && <> · {t.work.soon}</>}
            </p>
            <h3 className="font-editorial text-ink mt-1.5 text-[1.3rem] leading-tight">
              {work.title[lang]}
            </h3>
          </div>
          {!isPlaceholder && (
            <span
              aria-hidden="true"
              className="border-ink/30 text-ink group-hover:border-gold group-hover:text-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300"
            >
              <svg viewBox="0 0 12 14" className="h-3 w-3 fill-current">
                <path d="M0 0l12 7-12 7z" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (isPlaceholder) {
    return <div className="group block cursor-default">{inner}</div>;
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
      className="group block w-full cursor-pointer text-left"
      aria-label={`${t.work.play} — ${work.title[lang]}`}
    >
      {inner}
    </button>
  );
}

/** Arco de luz para los slots todavía sin material. */
function PlaceholderArt() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "conic-gradient(from 20deg, rgba(255,247,235,0.55) 0deg, rgba(228,178,122,0.25) 70deg, transparent 150deg, transparent 250deg, rgba(166,198,226,0.3) 310deg, rgba(255,247,235,0.45) 360deg)",
          WebkitMask:
            "radial-gradient(closest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
          mask: "radial-gradient(closest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
          opacity: 0.6,
        }}
      />
    </div>
  );
}

function WorkModal({
  work,
  t,
  lang,
  onClose,
}: {
  work: Work;
  t: Dictionary;
  lang: Locale;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [onClose]);

  const embed =
    work.full?.kind === "vimeo"
      ? `https://player.vimeo.com/video/${work.full.src}?autoplay=1&title=0&byline=0&portrait=0`
      : work.full?.kind === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${work.full.src}?autoplay=1&rel=0`
        : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={work.title[lang]}
      className="bg-void/95 fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-xl sm:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="text-ink-dim hover:text-ink absolute top-5 right-5 text-[11px] tracking-[0.2em] uppercase transition-colors sm:top-8 sm:right-8"
      >
        {t.work.close}
      </button>

      <div className="w-full max-w-5xl">
        <div className="bg-void-2 relative aspect-video w-full overflow-hidden rounded-sm">
          {embed ? (
            <iframe
              src={embed}
              title={work.title[lang]}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : work.full?.src ? (
            <video
              src={work.full.src}
              poster={work.poster}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div className="text-ink-faint absolute inset-0 grid place-items-center text-sm">
              {t.work.empty}
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="font-editorial text-ink text-xl">{work.title[lang]}</h3>
          <p className="text-ink-faint text-[11px] tracking-[0.2em] uppercase">
            {work.client} · {CATEGORY_LABELS[work.category][lang]} · {work.year}
          </p>
        </div>
      </div>
    </div>
  );
}
