import { notFound } from "next/navigation";
import { isLocale } from "@/lib/site";
import { getDictionary } from "@/i18n";

import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <span id="top" />
      <Nav t={t} lang={lang} />
      <main id="contenido">
        <Hero t={t} />
        <Manifesto t={t} />
        <Work t={t} lang={lang} />
        <Services t={t} />
        <Contact t={t} lang={lang} />
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
