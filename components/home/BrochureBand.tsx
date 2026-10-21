"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "./Motion";

/**
 * The 2026 services brochure, offered as a quiet coda to the practice index.
 * Both language editions are always listed, each labelled in its own language;
 * the reader's current language comes first. PDFs are plain links (not locale
 * routes) and open in a new tab so the site stays where the reader left it.
 *
 * To update: replace the files in /public/brochure/ keeping the same names
 * (PDFs and the two cover images), and adjust BROCHURE_SIZE if the size changes.
 */
export const BROCHURES = {
  en: { href: "/brochure/noova-services-2026-en.pdf", cover: "/brochure/brochure-cover-en.webp", language: "English", cta: "View the brochure" },
  sq: { href: "/brochure/noova-services-2026-sq.pdf", cover: "/brochure/brochure-cover-sq.webp", language: "Shqip", cta: "Shiko broshurën" },
} as const;
const BROCHURE_SIZE = "4.6 MB";

export default function BrochureBand() {
  const t = useTranslations("brochure");
  const locale = useLocale() === "sq" ? "sq" : "en";
  const order = locale === "sq" ? (["sq", "en"] as const) : (["en", "sq"] as const);
  const primary = BROCHURES[locale];

  return (
    <FadeUp delay={0.1}>
      <aside
        aria-labelledby="brochure-heading"
        className="mt-24 grid items-center gap-x-14 gap-y-10 border-t border-ink/80 pt-12 md:grid-cols-[minmax(0,11rem)_1fr]"
      >
        <a
          href={primary.href}
          target="_blank"
          rel="noopener"
          tabIndex={-1}
          aria-hidden="true"
          className="group block w-[9.5rem] md:w-full"
        >
          <Image
            src={primary.cover}
            alt=""
            width={639}
            height={905}
            sizes="(min-width: 768px) 11rem, 9.5rem"
            className="h-auto w-full shadow-[0_22px_44px_-18px_rgba(26,25,23,0.45)] transition-transform duration-700 group-hover:-translate-y-1"
          />
        </a>

        <div>
          <p className="eyebrow text-oxblood">{t("label")}</p>
          <h3
            id="brochure-heading"
            className="mt-4 font-serif italic leading-[1.05] text-ink text-[clamp(1.8rem,2.6vw,2.5rem)]"
          >
            {t("heading")}
          </h3>
          <p className="mt-4 max-w-[52ch] font-sans text-[1rem] leading-relaxed text-grey">
            {t("intro")}
          </p>

          <ul className="mt-9 flex flex-col gap-5 sm:flex-row sm:gap-12">
            {order.map((lang) => {
              const b = BROCHURES[lang];
              return (
                <li key={lang}>
                  <a
                    href={b.href}
                    target="_blank"
                    rel="noopener"
                    type="application/pdf"
                    hrefLang={lang}
                    aria-label={`${b.cta}, ${b.language} (PDF, ${BROCHURE_SIZE}, ${t("newTab")})`}
                    className="group inline-flex flex-col gap-1.5 border-b border-ink/25 pb-2.5 transition-colors duration-500 hover:border-oxblood focus-visible:border-oxblood focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
                  >
                    <span className="eyebrow text-grey">
                      {b.language} <span aria-hidden>·</span> PDF {BROCHURE_SIZE}
                    </span>
                    <span lang={lang} className="font-serif text-[1.2rem] text-ink transition-colors duration-500 group-hover:text-oxblood">
                      {b.cta} <span aria-hidden>↗</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="mt-9 font-sans text-[0.95rem] text-grey">
            {t("talk")}{" "}
            <Link
              href="/#contact"
              className="whitespace-nowrap text-ink underline decoration-oxblood/50 underline-offset-4 transition-colors duration-300 hover:text-oxblood"
            >
              {t("talkCta")}
            </Link>
          </p>
        </div>
      </aside>
    </FadeUp>
  );
}
