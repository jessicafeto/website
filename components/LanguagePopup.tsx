"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const CHOSEN_COOKIE = "noova-lang-chosen";

/**
 * A one-time, first-visit language chooser. It appears only until the visitor
 * makes a choice (stored in the `noova-lang-chosen` cookie), then never nags
 * again — the persistent EN | SQ switcher in the header handles later changes.
 */
export default function LanguagePopup() {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (routing.locales.length < 2) return;
    const chosen = document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${CHOSEN_COOKIE}=`));
    if (!chosen) setOpen(true);
  }, []);

  function choose(loc: string) {
    document.cookie = `${CHOSEN_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setOpen(false);
    if (loc !== active) router.replace(pathname, { locale: loc });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Choose your language"
    >
      <div className="w-full max-w-sm border border-rule bg-paper px-10 py-12 text-center">
        <p className="eyebrow text-grey">noova</p>
        <h2 className="mt-4 font-serif text-[1.7rem] leading-tight text-ink">
          Choose your language
        </h2>
        <p className="mt-1 font-serif italic text-[1.15rem] text-grey">
          Zgjidhni gjuhën
        </p>
        <div className="mt-9 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => choose("en")}
            className="border border-ink/20 px-6 py-4 font-sans text-[0.8rem] uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-paper"
          >
            English
          </button>
          <button
            type="button"
            onClick={() => choose("sq")}
            className="border border-ink/20 px-6 py-4 font-sans text-[0.8rem] uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-paper"
          >
            Shqip
          </button>
        </div>
      </div>
    </div>
  );
}
