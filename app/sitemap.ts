import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { CASE_ORDER } from "@/content/caseStudies";
import { AI_PAGE_PUBLISHED } from "@/content/aiApproach";

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
  "/audit",
  "/privacy",
  "/cookies",
  ...CASE_ORDER.map((slug) => `/work/${slug}`),
  ...(AI_PAGE_PUBLISHED ? ["/ai"] : []),
];

function localizedUrl(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, localizedUrl(l, path)]),
        ),
      },
    })),
  );
}
