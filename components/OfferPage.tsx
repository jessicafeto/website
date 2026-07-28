import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import { FadeUp } from "@/components/home/Motion";
import { OFFERS, OFFER_ORDER, type Offer } from "@/content/offers";

/**
 * The template shared by all three engagement pages (/branding, /websites,
 * /marketing). Content comes entirely from `content/offers.ts` — this file
 * only decides how an offer is presented. Same editorial rhythm as the rest
 * of the site: belief → substance → proof → a calm invitation.
 */
export default function OfferPage({ offer }: { offer: Offer }) {
  const others = OFFER_ORDER.filter((s) => s !== offer.slug).map(
    (s) => OFFERS[s],
  );

  return (
    <>
      <SiteHeader />

      <main className="bg-white">
        {/* Hero — the outcome, then the offer */}
        <section className="wrap pt-[calc(82px+clamp(3.5rem,10vh,7rem))] pb-[clamp(3rem,8vh,6rem)]">
          <div className="mx-auto max-w-[52rem] text-center">
            <FadeUp>
              <p className="eyebrow text-oxblood">{offer.eyebrow}</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="mx-auto mt-8 max-w-[20ch] font-serif italic text-ink leading-[1.08] text-[clamp(2.4rem,5.5vw,4.25rem)]">
                {offer.headline}
              </h1>
            </FadeUp>
            <FadeUp delay={0.22}>
              <p className="mx-auto mt-10 max-w-[46ch] font-sans text-[1.0625rem] leading-[1.85] text-grey">
                {offer.offer}
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-sans text-[0.8rem] uppercase tracking-[0.18em] text-light">
                <span>{offer.cadence}</span>
                <span className="text-rule" aria-hidden>
                  ·
                </span>
                <span className="text-grey">{offer.tiers[0].price}</span>
              </div>
              <a
                href="/#contact"
                className="eyebrow mt-8 inline-block text-oxblood transition-opacity duration-500 hover:opacity-60"
              >
                Begin a conversation &rarr;
              </a>
            </FadeUp>
          </div>
        </section>

        {/* The shift */}
        <section className="border-y border-rule bg-paper py-[clamp(4rem,10vh,7rem)]">
          <div className="wrap">
            <div className="mx-auto max-w-[46rem] text-center">
              <FadeUp>
                <p className="eyebrow text-grey">{offer.shift.heading}</p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="mt-8 font-serif text-ink text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.5]">
                  {offer.shift.body}
                </p>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* What's inside — grouped, so it reads as a system */}
        <section className="wrap py-[clamp(5rem,12vh,8rem)]">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <p className="eyebrow text-grey">What&rsquo;s inside</p>
            </FadeUp>
            <div className="mt-12 grid gap-x-16 gap-y-14 md:grid-cols-3">
              {offer.includes.map((group, i) => (
                <FadeUp key={group.label} delay={i * 0.08}>
                  <div className="border-t border-rule pt-6">
                    <h2 className="font-serif text-[1.35rem] text-oxblood">
                      {group.label}
                    </h2>
                    <ul className="mt-5 space-y-3">
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
        </section>

        {/* The process */}
        <section className="border-t border-rule bg-paper py-[clamp(5rem,12vh,8rem)]">
          <div className="wrap">
            <div className="mx-auto max-w-4xl">
              <FadeUp>
                <p className="eyebrow text-grey">How it unfolds</p>
              </FadeUp>
              <div className="mt-12 divide-y divide-rule">
                {offer.process.map((phase, i) => (
                  <FadeUp key={phase.n} delay={i * 0.05}>
                    <div className="grid grid-cols-[auto_1fr] gap-x-8 py-8 md:grid-cols-[6rem_14rem_1fr] md:gap-x-12">
                      <span className="font-serif italic text-[1.5rem] text-light">
                        {phase.n}
                      </span>
                      <h3 className="font-serif text-[1.4rem] text-ink">
                        {phase.title}
                      </h3>
                      <p className="col-span-2 mt-3 font-sans text-[1rem] leading-[1.8] text-grey md:col-span-1 md:mt-0">
                        {phase.body}
                      </p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="wrap py-[clamp(5rem,12vh,8rem)]">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <p className="eyebrow text-grey">Packages</p>
              <p className="mt-4 max-w-[46ch] font-sans text-[0.95rem] leading-[1.7] text-light">
                Three ways to begin. Every engagement is tailored — these are
                starting points, and the right scope is agreed in conversation.
              </p>
            </FadeUp>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {offer.tiers.map((tier, i) => (
                <FadeUp key={tier.name} delay={i * 0.08}>
                  <div
                    className={`flex h-full flex-col border p-8 ${
                      tier.featured
                        ? "border-oxblood bg-paper"
                        : "border-rule"
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-[1.5rem] text-ink">
                        {tier.name}
                      </h3>
                      {tier.featured && (
                        <span className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-oxblood">
                          Most chosen
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-sans text-[1.1rem] text-oxblood">
                      {tier.price}
                    </p>
                    <p className="mt-4 font-sans text-[0.95rem] leading-[1.7] text-grey">
                      {tier.summary}
                    </p>
                    <ul className="mt-6 space-y-2.5 border-t border-rule pt-6">
                      {tier.scope.map((s) => (
                        <li
                          key={s}
                          className="font-sans text-[0.9rem] leading-relaxed text-grey"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/#contact"
                      className="eyebrow mt-8 inline-block text-oxblood transition-opacity duration-500 hover:opacity-60"
                    >
                      Enquire &rarr;
                    </a>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Invitation */}
        <section className="wrap border-t border-rule py-[clamp(5rem,12vh,9rem)]">
          <div className="mx-auto max-w-[40rem] text-center">
            <FadeUp>
              <p className="font-serif italic text-ink text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.25]">
                Tell us about your business, your ambitions, or simply where
                you&rsquo;d like to begin.
              </p>
            </FadeUp>
            <FadeUp delay={0.12}>
              <a
                href="/#contact"
                className="eyebrow mt-10 inline-block text-oxblood transition-opacity duration-500 hover:opacity-60"
              >
                Begin a conversation &rarr;
              </a>
            </FadeUp>
          </div>
        </section>

        {/* The other engagements */}
        <section className="border-t border-rule py-[clamp(3.5rem,8vh,5rem)]">
          <div className="wrap">
            <p className="eyebrow mb-8 text-center text-grey">
              The other engagements
            </p>
            <div className="mx-auto grid max-w-3xl gap-px sm:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/${o.slug}`}
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
