"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "./Motion";

const SERVICES = [
  { title: "BRAND", image: "/img/brand.png", descKey: "brandDesc", href: "/branding" },
  { title: "WEBSITES", image: "/img/website.png", descKey: "websitesDesc", href: "/websites" },
  { title: "GROWTH", image: "/img/growth.png", descKey: "growthDesc", href: "/marketing" },
] as const;

export default function Belief() {
  const t = useTranslations("welcome");

  return (
    <section id="welcome" className="border-t border-rule bg-white">
      <div className="wrap py-[clamp(5rem,10vh,7rem)]">
        {/* Label */}
        <FadeUp>
          <div className="mb-8 flex justify-center">
            <p className="eyebrow tracking-[0.22em] text-grey">{t("label")}</p>
          </div>
        </FadeUp>

        {/* Heading */}
        <FadeUp delay={0.1}>
          <h2 className="mx-auto max-w-[22ch] text-center font-serif italic leading-[0.96] text-ink text-[clamp(2.5rem,4.5vw,4.4rem)]">
            {t("heading")}
          </h2>
        </FadeUp>

        {/* Intro */}
        <FadeUp delay={0.2}>
          <p className="mx-auto mt-8 max-w-[46rem] text-center font-sans text-[1rem] leading-[1.8] text-grey">
            {t("intro")}
          </p>
        </FadeUp>

        {/* Cards */}
        <FadeUp delay={0.35}>
          <div className="mt-20 grid gap-12 md:grid-cols-3">
            {SERVICES.map((item) => (
              <Link key={item.title} href={item.href} className="group block">
                <div className="overflow-hidden border border-rule">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={800}
                    height={1000}
                    priority
                    className="aspect-[4/5] h-auto w-full object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-105"
                  />
                </div>

                <h3 className="mt-8 eyebrow text-ink transition-colors duration-500 group-hover:text-oxblood">
                  {item.title} →
                </h3>

                <p className="mt-5 font-sans text-[1rem] leading-relaxed text-grey">
                  {t(item.descKey)}
                </p>
              </Link>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
