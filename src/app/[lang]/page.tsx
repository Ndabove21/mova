import { notFound } from "next/navigation";
import { isLocale } from "@/lib/site";
import { getDictionary } from "@/i18n";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { IntroSection } from "@/components/sections/IntroSection";
import { Services } from "@/components/sections/Services";
import { RealityMova } from "@/components/sections/RealityMova";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Immersive } from "@/components/sections/Immersive";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <span id="top" />
      <Navbar t={t} lang={lang} />
      <main id="contenido">
        <Hero t={t} />
        <IntroSection t={t} />
        <Services t={t} />
        <RealityMova t={t} />
        <SelectedWork t={t} />
        <Immersive t={t} />
        <Process t={t} />
        <About t={t} />
        <FinalCTA t={t} />
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
