"use client";

import { Link } from "@/i18n/navigation";
import { OFFER_ORDER, OFFERS } from "@/content/offers";
import { FadeUp } from "./Motion";

/**
 * The three engagements as one connected system — the bridge from "what we
 * build" to a conversation. Each opens its own offer page. Content and prices
 * come from content/offers.ts.
 */
export default function Engagements() {
  return (
    <section id="engagements" className="border-t border-rule bg-paper">
      <div className="wrap py-[clamp(5rem,11vh,7.5rem)]">
        <FadeUp>
          <p className="eyebrow text-grey">Ways to work together</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="mt-6 max-w-[22ch] font-serif text-ink text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.2]">
            Three engagements, one connected system.
          </h2>
        </FadeUp>

        <div className="mt-14 grid gap-px border-t border-rule sm:grid-cols-3">
          {OFFER_ORDER.map((slug, i) => {
            const o = OFFERS[slug];
            return (
              <FadeUp key={slug} delay={i * 0.08}>
                <Link
                  href={`/${slug}`}
                  className="group flex h-full flex-col border-b border-rule px-1 py-8 transition-colors duration-500 sm:border-b-0 sm:border-l sm:px-8 sm:first:border-l-0"
                >
                  <span className="font-sans text-[0.75rem] uppercase tracking-[0.2em] text-light">
                    {o.eyebrow}
                  </span>
                  <h3 className="mt-4 font-serif text-[1.6rem] text-ink transition-colors duration-500 group-hover:text-oxblood">
                    {o.name}
                  </h3>
                  <p className="mt-4 flex-1 font-sans text-[0.95rem] leading-[1.7] text-grey">
                    {o.offer}
                  </p>
                  <span className="mt-6 flex items-center justify-between font-sans text-[0.8rem] uppercase tracking-[0.16em]">
                    <span className="text-grey">{o.price}</span>
                    <span className="text-oxblood opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      Explore &rarr;
                    </span>
                  </span>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
