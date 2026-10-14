import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import EnquiryForm from "@/components/EnquiryForm";
import { FadeUp } from "@/components/home/Motion";
import { getOffer, OFFER_ORDER, type Offer } from "@/content/offers";

/**
 * The template shared by all three engagement pages (/branding, /websites,
 * /marketing), in both locales. Content comes from content/offers.ts (per
 * locale, incl. pricing); UI strings come from the `offer` message namespace.
 */
export default async function OfferPage({ slug }: { slug: Offer["slug"] }) {
  const locale = await getLocale();
  const t = await getTranslations("offer");
  const offer = getOffer(locale, slug);
  const others = OFFER_ORDER.filter((s) => s !== slug).map((s) =>
    getOffer(locale, s),
  );

  return (
    <>
      <SiteHeader />

      <main className="bg-white">
        {/* Hero — full-bleed image with the offer over it */}
        <section className="film-grain relative flex min-h-[88vh] items-center justify-center overflow-hidden">
          <Image
            src={offer.heroImage}
            alt={offer.heroAlt}
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover object-center blur-[3px]"
          />
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/40"
            aria-hidden
          />

          <div className="wrap relative z-10 pt-[82px] text-center">
            <div className="mx-auto max-w-[52rem]">
              <FadeUp>
                <p className="eyebrow text-white/80">{offer.eyebrow}</p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h1 className="mx-auto mt-8 max-w-[20ch] font-serif italic text-white leading-[1.08] text-[clamp(2.4rem,5.5vw,4.25rem)]">
                  {offer.headline}
                </h1>
              </FadeUp>
              <FadeUp delay={0.22}>
                <p className="mx-auto mt-8 max-w-[46ch] font-sans text-[1.0625rem] leading-[1.85] text-white/85">
                  {offer.offer}
                </p>
              </FadeUp>
              <FadeUp delay={0.3}>
                <a
                  href="#enquire"
                  className="eyebrow mt-10 inline-block text-white transition-opacity duration-500 hover:opacity-70"
                >
                  {t("startProject")}
                </a>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* In short — the offer in one considered paragraph */}
        <section className="border-y border-rule py-[clamp(4rem,10vh,7rem)]">
          <div className="wrap">
            <div className="mx-auto max-w-3xl">
              <FadeUp>
                <p className="eyebrow text-grey">
                  {t("whatIs", { name: offer.name })}
                </p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="mt-6 whitespace-pre-line font-sans font-light text-ink text-[clamp(1rem,1.6vw,1.25rem)] leading-[1.7]">
                  {offer.shift.body}
                </p>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Packages — a numbered price index, read top to bottom */}
        <section className="wrap py-[clamp(5rem,12vh,8rem)]">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <p className="eyebrow text-grey">{t("packages")}</p>
              <p className="mt-4 max-w-[46ch] font-sans text-[0.95rem] leading-[1.7] text-grey">
                {t("packagesIntro")}
              </p>
              <p className="mt-6 font-sans text-[0.85rem] text-ink">
                <span className="text-grey">{t("timeline")}:</span> {offer.cadence}
                <span className="mx-3 text-light" aria-hidden>
                  ·
                </span>
                <span className="text-grey">{t("booking")}:</span> {offer.booking}
              </p>
            </FadeUp>

            <ol className="mt-14">
              {offer.tiers.map((tier, i) => (
                <FadeUp
                  key={tier.name}
                  as="li"
                  delay={i * 0.06}
                  className="grid gap-6 border-t border-ink/80 py-10 md:grid-cols-[5.5rem_1fr_13rem] md:gap-10"
                >
                    <span className="eyebrow pt-2 text-oxblood">
                      No. {String(i + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="font-serif italic leading-none text-ink text-[clamp(2rem,3vw,2.6rem)]">
                        {tier.name}
                        {tier.featured && (
                          <span className="eyebrow ml-4 align-middle text-oxblood not-italic">
                            {t("mostChosen")}
                          </span>
                        )}
                      </h3>
                      <p className="mt-4 max-w-[52ch] font-sans text-[0.98rem] leading-[1.7] text-grey">
                        {tier.summary}
                      </p>
                      {tier.builds && (
                        <p className="mt-6 font-serif italic text-[1rem] text-ink">
                          {t("everythingIn", { builds: tier.builds })}
                        </p>
                      )}
                      <ul className="mt-4 grid gap-x-10 gap-y-2 sm:grid-cols-2">
                        {tier.scope.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 font-sans text-[0.92rem] leading-relaxed text-grey"
                          >
                            <span
                              className="mt-[0.7em] h-px w-3 flex-none bg-oxblood"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col items-start gap-4 md:items-end md:text-right">
                      <p className="font-sans text-[1.15rem] tracking-[-0.01em] text-ink">
                        {tier.price}
                      </p>
                      <a
                        href="#enquire"
                        className="eyebrow text-oxblood transition-opacity duration-500 hover:opacity-60"
                      >
                        {t("enquireShort")}
                      </a>
                    </div>
                </FadeUp>
              ))}
            </ol>
          </div>
        </section>

        {/* What's inside */}
        <section className="border-t border-rule py-[clamp(5rem,12vh,8rem)]">
          <div className="wrap">
            <div className="mx-auto max-w-5xl">
              <FadeUp>
                <p className="eyebrow text-grey">{t("whatsInside")}</p>
              </FadeUp>
              <div className="mt-12 space-y-12">
                {offer.includes.map((group, i) => (
                  <FadeUp key={group.label} delay={i * 0.06}>
                    <div className="border-t border-rule pt-6">
                      <h2 className="font-sans font-bold tracking-[-0.01em] text-[1.2rem] text-oxblood">
                        {group.label}
                      </h2>
                      <ul className="mt-5 grid gap-x-16 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="font-sans text-[1rem] leading-relaxed text-grey"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* A glimpse into selected work */}
        <section className="bg-charcoal py-[clamp(3rem,7vh,4.5rem)]">
          <div className="wrap">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="eyebrow text-white/70">{t("glimpseLabel")}</p>
              <Link
                href="/#work"
                className="eyebrow inline-block bg-paper px-8 py-4 text-ink transition-colors duration-500 hover:bg-white"
              >
                {t("viewProjects")}
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ — open grid, question above answer */}
        <section className="border-t border-rule py-[clamp(5rem,12vh,8rem)]">
          <div className="wrap">
            <div className="mx-auto max-w-6xl">
              <FadeUp>
                <h2 className="max-w-[16ch] font-sans font-bold tracking-[-0.01em] text-ink text-[clamp(1.7rem,3.4vw,2.8rem)] leading-[1.15]">
                  {t("faqHeading")}
                </h2>
              </FadeUp>
              <div className="mt-16 grid gap-x-16 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {offer.faqs.map((f, i) => (
                  <FadeUp key={f.q} delay={i * 0.05}>
                    <div>
                      <h3 className="font-sans text-[0.8rem] font-semibold uppercase leading-snug tracking-[0.14em] text-ink">
                        {f.q}
                      </h3>
                      <p className="mt-6 font-sans text-[0.95rem] leading-[1.75] text-grey">
                        {f.a}
                      </p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enquiry — same wax-seal frame as the home contact */}
        <section
          id="enquire"
          className="scroll-mt-24 border-t border-rule py-[clamp(6rem,10vh,8rem)]"
        >
          <div className="mx-auto max-w-[1400px] px-8">
            <div className="border-2 border-oxblood p-[6px]">
              <div className="relative border border-oxblood/70 bg-white px-10 py-12 md:px-20 md:py-14">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <FadeUp>
                    <Image
                      src="/brand/wax-seal.png"
                      alt="noova wax seal"
                      width={100}
                      height={100}
                      priority
                    />
                  </FadeUp>
                </div>

                <div className="mx-auto flex max-w-[650px] flex-col items-center text-center">
                  <FadeUp delay={0.1}>
                    <h2 className="font-serif italic text-ink text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.05]">
                      {t("enquireHeading", { name: offer.name })}
                    </h2>
                  </FadeUp>
                  <FadeUp delay={0.18}>
                    <p className="mt-4 max-w-[42ch] font-sans text-[1.05rem] leading-relaxed text-grey">
                      {t("enquireIntro")}
                    </p>
                  </FadeUp>
                  <FadeUp delay={0.25} className="mt-8 w-full">
                    <EnquiryForm engagement={offer.name} />
                  </FadeUp>
                  <FadeUp delay={0.35}>
                    <div className="mt-10 w-full border-t border-oxblood/20 pt-6 text-center">
                      <p className="eyebrow text-grey">{t("location")}</p>
                    </div>
                  </FadeUp>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The other engagements */}
        <section className="border-t border-rule py-[clamp(3.5rem,8vh,5rem)]">
          <div className="wrap">
            <p className="eyebrow mb-8 text-center text-grey">
              {t("otherEngagements")}
            </p>
            <div className="mx-auto grid max-w-3xl gap-px sm:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/${o.slug}`}
                  className="group flex items-center justify-between border border-rule px-8 py-7 transition-colors duration-500 hover:bg-paper"
                >
                  <span className="font-sans font-bold tracking-[-0.01em] text-[1.15rem] text-ink">
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
