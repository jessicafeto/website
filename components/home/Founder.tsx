"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "./Motion";

/**
 * Founder — editorial profile.
 * Premium editorial layout inspired by luxury studios.
 */
export default function Founder() {
  const t = useTranslations("founder");

  return (
    <section id="founder" className="border-t border-rule bg-white">
      <div className="wrap py-[clamp(4.5rem,8vw,6rem)]">
        <div className="grid items-start gap-[clamp(2rem,3vw,3.5rem)] lg:grid-cols-[1fr_1fr]">
          {/* Portrait */}
          <FadeUp>
            <div className="relative aspect-[5/6] overflow-hidden">
              <Image
                src="/img/founder.JPEG"
                alt="Jessica Feto, founder of noova."
                fill
                sizes="(max-width:768px) 100vw, 48vw"
                className="object-cover"
                priority
              />
            </div>
          </FadeUp>

          {/* Content */}
          <div className="pt-2">
            <FadeUp>
              <p className="eyebrow mb-6 tracking-[0.22em] text-grey">
                {t("label")}
              </p>
            </FadeUp>

            <FadeUp delay={0.08}>
              <h2
                className="
                  max-w-[11ch]
                  font-serif
                  italic
                  leading-[0.94]
                  text-ink
                  text-[clamp(3.2rem,4.8vw,4.9rem)]
                "
              >
                {t("headingA")}
                <br />
                {t("headingB")}
              </h2>
            </FadeUp>

            <div className="mt-10 max-w-[41ch]">
              <FadeUp delay={0.16}>
                <p className="font-sans text-[0.95rem] leading-[1.7] text-neutral-600">
                  {t("p1")}
                </p>
              </FadeUp>

              <FadeUp delay={0.24}>
                <p className="mt-7 font-sans text-[0.95rem] leading-[1.7] text-neutral-600">
                  {t("p2")}
                </p>
              </FadeUp>

              <FadeUp delay={0.32}>
                <p className="mt-7 font-sans text-[0.95rem] leading-[1.7] text-neutral-600">
                  {t("p3")}
                </p>
              </FadeUp>

              <FadeUp delay={0.4}>
                <Link
                  href="/story"
                  className="mt-12 inline-block font-sans text-[0.82rem] uppercase tracking-[0.24em] text-oxblood transition-opacity duration-300 hover:opacity-60"
                >
                  {t("cta")}
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
