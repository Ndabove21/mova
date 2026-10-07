import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/lib/site";
import { CONTACT } from "@/lib/site";
import { Wordmark } from "@/components/primitives/Wordmark";
import ShinyText from "@/components/primitives/ShinyText";
import { Rule } from "@/components/primitives/motion";

export function Footer({ t, lang }: { t: Dictionary; lang: Locale }) {
  const other: Locale = lang === "es" ? "en" : "es";
  const socials = [
    { label: "Instagram", href: CONTACT.instagram },
    { label: "Vimeo", href: CONTACT.vimeo },
    { label: "LinkedIn", href: CONTACT.linkedin },
  ].filter((s) => s.href);

  return (
    <footer className="border-line-soft border-t">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Wordmark className="h-5 w-auto" title="MOVA" />
            <p className="mt-4 text-[10px] tracking-[0.46em] uppercase">
              <ShinyText text={t.footer.tagline} speed={7} spread={160} delay={1.2} />
            </p>
          </div>

          <nav className="lg:col-span-4" aria-label={t.footer.tagline}>
            <ul className="grid grid-cols-2 gap-y-3">
              {t.nav.links.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    className="text-ink-dim hover:text-ink text-sm font-light transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-ink-faint text-[10px] tracking-[0.28em] uppercase">
              {t.contact.emailLabel}
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-ink hover:text-gold mt-2 block text-sm transition-colors"
            >
              {CONTACT.email}
            </a>

            {socials.length > 0 && (
              <>
                <p className="text-ink-faint mt-7 text-[10px] tracking-[0.28em] uppercase">
                  {t.footer.social}
                </p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-dim hover:text-ink text-sm transition-colors"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <Rule className="my-10" />

        <div className="text-ink-faint flex flex-wrap items-center justify-between gap-4 text-[11px] tracking-[0.1em]">
          <p>
            © {new Date().getFullYear()} MOVA. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <Link href={`/${other}`} hrefLang={other} className="hover:text-ink transition-colors">
              {t.otherLocaleLabel}
            </Link>
            <a href="#top" className="hover:text-ink transition-colors">
              {t.footer.backToTop}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
