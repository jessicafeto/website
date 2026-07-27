"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CookieSettingsLink from "@/components/consent/CookieSettingsLink";

/** Editorial footer — the back cover of the noova journal. */
export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-white/10 bg-oxblood">
      <div className="wrap py-24">
        <div className="grid gap-20 lg:grid-cols-[1.6fr_1fr]">
          {/* LEFT */}
          <div>
            <img
              src="/brand/monogram-white.png"
              alt="noova"
              className="h-10 w-auto opacity-95"
            />

            <div className="mt-10 max-w-[620px]">
              <p
                className="font-serif italic text-[1.45rem] leading-relaxed"
                style={{ color: "#F7F3EC" }}
              >
                {t("tagline")}
              </p>

              <p
                className="mt-5 font-sans text-[1rem] leading-8"
                style={{ color: "rgba(247,243,236,0.82)" }}
              >
                {t("description")}
              </p>
            </div>

            <a
              href="mailto:hello@noovadata.com"
              className="mt-12 inline-block font-sans font-normal text-[1.15rem] tracking-[0.01em] transition-opacity duration-300 hover:opacity-80"
              style={{ color: "#F7F3EC" }}
            >
              hello@noovadata.com
            </a>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-12">
            {/* Navigation */}
            <div>
              <p
                className="mb-5 font-sans text-[0.72rem] uppercase tracking-[0.28em]"
                style={{ color: "rgba(247,243,236,0.45)" }}
              >
                {t("navHeading")}
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="#hero"
                  className="font-sans text-[0.92rem] transition-opacity duration-300 hover:opacity-100"
                  style={{ color: "rgba(247,243,236,0.82)" }}
                >
                  {t("home")}
                </a>

                <a
                  href="#services"
                  className="font-sans text-[0.92rem] transition-opacity duration-300 hover:opacity-100"
                  style={{ color: "rgba(247,243,236,0.82)" }}
                >
                  {t("services")}
                </a>

                <a
                  href="#portfolio"
                  className="font-sans text-[0.92rem] transition-opacity duration-300 hover:opacity-100"
                  style={{ color: "rgba(247,243,236,0.82)" }}
                >
                  {t("portfolio")}
                </a>

                <a
                  href="#journal"
                  className="font-sans text-[0.92rem] transition-opacity duration-300 hover:opacity-100"
                  style={{ color: "rgba(247,243,236,0.82)" }}
                >
                  {t("journal")}
                </a>

                <a
                  href="#contact"
                  className="font-sans text-[0.92rem] transition-opacity duration-300 hover:opacity-100"
                  style={{ color: "rgba(247,243,236,0.82)" }}
                >
                  {t("contact")}
                </a>
              </div>
            </div>

            {/* Connect */}
            <div>
              <p
                className="mb-5 font-sans text-[0.72rem] uppercase tracking-[0.28em]"
                style={{ color: "rgba(247,243,236,0.45)" }}
              >
                {t("connectHeading")}
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="#"
                  className="font-sans text-[0.92rem] transition-opacity duration-300 hover:opacity-100"
                  style={{ color: "rgba(247,243,236,0.82)" }}
                >
                  Instagram
                </a>

                <a
                  href="#"
                  className="font-sans text-[0.92rem] transition-opacity duration-300 hover:opacity-100"
                  style={{ color: "rgba(247,243,236,0.82)" }}
                >
                  LinkedIn
                </a>

                <a
                  href="#"
                  className="font-sans text-[0.92rem] transition-opacity duration-300 hover:opacity-100"
                  style={{ color: "rgba(247,243,236,0.82)" }}
                >
                  Behance
                </a>

                <a
                  href="#"
                  className="font-sans text-[0.92rem] transition-opacity duration-300 hover:opacity-100"
                  style={{ color: "rgba(247,243,236,0.82)" }}
                >
                  Pinterest
                </a>
              </div>
            </div>

            {/* London */}
            <div>
              <p
                className="mb-5 font-sans text-[0.72rem] uppercase tracking-[0.28em]"
                style={{ color: "rgba(247,243,236,0.45)" }}
              >
                {t("londonHeading")}
              </p>

              <p
                className="font-sans text-[0.92rem] leading-7"
                style={{ color: "rgba(247,243,236,0.82)" }}
              >
                167–169 Great Portland Street
                <br />
                5th Floor
                <br />
                London
                <br />
                W1W 5PF
              </p>
            </div>

            {/* Tirana */}
            <div>
              <p
                className="mb-5 font-sans text-[0.72rem] uppercase tracking-[0.28em]"
                style={{ color: "rgba(247,243,236,0.45)" }}
              >
                {t("tiranaHeading")}
              </p>

              <p
                className="font-sans text-[0.92rem] leading-7"
                style={{ color: "rgba(247,243,236,0.82)" }}
              >
                Aleksandër Moisiu 4
                <br />
                Tirana
                <br />
                Albania
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-20 h-px"
          style={{ backgroundColor: "rgba(247,243,236,0.12)" }}
        />

        <div className="mt-8 flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between">
          <p
            className="font-sans text-[0.72rem] uppercase tracking-[0.24em]"
            style={{ color: "rgba(247,243,236,0.55)" }}
          >
            {t("rights")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-sans text-[0.72rem] uppercase tracking-[0.24em] text-[rgba(247,243,236,0.55)]">
            <Link
              href="/privacy"
              className="transition-colors duration-300 hover:text-[rgba(247,243,236,0.9)]"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/cookies"
              className="transition-colors duration-300 hover:text-[rgba(247,243,236,0.9)]"
            >
              {t("cookiePolicy")}
            </Link>
            <CookieSettingsLink className="uppercase tracking-[0.24em] transition-colors duration-300 hover:text-[rgba(247,243,236,0.9)]">
              {t("cookieSettings")}
            </CookieSettingsLink>
          </div>

          <p
            className="font-sans text-[0.72rem] uppercase tracking-[0.24em]"
            style={{ color: "rgba(247,243,236,0.55)" }}
          >
            {t("studioLabel")}
          </p>
        </div>
      </div>
    </footer>
  );
}
