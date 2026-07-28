import Image from "next/image";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import EnquiryForm from "@/components/EnquiryForm";
import { FadeUp } from "@/components/home/Motion";
import { OFFERS, OFFER_ORDER, type Offer } from "@/content/offers";

/** One entry in the Timeline / Booking / Investment meta row. */
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow text-grey">{label}</p>
      <p className="mt-2 font-serif text-[1.3rem] text-ink">{value}</p>
    </div>
  );
}

/**
 * The template shared by all three engagement pages (/branding, /websites,
 * /marketing). Content comes entirely from `content/offers.ts`. The section
 * flow mirrors a considered service page: hero → what it is + meta →
 * packages → what's inside → process → questions → enquiry.
 */
export default function OfferPage({ offer }: { offer: Offer }) {
  const others = OFFER_ORDER.filter((s) => s !== offer.slug).map(
    (s) => OFFERS[s],
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
          {/* Scrim for legibility */}
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
                  Start your project &rarr;
                </a>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* What it is + meta row (Timeline · Booking · Investment) */}
        <section className="border-y border-rule py-[clamp(4rem,10vh,7rem)]">
          <div className="wrap">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
              <div>
                <FadeUp>
                  <p className="eyebrow text-grey">What is {offer.name}?</p>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <p className="mt-6 font-serif text-ink text-[clamp(1.35rem,2.4vw,1.9rem)] leading-[1.5]">
                    {offer.shift.body}
                  </p>
                </FadeUp>
              </div>
              <FadeUp delay={0.16}>
                <div className="flex flex-col gap-8 border-t border-rule pt-8 lg:h-full lg:justify-center lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
                  <Meta label="Timeline" value={offer.cadence} />
                  <Meta label="Booking" value={offer.booking} />
                  <Meta label="Investment" value={offer.tiers[0].price} />
                </div>
              </FadeUp>
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
                    <div className="mt-6 border-t border-rule pt-6">
                      {tier.builds && (
                        <p className="mb-4 font-serif italic text-[0.95rem] text-ink">
                          Everything in {tier.builds}, plus:
                        </p>
                      )}
                      <ul className="space-y-2.5">
                        {tier.scope.map((s) => (
                          <li
                            key={s}
                            className="flex gap-2.5 font-sans text-[0.9rem] leading-relaxed text-grey"
                          >
                            <span
                              className="mt-[0.5em] h-[3px] w-[3px] flex-none rounded-full bg-oxblood"
                              aria-hidden
                            />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href="#enquire"
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

        {/* What's inside — the same services as "What We Build" */}
        <section className="border-t border-rule py-[clamp(5rem,12vh,8rem)]">
          <div className="wrap">
            <div className="mx-auto max-w-5xl">
              <FadeUp>
                <p className="eyebrow text-grey">What&rsquo;s inside</p>
              </FadeUp>
              <div className="mt-12 space-y-12">
                {offer.includes.map((group, i) => (
                  <FadeUp key={group.label} delay={i * 0.06}>
                    <div className="border-t border-rule pt-6">
                      <h2 className="font-serif text-[1.35rem] text-oxblood">
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

        {/* The process */}
        <section className="wrap py-[clamp(5rem,12vh,8rem)]">
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
        </section>

        {/* FAQ — open grid, question above answer */}
        <section className="border-t border-rule py-[clamp(5rem,12vh,8rem)]">
          <div className="wrap">
            <div className="mx-auto max-w-6xl">
              <FadeUp>
                <h2 className="max-w-[16ch] font-serif text-ink text-[clamp(2rem,4vw,3.4rem)] leading-[1.1]">
                  Questions worth asking.
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

        {/* Enquiry */}
        <section
          id="enquire"
          className="scroll-mt-24 border-t border-rule py-[clamp(5rem,12vh,8rem)]"
        >
          <div className="wrap">
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <FadeUp>
                  <p className="eyebrow text-oxblood">Begin</p>
                </FadeUp>
                <FadeUp delay={0.08}>
                  <h2 className="mt-6 font-serif italic text-ink text-[clamp(2rem,3.6vw,2.8rem)] leading-[1.2]">
                    Enquire about {offer.name}.
                  </h2>
                </FadeUp>
                <FadeUp delay={0.16}>
                  <p className="mx-auto mt-6 max-w-[46ch] font-sans text-[1rem] leading-[1.8] text-grey">
                    Tell us a little about your business and where you&rsquo;d
                    like to begin. We reply to every enquiry personally, within
                    two working days.
                  </p>
                </FadeUp>
              </div>
              <FadeUp delay={0.2}>
                <div className="mt-12">
                  <EnquiryForm engagement={offer.name} />
                </div>
              </FadeUp>
            </div>
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
