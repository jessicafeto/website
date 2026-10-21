"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "./Motion";

/**
 * Recent work — an even 2 × 2 grid. Every image shares one shape and lines
 * up row by row; each caption sits beneath it (hairline, number, italic name,
 * sector), so the section reads as one ordered set.
 *
 * Each tile links to its case study at /work/[slug] (see content/caseStudies.ts).
 */
const PROJECTS = [
  { no: "01", meta: "metaSolea", name: "Soléa Aesthetics", slug: "solea", img: "/img/solea/solea-hero.webp" },
  { no: "02", meta: "meta01", name: "intellimation.ai", slug: "intellimation", img: "/img/iai 4.png" },
  { no: "03", meta: "meta04", name: "AMË", slug: "ame", img: "/img/work-3.jpg" },
  { no: "04", meta: "metaVs2026", name: "Victoria’s Secret Fashion Show 2026", slug: "vs-2026", img: "/img/vs-2026/hero-finale.webp" },
] as const;

export default function SelectedWork() {
  const t = useTranslations("work");

  return (
    <section id="work" className="border-t border-rule bg-white">
      <div className="wrap py-[clamp(6rem,15vh,10rem)]">
        <FadeUp>
          <p className="eyebrow mb-14 text-center text-grey">{t("label")}</p>
        </FadeUp>

        <div className="grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-16 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <FadeUp key={p.slug} delay={(i % 2) * 0.1}>
              <Link href={`/work/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={`${p.name} — ${t("label")}`}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
                  />
                </div>

                <div className="mt-6 flex items-baseline gap-4 border-t border-ink/80 pt-5">
                  <span className="eyebrow text-oxblood">{p.no}</span>
                  <div className="min-w-0">
                    <h3 className="font-serif italic leading-[1.05] text-ink text-[clamp(1.7rem,2.3vw,2.2rem)] transition-colors duration-500 group-hover:text-oxblood">
                      {p.name}
                    </h3>
                    <p className="eyebrow mt-2 text-grey">{t(p.meta)}</p>
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
