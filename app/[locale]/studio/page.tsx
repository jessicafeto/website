import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import { FadeUp } from "@/components/home/Motion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "studio" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: locale === "en" ? "/studio" : `/${locale}/studio` },
  };
}

export default async function StudioPage() {
  const t = await getTranslations("studio");
  const sections = [
    { h: t("h1"), p: t("p1") },
    { h: t("h2"), p: t("p2") },
    { h: t("h3"), p: t("p3") },
    { h: t("h4"), p: t("p4") },
  ];

  return (
    <>
      <SiteHeader />

      <main className="bg-white">
        {/* Opening */}
        <section className="wrap pt-[calc(82px+clamp(3.5rem,10vh,7rem))] pb-[clamp(3rem,7vh,5rem)]">
          <div className="mx-auto max-w-[46rem] text-center">
            <FadeUp>
              <p className="eyebrow text-oxblood">{t("eyebrow")}</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="mt-8 font-serif italic text-ink leading-[1.08] text-[clamp(2.4rem,5vw,4rem)]">
                {t("headline")}
              </h1>
            </FadeUp>
            <FadeUp delay={0.22}>
              <p className="mx-auto mt-10 max-w-[46ch] font-sans text-[1.0625rem] leading-[1.85] text-grey">
                {t("intro")}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Body */}
        <section className="wrap pb-[clamp(5rem,12vh,9rem)]">
          <div className="mx-auto max-w-[54rem] text-center">
            {sections.map((s, i) => (
              <FadeUp key={s.h}>
                <h2
                  className={`font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight text-ink ${
                    i === 0 ? "mt-4" : "mt-20"
                  }`}
                >
                  {s.h}
                </h2>
                <p className="mt-6 font-sans text-[1.0625rem] leading-[1.85] text-grey">
                  {s.p}
                </p>
              </FadeUp>
            ))}

            <FadeUp>
              <div className="mt-16 flex flex-col items-center gap-4 border-t border-rule pt-12">
                <Link
                  href="/story"
                  className="eyebrow text-oxblood transition-opacity duration-500 hover:opacity-60"
                >
                  {t("storyCta")}
                </Link>
                <a
                  href="/#contact"
                  className="eyebrow text-oxblood transition-opacity duration-500 hover:opacity-60"
                >
                  {t("contactCta")}
                </a>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
