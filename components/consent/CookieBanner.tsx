"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useConsent } from "./ConsentProvider";

const EASE = [0.2, 0.6, 0.2, 1] as [number, number, number, number];

/** First-visit banner, fixed to the bottom-left. Fades away once a choice is made. */
export default function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const { ready, bannerVisible, prefsOpen, acceptAll, rejectNonEssential, openPreferences } =
    useConsent();

  const show = ready && bannerVisible && !prefsOpen;

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          role="region"
          aria-label="Cookie notice"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-x-4 bottom-4 z-[130] mx-auto max-w-[31rem] rounded-xl border border-rule bg-white p-7 shadow-[0_10px_40px_-12px_rgba(30,26,22,0.22)] sm:inset-x-auto sm:left-6"
        >
          <h2 className="font-sans font-bold tracking-[-0.01em] text-[1.3rem] leading-tight text-ink">
            {t("title")}
          </h2>

          <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-grey">
            {t.rich("body", {
              privacy: (chunks) => (
                <Link
                  href="/privacy"
                  className="text-oxblood underline underline-offset-2 hover:opacity-70"
                >
                  {chunks}
                </Link>
              ),
              cookies: (chunks) => (
                <Link
                  href="/cookies"
                  className="text-oxblood underline underline-offset-2 hover:opacity-70"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={acceptAll}
              className="rounded-full bg-oxblood px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-white transition-opacity duration-300 hover:opacity-90"
            >
              {t("acceptAll")}
            </button>
            <button
              type="button"
              onClick={rejectNonEssential}
              className="rounded-full border border-ink bg-white px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
            >
              {t("reject")}
            </button>
            <button
              type="button"
              onClick={openPreferences}
              className="rounded-full border border-ink bg-white px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
            >
              {t("preferences")}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
