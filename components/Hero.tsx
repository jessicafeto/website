"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * The cover page. A full-bleed cinematic photograph with a centred lockup:
 * monogram → services → one line of intent → two ways in
 * (book a call, see the work). The photograph carries the emotion; type
 * quietly supports.
 */
export default function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="hero" aria-label="noova">
      <Image
        src="/hero/hero-gallery-natural.jpg"
        alt="A founder walks through a quiet concrete gallery — window light falling across travertine, books and steel."
        fill
        priority
        sizes="100vw"
        className="hero-media"
      />
      <div className="hero-overlay" aria-hidden />

      <div className="wrap hero-lockup">
        {/* Monogram — the studio's quiet signature */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/monogram-white.png"
          alt="noova"
          className="hero-mono"
          width={74}
          height={67}
        />
        <p className="eyebrow hero-services">
          {t("service1")}
          <span className="sep" aria-hidden>
            ·
          </span>
          {t("service2")}
          <span className="sep" aria-hidden>
            ·
          </span>
          {t("service3")}
          <span className="sep" aria-hidden>
            ·
          </span>
          {t("service4")}
        </p>

        <p className="hero-intro">{t("intro")}</p>

        <div className="hero-actions">
          <Link href="/#contact" className="hero-btn hero-btn--light">
            {t("ctaCall")}
          </Link>
          <Link href="/#work" className="hero-btn hero-btn--oxblood">
            {t("ctaWork")}
          </Link>
        </div>
        <p className="hero-note">{t("note")}</p>
      </div>
    </section>
  );
}
