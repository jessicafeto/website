"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Minimal `EN | SQ` switcher. Swaps the locale on the current path (so you stay
 * on the same page) and lets the middleware persist the choice in a cookie.
 * The active language is shown in full ink; the others sit quietly in grey.
 */
export default function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // Nothing to switch between when only one language is published.
  if (routing.locales.length < 2) return null;

  return (
    <div
      className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em]"
      aria-label="Language"
    >
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && (
            <span className="text-rule" aria-hidden>
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={active === loc ? "true" : undefined}
            className={`transition-opacity duration-300 ${
              active === loc
                ? "text-ink opacity-100"
                : "text-grey opacity-70 hover:text-ink hover:opacity-100"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
