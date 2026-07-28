"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * The masthead. Absent over the hero, it slides and fades into view once the
 * cover has scrolled away — revealed by an IntersectionObserver sentinel so a
 * white bar never sits over the photograph. Monogram left, navigation centre,
 * Contact right.
 */
export default function SiteHeader() {
  const [shown, setShown] = useState(false);
  const t = useTranslations("nav");

  // Reveal the header only after the hero sentinel has passed above the viewport.
  // On pages without a hero (e.g. the Story page) there is no sentinel — show at once.
  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        const scrolledPast =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setShown(scrolledPast);
      },
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <header className="site-header" data-shown={shown}>
      <nav className="site-header__nav" aria-label="Primary">
        <Link className="site-header__logo" href="/" aria-label="noova — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/monogram-ink.png" alt="noova" />
        </Link>

        <div className="site-header__links">
          <Link href="/studio">{t("aboutStudio")}</Link>
          <Link href="/#work">{t("portfolio")}</Link>
          <Link href="/#welcome">{t("services")}</Link>
        </div>

        <div className="flex items-center gap-5">
          <LanguageSwitcher />
          <Link className="site-header__contact" href="/#contact">
            {t("contact")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
