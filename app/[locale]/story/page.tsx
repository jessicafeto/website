import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import { FadeUp } from "@/components/home/Motion";

export const metadata: Metadata = {
  title: "The Founder's Story",
  description:
    "noova's way of seeing is older than noova. The story of its founder — a village in Albania, three cities, and one continuous mind that thinks like an engineer, creates like a designer, and communicates like a publisher.",
};

/** A prose paragraph, kept to an editorial reading measure. */
function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 font-sans text-[1.0625rem] leading-[1.85] text-grey">
      {children}
    </p>
  );
}

/** A chapter heading within the story. */
function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-20 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight text-ink">
      {children}
    </h2>
  );
}

export default function StoryPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-white">
        {/* Opening */}
        <section className="wrap pt-[calc(82px+clamp(3.5rem,10vh,7rem))] pb-[clamp(3rem,7vh,5rem)]">
          <div className="mx-auto max-w-[46rem] text-center">
            <FadeUp>
              <p className="eyebrow text-oxblood">The Founder</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="mt-8 font-serif italic text-ink leading-[1.06] text-[clamp(2.6rem,6vw,4.75rem)]">
                noova&rsquo;s way of seeing is
                <br className="hidden sm:block" /> older than noova.
              </h1>
            </FadeUp>
            <FadeUp delay={0.22}>
              <p className="mx-auto mt-10 max-w-[40ch] font-sans text-[1.0625rem] leading-[1.8] text-grey">
                Before there was a studio, there was a way of looking at the
                world — patient, exact, and quietly certain. This is where it
                began.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Portrait — shown full, portrait, no crop */}
        <FadeUp>
          <div className="wrap">
            <div className="mx-auto max-w-[34rem]">
              <Image
                src="/img/founder.JPEG"
                alt="Jessica Feto, founder of noova, at work in the studio."
                width={1206}
                height={1532}
                priority
                sizes="(max-width: 768px) 100vw, 34rem"
                className="h-auto w-full"
              />
            </div>
          </div>
        </FadeUp>

        {/* Body */}
        <section className="wrap pb-[clamp(5rem,12vh,9rem)] pt-[clamp(3rem,8vh,6rem)]">
          <div className="mx-auto max-w-[54rem] text-center">
            <FadeUp>
              <P>
                I grew up in a small village in southeastern Albania, near the
                Greek border — a place that valued resilience, family, and
                making the most of what it had. As an only child, I spent long
                hours painting, reading, and outdoors. That quiet taught me to
                observe: to notice detail, and to find beauty in simple things
                rather than in excess. It is the earliest root of everything
                noova believes.
              </P>
            </FadeUp>

            <FadeUp>
              <H>Three worlds</H>
              <P>
                Then came Tirana, and then London — three very different worlds.
                Moving between a rural village, a fast-changing capital, and one
                of the most international cities on earth gave me the ability to
                understand different people, cultures, and ways of thinking. It
                also made me a careful outsider everywhere I went — which is,
                it turns out, the exact vantage point a strategist needs.
              </P>
            </FadeUp>

            <FadeUp>
              <H>One continuous mind</H>
              <P>
                My path was never linear. I trained as a computer engineer, then
                took a Master&rsquo;s in data science, before finding my way into
                branding and marketing across startups, technology companies and
                growth teams. Engineering taught me to think in systems and
                solve problems logically. Data taught me to look for patterns,
                question assumptions, and decide on evidence. The creative
                instinct never left. The child who colour-coded her notes and
                built systems to organise information is the same person who
                designs brands today. It is one continuous mind.
              </P>
              <P>
                Working across those worlds, I kept noticing the same thing.
                Most businesses don&rsquo;t have a design problem. They have a
                clarity problem — excellent work, scattered across parts that
                were never designed to belong together.
              </P>
            </FadeUp>
          </div>
        </section>

        {/* Pull quote */}
        <section className="border-y border-rule bg-paper py-[clamp(4.5rem,11vh,8rem)]">
          <FadeUp>
            <blockquote className="wrap mx-auto max-w-[30ch] text-center font-serif italic text-ink text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.2]">
              I wanted noova to think like an engineer, create like a designer,
              and communicate like a publisher.
            </blockquote>
          </FadeUp>
        </section>

        {/* Body — why noova */}
        <section className="wrap py-[clamp(5rem,12vh,9rem)]">
          <div className="mx-auto max-w-[54rem] text-center">
            <FadeUp>
              <H>Why noova</H>
              <P>
                I didn&rsquo;t start noova to escape employment, or as an act of
                rebellion. I built it because the thing I believed in
                didn&rsquo;t exist where I looked: a practice where strategy,
                design, technology, marketing and research live in one room
                instead of separate departments handing files to each other —
                and where quality is made to outlast trend.
              </P>
              <P>
                So noova builds brands from the inside out. Not by decorating
                the surface, but by beginning with what a business truly is, and
                letting everything visible grow from there. Coherence, never
                decoration. The result isn&rsquo;t a new look. It&rsquo;s a
                brand that finally matches the business behind it.
              </P>
              <P>
                My ambition has never been scale for its own sake. It is
                permanence, and integrity — to build a studio that makes
                businesses more coherent and more honest, and to be remembered
                as a founder who led with rigour and kindness, and never let
                strategy and creativity drift apart.
              </P>
            </FadeUp>

            <FadeUp>
              <div className="mt-16 flex flex-col items-center gap-6 border-t border-rule pt-12 text-center">
                <p className="font-serif italic text-ink text-[1.4rem]">
                  &mdash; Jessica Feto, founder of noova
                </p>
                <a
                  href="/#contact"
                  className="eyebrow text-oxblood transition-opacity duration-500 hover:opacity-60"
                >
                  Start a conversation &rarr;
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
