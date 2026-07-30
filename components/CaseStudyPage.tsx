import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import { FadeUp } from "@/components/home/Motion";
import {
  getCaseStudy,
  getNextCaseStudy,
  type Block,
  type CaseStudy,
} from "@/content/caseStudies";

/** A minimal snapshot column — label over a stacked list, centred, no icons. */
function SnapCol({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="eyebrow text-oxblood">{label}</p>
      <ul className="mt-5 space-y-2">
        {items.map((it) => (
          <li
            key={it}
            className="font-sans text-[0.95rem] leading-relaxed text-ink"
          >
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One block in the image rhythm. Images render at natural aspect — never cropped. */
function BlockView({ block, alt }: { block: Block; alt: string }) {
  if (block.kind === "caption") {
    return (
      <div className="wrap text-center">
        <FadeUp>
          <div className="mx-auto max-w-[640px]">
            <h2 className="font-serif text-ink text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">
              {block.label}
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] font-sans text-[1rem] leading-[1.8] text-grey">
              {block.note}
            </p>
          </div>
        </FadeUp>
      </div>
    );
  }

  if (block.kind === "duo") {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-[clamp(1.25rem,5vw,5rem)]">
        <div className="grid grid-cols-1 gap-[clamp(1rem,3vw,2.5rem)] sm:grid-cols-2">
          {block.items.map((im) => (
            <FadeUp key={im.src}>
              <div className="relative overflow-hidden film-grain-soft">
                <Image
                  src={im.src}
                  alt={alt}
                  width={im.w}
                  height={im.h}
                  sizes="(max-width:640px) 100vw, 50vw"
                  className="h-auto w-full"
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    );
  }

  if (block.kind === "portrait") {
    return (
      <div className="mx-auto w-full max-w-[860px] px-[clamp(1.25rem,5vw,5rem)]">
        <FadeUp>
          <div className="relative overflow-hidden film-grain-soft">
            <Image
              src={block.src}
              alt={alt}
              width={block.w}
              height={block.h}
              sizes="(max-width:860px) 100vw, 860px"
              className="h-auto w-full"
            />
          </div>
        </FadeUp>
      </div>
    );
  }

  // full
  return (
    <div className="mx-auto w-full max-w-[1600px] px-[clamp(1.25rem,5vw,5rem)]">
      <FadeUp>
        <div className="relative overflow-hidden film-grain-soft">
          <Image
            src={block.src}
            alt={alt}
            width={block.w}
            height={block.h}
            sizes="(max-width:1600px) 100vw, 1600px"
            className="h-auto w-full"
          />
        </div>
      </FadeUp>
    </div>
  );
}

/**
 * Immersive, image-led case study. Full-screen hero → concise overview →
 * minimal snapshot → a rhythm of mixed image blocks → next project.
 * Content comes from content/caseStudies.ts; UI labels from `caseStudy`.
 */
export default async function CaseStudyPage({ slug }: { slug: string }) {
  const locale = await getLocale();
  const t = await getTranslations("caseStudy");
  const cs: CaseStudy | undefined = getCaseStudy(locale, slug);
  if (!cs) notFound();

  const next = getNextCaseStudy(locale, slug);
  const imgAlt = `${cs.name} — ${cs.category}`;

  return (
    <>
      <SiteHeader />

      <main className="bg-white">
        {/* Section 1 — full-screen hero */}
        <section className="relative h-[100svh] w-full overflow-hidden bg-charcoal">
          <div className="absolute inset-0 isolate overflow-hidden film-grain-soft">
            <Image
              src={cs.heroImage}
              alt={cs.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/35" aria-hidden />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <FadeUp>
              <h1 className="font-sans font-bold uppercase text-white leading-tight text-[clamp(2rem,5.5vw,4rem)] tracking-[0.22em]">
                {cs.name}
              </h1>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="mt-6 font-sans uppercase text-white/75 text-[clamp(0.7rem,1vw,0.82rem)] tracking-[0.32em]">
                {cs.category}
              </p>
            </FadeUp>
          </div>
          <div
            id="hero-sentinel"
            className="absolute bottom-0 left-0 h-px w-full"
            aria-hidden
          />
        </section>

        {/* Section 2 — overview */}
        <section className="wrap pt-[clamp(5.5rem,15vh,11rem)] pb-[clamp(3rem,8vh,6rem)] text-center">
          <div className="mx-auto max-w-[720px]">
            <FadeUp>
              <p className="eyebrow text-grey">{t("theProject")}</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="mt-8 font-serif text-ink text-[clamp(1.9rem,3.8vw,3.1rem)] leading-[1.18]">
                {cs.overviewHeading}
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mx-auto mt-8 max-w-[600px] font-sans text-[1.05rem] leading-[1.9] text-grey">
                {cs.overview}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Section 3 — snapshot */}
        <section className="wrap pb-[clamp(1rem,3vh,2rem)]">
          <FadeUp>
            <div className="mx-auto grid max-w-[980px] grid-cols-2 gap-x-8 gap-y-12 text-center md:grid-cols-4">
              <SnapCol label={t("industry")} items={[cs.snapshot.industry]} />
              <SnapCol label={t("services")} items={cs.snapshot.services} />
              <SnapCol label={t("timeline")} items={[cs.snapshot.timeline]} />
              <SnapCol
                label={t("deliverables")}
                items={cs.snapshot.deliverables}
              />
            </div>
          </FadeUp>
        </section>

        {/* Sections 4 & 5 — image rhythm */}
        <section className="pb-[clamp(3rem,8vh,6rem)]">
          {cs.blocks.map((b, i) => {
            const prev = cs.blocks[i - 1];
            const afterCaption = prev?.kind === "caption";
            const gap =
              b.kind === "caption"
                ? "mt-[clamp(5.5rem,15vh,11rem)]"
                : afterCaption
                  ? "mt-[clamp(1.75rem,4vh,3rem)]"
                  : "mt-[clamp(5rem,13vh,10rem)]";
            return (
              <div key={i} className={gap}>
                <BlockView block={b} alt={imgAlt} />
              </div>
            );
          })}

          {cs.finalImage && (
            <div className="mt-[clamp(5rem,13vh,10rem)]">
              <div className="mx-auto w-full max-w-[1600px] px-[clamp(1.25rem,5vw,5rem)]">
                <FadeUp>
                  <div className="relative overflow-hidden film-grain-soft">
                    <Image
                      src={cs.finalImage.src}
                      alt={imgAlt}
                      width={cs.finalImage.w}
                      height={cs.finalImage.h}
                      sizes="(max-width:1600px) 100vw, 1600px"
                      className="h-auto w-full"
                    />
                  </div>
                </FadeUp>
              </div>
            </div>
          )}
        </section>

        {/* Section 6 — next project */}
        <section className="wrap border-t border-rule py-[clamp(6rem,15vh,11rem)] text-center">
          <FadeUp>
            <p className="eyebrow text-grey">{t("nextProject")}</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link href={`/work/${next.slug}`} className="group mt-10 block">
              <div className="relative mx-auto aspect-[16/10] w-full max-w-[1100px] overflow-hidden bg-paper md:aspect-[2.2/1]">
                <div className="absolute inset-0 isolate overflow-hidden film-grain-soft">
                  <Image
                    src={next.heroImage}
                    alt={next.name}
                    fill
                    sizes="(max-width:1100px) 100vw, 1100px"
                    className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div
                  className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/45"
                  aria-hidden
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="font-sans font-bold uppercase text-white text-[clamp(1.6rem,3.5vw,2.8rem)] tracking-[0.2em]">
                    {next.name}
                  </h2>
                </div>
              </div>
            </Link>
          </FadeUp>
        </section>
      </main>

      <Footer />
    </>
  );
}
