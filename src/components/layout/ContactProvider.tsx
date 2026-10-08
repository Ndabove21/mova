"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/lib/site";

/**
 * El contacto vive en una capa sobre la página, no en una sección.
 *
 * Así la home conserva la secuencia que pidió el cliente —hero … CTA final—
 * sin perder la captura de consultas: todos los "START A PROJECT" del sitio
 * abren la misma capa. Se carga en diferido porque nadie la ve hasta que la
 * pide, y arrastra Zod y el formulario entero.
 */
const ContactOverlay = dynamic(
  () => import("@/components/sections/ContactOverlay").then((m) => m.ContactOverlay),
  { ssr: false }
);

type Ctx = { abrir: () => void; cerrar: () => void; abierto: boolean };
const ContactoCtx = createContext<Ctx | null>(null);

export function useContacto() {
  const ctx = useContext(ContactoCtx);
  if (!ctx) throw new Error("useContacto necesita <ContactProvider>");
  return ctx;
}

export function ContactProvider({
  t,
  lang,
  children,
}: {
  t: Dictionary;
  lang: Locale;
  children: React.ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);

  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  // Con la capa abierta el fondo no debe scrollear detrás.
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", abierto);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [abierto]);

  const valor = useMemo(() => ({ abrir, cerrar, abierto }), [abrir, cerrar, abierto]);

  return (
    <ContactoCtx.Provider value={valor}>
      {children}
      {abierto && <ContactOverlay t={t} lang={lang} onClose={cerrar} />}
    </ContactoCtx.Provider>
  );
}
