import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import { FadeUp } from "@/components/home/Motion";
import { getCaseStudy, CASE_ORDER, getCaseStudies } from "@/content/caseStudies";

/** One label/value pair in the project meta column. */
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow text-grey">{label}</p>
      <p className="mt-3 font-sans text-[0.9rem] font-bold uppercase tracking-[0.14em] text-ink">
        {value}
      </p>
    </div>
  );
}

/**
 * The template shared by every project page (/work/[slug]), both locales.
 * Content comes from content/caseStudies.ts; UI labels from the `caseStudy`
 * message namespace. Mirrors the editorial rhythm of the offer pages.
 */
export default async function CaseStudyPage({ slug }: { slug: string }) {
  const locale = await getLocale();
  const t = await getTranslations("caseStudy");
  const cs = getCaseStudy(locale, slug);
  if (!cs) notFound();

  const others = getCaseStudies(locale).filter((c) => c.slug !== slug);

  return (
    <>
      <SiteHeader />

      <main className="bg-white">
        {/* Hero — text-first on white (header shows as a solid bar) */}
        <section className="wrap pt-[calc(82px+clamp(3rem,8vh,6rem))] pb-[clamp(2.5rem,6vh,4.5rem)] text-center">
          <div className="mx-auto max-w-[54rem]">
            <FadeUp>
              <p className="eyebrow text-grey">{cs.eyebrow}</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="mx-auto mt-8 max-w-[22ch] font-serif italic text-ink leading-[1.08] text-[clamp(2.3rem,5vw,4rem)]">
                {cs.headline}
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mx-auto mt-8 max-w-[54ch] font-sans text-[1.0625rem] leading-[1.85] text-grey">
                {cs.intro}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Full-bleed hero image — the work, shown crisply */}
        <section className="wrap pb-[clamp(1rem,3vh,2rem)]">
          <FadeUp>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper md:aspect-[2/1]">
              <Image
                src={cs.heroImage}
                alt={cs.heroAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </FadeUp>
        </section>

        {/* Statement */}
        <section className="border-y border-rule py-[clamp(3.5rem,8vh,6rem)]">
          <div className="wrap text-center">
            <FadeUp>
              <p className="mx-auto max-w-[26ch] font-serif italic text-ink text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.2]">
                {cs.statement}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Overview + project meta */}
        <section className="py-[clamp(4rem,10vh,7rem)]">
          <div className="wrap">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
              <div>
                <FadeUp>
                  <p className="eyebrow text-grey">{t("overview")}</p>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <p className="mt-6 font-serif text-ink text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.5]">
                    {cs.overview}
                  </p>
                </FadeUp>
              </div>
              <FadeUp delay={0.16}>
                <div className="flex flex-col gap-8 border-t border-rule pt-8 lg:h-full lg:justify-center lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
                  <Meta label={t("role")} value={cs.meta.role} />
                  <Meta label={t("year")} value={cs.meta.year} />
                  <Meta label={t("services")} value={cs.meta.services} />
                  <Meta label={t("sector")} value={cs.meta.sector} />
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* The approach */}
        <section className="border-t border-rule py-[clamp(5rem,12vh,8rem)]">
          <div className="wrap">
            <div className="mx-auto max-w-4xl">
              <FadeUp>
                <p className="eyebrow text-grey">{t("approach")}</p>
              </FadeUp>
              <div className="mt-10 divide-y divide-rule">
                {cs.approach.map((b, i) => (
                  <FadeUp key={b.title} delay={i * 0.05}>
                    <div className="grid gap-x-12 py-8 md:grid-cols-[16rem_1fr]">
                      <h2 className="font-serif text-[1.4rem] text-ink">
                        {b.title}
                      </h2>
                      <p className="mt-3 font-sans text-[1rem] leading-[1.8] text-grey md:mt-0">
                        {b.body}
                      </p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Selected frames — only when there's a real gallery */}
        {cs.gallery.length > 0 && (
          <section className="border-t border-rule py-[clamp(4rem,10vh,7rem)]">
            <div className="wrap">
              <FadeUp>
                <p className="eyebrow mb-10 text-grey">{t("gallery")}</p>
              </FadeUp>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cs.gallery.map((src, i) => (
                  <FadeUp key={src} delay={(i % 3) * 0.06}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                      <Image
                        src={src}
                        alt={`${cs.name} — ${t("gallery")}`}
                        fill
                        sizes="(max-width:640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* What we delivered + the outcome */}
        <section className="border-t border-rule py-[clamp(5rem,12vh,8rem)]">
          <div className="wrap">
            <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2">
              <div>
                <FadeUp>
                  <p className="eyebrow text-grey">{t("delivered")}</p>
                </FadeUp>
                <ul className="mt-8 space-y-4">
                  {cs.delivered.map((d) => (
                    <li
                      key={d}
                      className="flex gap-3 border-b border-rule pb-4 font-serif text-[1.15rem] text-ink"
                    >
                      <span className="text-oxblood">—</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {cs.results && (
                <div>
                  <FadeUp>
                    <p className="eyebrow text-grey">{t("results")}</p>
                  </FadeUp>
                  <ul className="mt-8 space-y-4">
                    {cs.results.map((r) => (
                      <li
                        key={r}
                        className="flex gap-3 font-sans text-[1rem] leading-relaxed text-grey"
                      >
                        <span
                          className="mt-[0.55em] h-[3px] w-[3px] flex-none rounded-full bg-oxblood"
                          aria-hidden
                        />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonial — concept pieces only */}
        {cs.testimonial && (
          <section className="bg-charcoal py-[clamp(5rem,12vh,8rem)]">
            <div className="wrap">
              <div className="mx-auto max-w-3xl text-center">
                <FadeUp>
                  <p className="eyebrow text-white/50">{t("testimonial")}</p>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <blockquote className="mt-8 font-serif italic text-white text-[clamp(1.5rem,3vw,2.3rem)] leading-[1.35]">
                    &ldquo;{cs.testimonial.quote}&rdquo;
                  </blockquote>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <p className="mt-8 eyebrow text-white/60">
                    {cs.testimonial.name} · {cs.testimonial.role}
                  </p>
                </FadeUp>
              </div>
            </div>
          </section>
        )}

        {/* CTA — start a project */}
        <section className="border-t border-rule py-[clamp(5rem,12vh,8rem)]">
          <div className="wrap text-center">
            <FadeUp>
              <h2 className="mx-auto max-w-[18ch] font-serif italic text-ink text-[clamp(2rem,4vw,3.2rem)] leading-[1.1]">
                {t("ctaHeading")}
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="mx-auto mt-6 max-w-[46ch] font-sans text-[1.05rem] leading-relaxed text-grey">
                {t("ctaBody")}
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <Link
                href="/#contact"
                className="eyebrow mt-10 inline-block bg-oxblood px-10 py-4 text-white transition-opacity duration-500 hover:opacity-80"
              >
                {t("ctaButton")}
              </Link>
            </FadeUp>
          </div>
        </section>

        {/* More work */}
        <section className="border-t border-rule py-[clamp(3.5rem,8vh,5rem)]">
          <div className="wrap">
            <p className="eyebrow mb-8 text-center text-grey">{t("moreWork")}</p>
            <div className="mx-auto grid max-w-3xl gap-px sm:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/work/${o.slug}`}
                  className="group flex items-center justify-between border border-rule px-8 py-7 transition-colors duration-500 hover:bg-paper"
                >
                  <span className="font-serif text-[1.3rem] text-ink">
                    {o.name}
                  </span>
                  <span className="eyebrow text-oxblood opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
