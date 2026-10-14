import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import { FadeUp } from "@/components/home/Motion";
import { aiApproach as c, aiPageVisible, AI_PAGE_PUBLISHED, type Line } from "@/content/aiApproach";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: { canonical: locale === "en" ? "/ai" : `/${locale}/ai` },
    // Keep the draft out of search until it's approved and published.
    robots: AI_PAGE_PUBLISHED ? undefined : { index: false, follow: false },
  };
}

/** Draft marker — shown only in local preview, never in production. */
function ConfirmTag({ line }: { line: Line }) {
  if (!line.confirm || AI_PAGE_PUBLISHED) return null;
  return (
    <span className="ml-2 inline-block border border-oxblood/40 px-1.5 py-px align-middle font-sans text-[0.6rem] uppercase tracking-[0.16em] text-oxblood">
      To confirm
    </span>
  );
}

export default function AiPage() {
  if (!aiPageVisible()) notFound();

  return (
    <>
      <SiteHeader />

      <main className="bg-white">
        {/* Opening */}
        <section className="wrap pt-[calc(82px+clamp(3.5rem,10vh,7rem))] pb-[clamp(3rem,7vh,5rem)]">
          <div className="mx-auto max-w-[46rem] text-center">
            <FadeUp>
              <p className="eyebrow text-oxblood">{c.eyebrow}</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="mt-6 font-serif italic leading-[1.02] text-ink text-[clamp(2.6rem,6vw,4.6rem)]">
                {c.title}
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mx-auto mt-8 max-w-[38rem] font-sans text-[1.05rem] leading-[1.8] text-grey">
                {c.intro}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Where it fits — AI vs human, stage by stage */}
        <section className="border-t border-rule py-[clamp(4rem,10vh,6.5rem)]">
          <div className="wrap">
            <div className="mx-auto max-w-5xl">
              <FadeUp>
                <p className="eyebrow text-grey">{c.stagesLabel}</p>
              </FadeUp>

              <div className="mt-10 hidden grid-cols-[1fr_1.4fr_1.4fr] gap-8 border-b border-ink/80 pb-3 md:grid">
                <span className="eyebrow text-grey">Stage</span>
                <span className="eyebrow text-grey">Where AI may help</span>
                <span className="eyebrow text-grey">What stays human</span>
              </div>

              <dl>
                {c.stages.map((s, i) => (
                  <FadeUp key={s.stage} delay={i * 0.05}>
                    <div className="grid gap-3 border-b border-rule py-7 md:grid-cols-[1fr_1.4fr_1.4fr] md:gap-8">
                      <dt className="font-serif italic text-[1.6rem] leading-tight text-ink">
                        {s.stage}
                      </dt>
                      <dd className="font-sans text-[0.98rem] leading-[1.7] text-grey">
                        <span className="eyebrow mb-1 block text-grey md:hidden">Where AI may help</span>
                        {s.ai.text}
                        <ConfirmTag line={s.ai} />
                      </dd>
                      <dd className="font-sans text-[0.98rem] leading-[1.7] text-ink">
                        <span className="eyebrow mb-1 block text-grey md:hidden">What stays human</span>
                        {s.human.text}
                        <ConfirmTag line={s.human} />
                      </dd>
                    </div>
                  </FadeUp>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-[clamp(4rem,10vh,6.5rem)]">
          <div className="wrap">
            <div className="mx-auto max-w-[52rem] space-y-16">
              {c.sections.map((sec) => (
                <FadeUp key={sec.n}>
                  <article className="grid gap-4 border-t border-ink/80 pt-6 md:grid-cols-[5rem_1fr]">
                    <span className="eyebrow text-oxblood">{sec.n}</span>
                    <div>
                      <h2 className="font-serif italic leading-[1.08] text-ink text-[clamp(1.9rem,3vw,2.5rem)]">
                        {sec.title}
                      </h2>
                      <ul className="mt-6 space-y-4">
                        {sec.body.map((line) => (
                          <li
                            key={line.text}
                            className="font-sans text-[1rem] leading-[1.8] text-grey"
                          >
                            {line.text}
                            <ConfirmTag line={line} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Invitation */}
        <section className="border-t border-rule bg-paper py-[clamp(4rem,10vh,6rem)]">
          <div className="wrap text-center">
            <FadeUp>
              <h2 className="font-serif italic text-ink text-[clamp(2rem,3.6vw,3rem)] leading-[1.05]">
                {c.ctaHeading}
              </h2>
              <p className="mx-auto mt-5 max-w-[34rem] font-sans text-[1rem] leading-relaxed text-grey">
                {c.ctaBody}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-10">
                <Link
                  href="/#contact"
                  className="eyebrow bg-oxblood px-8 py-4 text-white transition-opacity duration-300 hover:opacity-90"
                >
                  {c.ctaPrimary}
                </Link>
                <Link
                  href="/studio"
                  className="eyebrow text-ink transition-opacity duration-300 hover:opacity-60"
                >
                  {c.ctaSecondary}
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
