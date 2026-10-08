import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Bodoni_Moda } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

import { LOCALES, SITE_URL, CONTACT, isLocale, type Locale } from "@/lib/site";
import { getDictionary } from "@/i18n";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Reveals } from "@/components/layout/Reveals";
import { ContactProvider } from "@/components/layout/ContactProvider";
import { CustomCursor } from "@/components/primitives/CustomCursor";

/* Dos familias y sólo dos. Schibsted Grotesk sostiene todo lo que se lee —nav,
   etiquetas, cuerpo— con carácter pero sin pedir atención. Bodoni Moda entra
   únicamente en los titulares grandes: es una didona de alto contraste, y ese
   contraste es lo que le da al sitio el registro editorial de lujo que pide la
   marca. En cuerpo chico sería ilegible, por eso no se usa ahí. */
const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["400", "500", "600"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  const url = `${SITE_URL}/${lang}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: t.meta.titleTemplate },
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    applicationName: "MOVA",
    creator: "MOVA",
    publisher: "MOVA",
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/es`,
      },
    },
    openGraph: {
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      url,
      siteName: "MOVA",
      type: "website",
      locale: lang === "es" ? "es_AR" : "en_US",
      alternateLocale: lang === "es" ? "en_US" : "es_AR",
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
    category: "video production",
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

function jsonLd(lang: Locale) {
  const url = `${SITE_URL}/${lang}`;
  const t = getDictionary(lang);

  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}#org`,
    name: "MOVA",
    alternateName: "MOVA AI Creative Studio",
    url,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/${lang}/opengraph-image`,
    description: t.meta.description,
    slogan: "Create beyond reality.",
    email: CONTACT.email,
    sameAs: [CONTACT.instagram, CONTACT.linkedin, CONTACT.youtube, CONTACT.behance].filter(Boolean),
    areaServed: "Worldwide",
    availableLanguage: ["Spanish", "English"],
    knowsAbout: [
      "AI film production",
      "Generative video",
      "Art direction",
      "Commercials",
      "Digital characters",
      "Visual worlds",
    ],
    makesOffer: t.services.items.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.body },
    })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url,
    name: "MOVA",
    inLanguage: t.htmlLang,
    publisher: { "@id": `${SITE_URL}#org` },
  };

  return [organization, website];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={t.htmlLang} className={`${grotesk.variable} ${bodoni.variable} antialiased`}>
      <body className="grain vignette bg-black text-ink">
        <a className="skip-link" href="#contenido">
          {t.a11y.skip}
        </a>
        <SmoothScroll />
        <Reveals />
        <CustomCursor />
        <ContactProvider t={t} lang={lang}>
          {children}
        </ContactProvider>
        {jsonLd(lang).map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </body>
    </html>
  );
}
