import type { MetadataRoute } from "next";
import { LOCALES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return LOCALES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: lang === "es" ? 1 : 0.9,
    alternates: {
      languages: {
        es: `${SITE_URL}/es`,
        en: `${SITE_URL}/en`,
      },
    },
  }));
}
