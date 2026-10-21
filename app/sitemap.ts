import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { CASE_ORDER } from "@/content/caseStudies";

const BASE_URL = "https://noovadata.com";

/** Every routable path, listed once per locale with hreflang alternates. */
const PATHS = [
  "",
  "/studio",
  "/branding",
  "/websites",
  "/marketing",
  "/automation",
  "/story",
  "/privacy",
  "/cookies",
  ...CASE_ORDER.map((slug) => `/work/${slug}`),
];

function localizedUrl(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

/** Pages that only exist in English (served at the English URL in every locale). */
const ENGLISH_ONLY = ["/brand-growth-audit"];

export default function sitemap(): MetadataRoute.Sitemap {
  const englishOnly = ENGLISH_ONLY.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));
  return [
    ...englishOnly,
    ...PATHS.flatMap((path) =>
      routing.locales.map((locale) => ({
        url: localizedUrl(locale, path),
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, localizedUrl(l, path)])
          ),
        },
      }))
    ),
  ];
}
