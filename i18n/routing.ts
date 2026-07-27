import { defineRouting } from "next-intl/routing";

/**
 * The single source of truth for the site's languages.
 *
 * To add a language later: add its code here and create `messages/<code>.json`.
 * Nothing else needs to change — the middleware, routing, sitemap and hreflang
 * tags all read from this list.
 *
 * `localePrefix: "as-needed"` keeps the default locale (English) on clean URLs
 * (`/`, `/story`) and prefixes the others (`/sq`, `/sq/story`) — so existing
 * English URLs are untouched while each language stays separately crawlable.
 */
export const routing = defineRouting({
  // English only for now. Albanian is fully translated but held back pending a
  // native review — add "sq" back to publish it (the switcher, hreflang and
  // sitemap all pick it up automatically).
  locales: ["en" /*, "sq" */],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
