"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/lib/site";
import { CONTACT, whatsappHref } from "@/lib/site";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { Eclipse } from "@/components/primitives/Eclipse";
import { useBorderGlow } from "@/components/primitives/BorderGlow";

const INITIAL: ContactState = { status: "idle" };

export function Contact({ t, lang }: { t: Dictionary; lang: Locale }) {
  const [state, action] = useActionState(sendContact, INITIAL);
  const uid = useId();
  const f = t.contact.form;
  const glow = useBorderGlow({ glowRadius: 170, edgeSensitivity: 80 });

  const err = (k: "name" | "email" | "message") => state.fieldErrors?.[k];
  const field =
    "mt-2 w-full rounded-sm border bg-void-2/70 px-4 py-3 text-[0.95rem] font-light text-ink placeholder:text-ink/45 transition-colors duration-300 focus:border-gold/70 focus:outline-none";

  return (
    <section
      id="contacto"
      className="relative overflow-hidden border-t border-line-soft"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-80 left-1/2 w-[900px] -translate-x-1/2 opacity-25"
      >
        <Eclipse className="w-full" rimWidth={2} drift={false} />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p
              data-reveal
              className="text-ink-faint text-[10px] tracking-[0.34em] uppercase"
            >
              {t.contact.eyebrow}
            </p>
            <h2
              data-reveal
              className="font-editorial text-ink mt-6 text-[2.2rem] leading-[1.05] tracking-[-0.015em] text-balance sm:text-[3rem]"
            >
              {t.contact.title}
            </h2>
            <p
              data-reveal
              className="text-ink-dim mt-5 max-w-[42ch] text-[0.95rem] leading-relaxed font-light"
            >
              {t.contact.lead}
            </p>

            <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={whatsappHref(t.contact.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                {...glow}
                className={`${glow.className} border-gold/45 text-gold hover:bg-gold hover:text-void inline-flex items-center gap-2.5 rounded-full border px-6 py-3 text-[12px] tracking-[0.14em] uppercase transition-colors duration-300`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 004.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.02h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.19 8.19 0 01-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.69 8.21-8.24 8.21zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
                </svg>
                {t.contact.whatsapp}
              </a>
              <span className="text-ink-faint text-xs">{t.contact.or}</span>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-ink-dim hover:text-ink text-sm underline-offset-4 transition-colors hover:underline"
              >
                {CONTACT.email}
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            {state.status === "ok" ? (
              <div className="border-gold/35 bg-void-2/60 flex min-h-[320px] flex-col items-start justify-center rounded-sm border p-10">
                <p className="font-editorial text-eclipse text-[1.9rem] leading-tight">
                  {t.contact.form.success}
                </p>
              </div>
            ) : (
              <form action={action} data-reveal className="grid gap-5 sm:grid-cols-2">
                <input type="hidden" name="locale" value={lang} />
                {/* Honeypot: invisible y fuera del orden de tabulación */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor={`${uid}-website`}>Website</label>
                  <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div>
                  <label htmlFor={`${uid}-name`} className="text-ink-dim text-[11px] tracking-[0.2em] uppercase">
                    {f.name}
                  </label>
                  <input
                    id={`${uid}-name`}
                    name="name"
                    required
                    autoComplete="name"
                    placeholder={f.namePlaceholder}
                    aria-invalid={err("name") || undefined}
                    aria-describedby={err("name") ? `${uid}-name-err` : undefined}
                    className={`${field} ${err("name") ? "border-gold" : "border-line"}`}
                  />
                  {err("name") && (
                    <p id={`${uid}-name-err`} className="text-gold mt-1.5 text-xs">
                      {f.required}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${uid}-email`} className="text-ink-dim text-[11px] tracking-[0.2em] uppercase">
                    {f.email}
                  </label>
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={f.emailPlaceholder}
                    aria-invalid={err("email") || undefined}
                    aria-describedby={err("email") ? `${uid}-email-err` : undefined}
                    className={`${field} ${err("email") ? "border-gold" : "border-line"}`}
                  />
                  {err("email") && (
                    <p id={`${uid}-email-err`} className="text-gold mt-1.5 text-xs">
                      {f.invalidEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${uid}-company`} className="text-ink-dim text-[11px] tracking-[0.2em] uppercase">
                    {f.company}
                  </label>
                  <input
                    id={`${uid}-company`}
                    name="company"
                    autoComplete="organization"
                    placeholder={f.companyPlaceholder}
                    className={`${field} border-line`}
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-type`} className="text-ink-dim text-[11px] tracking-[0.2em] uppercase">
                    {f.type}
                  </label>
                  <select
                    id={`${uid}-type`}
                    name="type"
                    defaultValue={f.typeOptions[0]}
                    className={`${field} border-line appearance-none pr-10`}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='%23f4efe8' stroke-width='1.4'><path d='M1 1.5 6 6.5 11 1.5'/></svg>\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "12px",
                    }}
                  >
                    {f.typeOptions.map((o) => (
                      <option key={o} value={o} className="bg-void-2">
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-message`} className="text-ink-dim text-[11px] tracking-[0.2em] uppercase">
                    {f.message}
                  </label>
                  <textarea
                    id={`${uid}-message`}
                    name="message"
                    required
                    rows={5}
                    placeholder={f.messagePlaceholder}
                    aria-invalid={err("message") || undefined}
                    aria-describedby={err("message") ? `${uid}-message-err` : undefined}
                    className={`${field} resize-y ${err("message") ? "border-gold" : "border-line"}`}
                  />
                  {err("message") && (
                    <p id={`${uid}-message-err`} className="text-gold mt-1.5 text-xs">
                      {f.tooShort}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                  <SubmitButton idle={f.submit} busy={f.submitting} />
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-gold text-sm empty:hidden"
                  >
                    {state.status === "error" && !state.fieldErrors ? f.error : ""}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmitButton({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink text-void hover:bg-gold rounded-full px-8 py-3.5 text-[12px] font-medium tracking-[0.16em] uppercase transition-colors duration-300 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? busy : idle}
    </button>
  );
}
