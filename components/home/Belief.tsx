"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "./Motion";

const SERVICES = [
  { no: "01", title: "Brand", image: "/img/brand-solea.webp", descKey: "brandDesc", href: "/branding" },
  { no: "02", title: "Websites", image: "/img/website.png", descKey: "websitesDesc", href: "/websites" },
  { no: "03", title: "Marketing", image: "/img/marketing.png", descKey: "growthDesc", href: "/marketing" },
  { no: "04", title: "Automation", image: "/img/automation.png", descKey: "automationDesc", href: "/automation" },
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

        {/* Practice index — numbered, editorial: a hairline, the number, the name */}
        <FadeUp delay={0.35}>
          <div className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group block border-t border-ink/80 pt-5"
              >
                <div className="flex items-baseline gap-4">
                  <span className="eyebrow text-oxblood">{item.no}</span>
                  <h3 className="font-serif italic leading-none text-ink text-[clamp(1.9rem,2.4vw,2.4rem)] transition-colors duration-500 group-hover:text-oxblood">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-7 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={800}
                    height={1000}
                    priority
                    className="aspect-[4/5] h-auto w-full object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-105"
                  />
                </div>

                <p className="mt-6 font-sans text-[1rem] leading-relaxed text-grey">
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
