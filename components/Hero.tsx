"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * The cover page. A full 100vh cinematic photograph with a quiet lower-left
 * lockup: monogram → services → one editorial line. No navigation competes
 * with it. The photograph carries the emotion; type quietly supports.
 */
export default function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="hero" aria-label="noova">
      <Image
        src="/hero/hero-studio-hires.jpg"
        alt="A founder at work in a calm, material-led studio — daylight across concrete, travertine and printed matter."
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
        </p>
        <p className="hero-tag">{t("tagline")}</p>
      </div>
    </section>
  );
}
