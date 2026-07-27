"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FadeUp } from "./Motion";

/**
 * Selected Work — an editorial gallery, not an equal grid.
 * Asymmetric spans, alternating portrait/landscape, staggered vertical offsets.
 *
 * `placeholder: true` marks projects whose real photography isn't in /public/img
 * yet (Opa Taverne, AMË, 355, HER CLUB). Swap `img` when the files land.
 */
const PROJECTS = [
  { no: "01", name: "intellimation.ai", img: "/img/iai 4.png", span: "lg:col-span-7", aspect: "aspect-[4/3]", offset: "" },
  { no: "02", name: "Seereen", img: "/img/seereen 1.png", span: "lg:col-span-5", aspect: "aspect-[4/5]", offset: "lg:mt-32" },
  { no: "03", name: "Opa Taverne", img: "/img/work-2.jpg", span: "lg:col-span-5", aspect: "aspect-[3/4]", offset: "", placeholder: true },
  { no: "04", name: "AMË", img: "/img/work-3.jpg", span: "lg:col-span-7", aspect: "aspect-[3/4]", offset: "lg:mt-20", placeholder: true },
  { no: "05", name: "355", img: "/img/work-1.jpg", span: "lg:col-span-6", aspect: "aspect-[4/5]", offset: "lg:mt-10", placeholder: true },
  { no: "06", name: "HER CLUB", img: "/img/problem.jpg", span: "lg:col-span-6", aspect: "aspect-[4/5]", offset: "", placeholder: true },
] as const;

export default function SelectedWork() {
  const t = useTranslations("work");

  return (
    <section id="work" className="border-t border-rule bg-white">
      <div className="wrap py-[clamp(6rem,15vh,10rem)]">
        <FadeUp>
          <div className="mb-16 flex items-baseline justify-between">
            <p className="eyebrow text-grey">{t("label")}</p>
            <a
              href="#work"
              className="eyebrow text-ink transition-opacity duration-500 hover:opacity-50"
            >
              {t("viewAll")}
            </a>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,3vw,3rem)] lg:gap-y-4">
          {PROJECTS.map((p, i) => (
            <FadeUp
              key={p.name}
              delay={(i % 2) * 0.1}
              className={`${p.span} ${p.offset}`}
            >
              <a href="#work" className="group block">
                <div className={`relative ${p.aspect} overflow-hidden`}>
                  <Image
                    src={p.img}
                    alt={`${p.name} — ${t("label")}`}
                    fill
                    sizes="(max-width:1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
                  />
                </div>

                <div className="mt-6 flex items-baseline gap-5">
                  <span className="eyebrow text-oxblood">{p.no}</span>
                  <div>
                    <h3 className="font-serif text-[clamp(1.4rem,1.9vw,1.85rem)] leading-tight text-ink transition-colors duration-500 group-hover:text-oxblood">
                      {p.name}
                    </h3>
                    <p className="eyebrow mt-2 text-grey">{t(`meta${p.no}`)}</p>
                  </div>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
