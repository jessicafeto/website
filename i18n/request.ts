import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Per-request i18n config. next-intl calls this on the server for every request
 * to resolve the active locale and load its messages from `messages/<locale>.json`.
 * Falls back to the default locale for anything unexpected.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
