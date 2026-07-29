"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { FadeUp } from "./home/Motion";

/**
 * The Brand Coherence Audit — a scored self-assessment lead magnet.
 * On finish it POSTs { email, score, tier, answers } to a Make.com webhook
 * (set NEXT_PUBLIC_MAKE_WEBHOOK in the environment), then shows a tailored
 * result. Make routes the lead into MailerLite and flags hot leads.
 */
const WEBHOOK = process.env.NEXT_PUBLIC_MAKE_WEBHOOK ?? "";

type Opt = { t: string; v: number };
const QUESTIONS: { q: string; a: Opt[] }[] = [
  {
    q: "If five of your customers described what you do, would they say the same thing?",
    a: [
      { t: "Almost word for word", v: 2 },
      { t: "Roughly, but it varies", v: 1 },
      { t: "Each would say something different", v: 0 },
    ],
  },
  {
    q: "Do your website, Instagram and materials look like one brand?",
    a: [
      { t: "Unmistakably one brand", v: 2 },
      { t: "Similar-ish", v: 1 },
      { t: "Like different companies", v: 0 },
    ],
  },
  {
    q: "Is there a documented brand strategy behind your visuals?",
    a: [
      { t: "Yes — we work from it", v: 2 },
      { t: "Loosely, in our heads", v: 1 },
      { t: "No", v: 0 },
    ],
  },
  {
    q: "Do you have a consistent way you talk about your business?",
    a: [
      { t: "Yes, everywhere", v: 2 },
      { t: "Sometimes", v: 1 },
      { t: "We wing it", v: 0 },
    ],
  },
  {
    q: "Does your website reflect the real quality of your work?",
    a: [
      { t: "Fully", v: 2 },
      { t: "Partly", v: 1 },
      { t: "No — it undersells us", v: 0 },
    ],
  },
  {
    q: "Has your business grown beyond how it currently looks?",
    a: [
      { t: "No — they're aligned", v: 2 },
      { t: "A little", v: 1 },
      { t: "Yes, significantly", v: 0 },
    ],
  },
  {
    q: "How do you feel sending someone to your brand?",
    a: [
      { t: "Proud", v: 2 },
      { t: "Fine", v: 1 },
      { t: "I explain or apologise for it", v: 0 },
    ],
  },
  {
    q: "Does the experience feel connected from first impression to delivery?",
    a: [
      { t: "Seamless", v: 2 },
      { t: "Mostly", v: 1 },
      { t: "Disjointed", v: 0 },
    ],
  },
  {
    q: "Do your brand, marketing and systems work as one?",
    a: [
      { t: "Yes", v: 2 },
      { t: "Somewhat", v: 1 },
      { t: "They're siloed", v: 0 },
    ],
  },
  {
    q: "Does your brand feel like you — or like several businesses at once?",
    a: [
      { t: "Unmistakably us", v: 2 },
      { t: "Getting there", v: 1 },
      { t: "Several at once", v: 0 },
    ],
  },
];

const TIERS = [
  {
    min: 15,
    name: "Coherent",
    body: "Your brand is largely whole. What's left is refinement — sharpening a strong thing, not rebuilding it. The studios that feel effortless are usually one considered pass away.",
    cta: "See how we refine brands",
    href: "/branding",
  },
  {
    min: 8,
    name: "Emerging",
    body: "The foundation is there, but it's inconsistent — in places your brand still reads as several at once. A focused pass would make it whole, and the difference would be immediate.",
    cta: "Let's make it coherent",
    href: "/#contact",
  },
  {
    min: 0,
    name: "Scattered",
    body: "Your business has outgrown its image. The good news: you're not broken — just scattered, your best work spread across parts that were never designed to work together. This is exactly what we rebuild, from the inside out.",
    cta: "Start a conversation",
    href: "/#contact",
  },
];

export default function BrandAudit() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "email" | "result">(
    "intro",
  );
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const score = answers.reduce((a, b) => a + b, 0);
  const tier = TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1];

  function choose(v: number) {
    const next = [...answers];
    next[qi] = v;
    setAnswers(next);
    if (qi < QUESTIONS.length - 1) setQi(qi + 1);
    else setPhase("email");
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    try {
      if (WEBHOOK) {
        await fetch(WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            score,
            tier: tier.name,
            answers: QUESTIONS.map((q, i) => ({
              q: q.q,
              a: q.a.find((o) => o.v === answers[i])?.t ?? "",
            })),
          }),
        });
      }
    } catch {
      /* fail quietly — still show the result */
    }
    setSending(false);
    setPhase("result");
  }

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-[42rem]">
      {/* Intro */}
      {phase === "intro" && (
        <FadeUp>
          <div className="text-center">
            <p className="eyebrow text-oxblood">Free · 3 minutes</p>
            <h1 className="mt-8 font-serif italic text-ink leading-[1.08] text-[clamp(2.4rem,5.5vw,4rem)]">
              The Brand Coherence Audit
            </h1>
            <p className="mx-auto mt-8 max-w-[44ch] font-sans text-[1.0625rem] leading-[1.85] text-grey">
              Most brands aren&rsquo;t broken — just scattered. Ten quick
              questions to see how coherent your brand really is, and where it
              could be made whole.
            </p>
            <button
              type="button"
              onClick={() => setPhase("quiz")}
              className="mt-10 rounded-full bg-oxblood px-10 py-4 font-sans text-[0.8rem] uppercase tracking-[0.22em] text-white transition-opacity duration-300 hover:opacity-90"
            >
              Begin the audit &rarr;
            </button>
          </div>
        </FadeUp>
      )}

      {/* Quiz */}
      {phase === "quiz" && (
        <div>
          <div className="flex items-center justify-between font-sans text-[0.72rem] uppercase tracking-[0.2em] text-light">
            <span>
              {String(qi + 1).padStart(2, "0")} / {QUESTIONS.length}
            </span>
            <span className="h-px w-40 bg-rule">
              <span
                className="block h-px bg-oxblood transition-all duration-500"
                style={{ width: `${((qi + 1) / QUESTIONS.length) * 100}%` }}
              />
            </span>
          </div>

          <FadeUp key={qi} delay={0}>
            <h2 className="mt-10 font-serif text-ink text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.3]">
              {QUESTIONS[qi].q}
            </h2>
            <div className="mt-8 flex flex-col gap-3">
              {QUESTIONS[qi].a.map((o) => (
                <button
                  key={o.t}
                  type="button"
                  onClick={() => choose(o.v)}
                  className="border border-rule px-6 py-4 text-left font-sans text-[1rem] text-ink transition-colors duration-300 hover:border-oxblood hover:bg-paper"
                >
                  {o.t}
                </button>
              ))}
            </div>
            {qi > 0 && (
              <button
                type="button"
                onClick={() => setQi(qi - 1)}
                className="mt-8 font-sans text-[0.75rem] uppercase tracking-[0.2em] text-light transition-colors hover:text-grey"
              >
                &larr; Back
              </button>
            )}
          </FadeUp>
        </div>
      )}

      {/* Email capture */}
      {phase === "email" && (
        <FadeUp>
          <div className="text-center">
            <p className="eyebrow text-grey">Almost there</p>
            <h2 className="mt-6 font-serif italic text-ink text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.2]">
              Where should we send your result?
            </h2>
            <p className="mx-auto mt-5 max-w-[40ch] font-sans text-[1rem] leading-[1.8] text-grey">
              Your score, what it means, and a couple of considered next steps —
              in your inbox and on the next screen.
            </p>
            <form
              onSubmit={submit}
              className="mx-auto mt-10 flex max-w-[26rem] flex-col gap-5"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="w-full border-b border-rule bg-transparent pb-3 text-center font-sans text-[1.1rem] text-ink outline-none focus:border-oxblood"
              />
              <button
                type="submit"
                disabled={sending}
                className="rounded-full bg-oxblood px-10 py-4 font-sans text-[0.8rem] uppercase tracking-[0.22em] text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
              >
                {sending ? "Scoring…" : "See my result →"}
              </button>
            </form>
          </div>
        </FadeUp>
      )}

      {/* Result */}
      {phase === "result" && (
        <FadeUp>
          <div className="text-center">
            <p className="eyebrow text-grey">Your brand is</p>
            <h2 className="mt-4 font-serif italic text-oxblood text-[clamp(2.6rem,6vw,4.25rem)] leading-none">
              {tier.name}
            </h2>
            <p className="mt-6 font-sans text-[0.8rem] uppercase tracking-[0.22em] text-light">
              Coherence score {score} / 20
            </p>
            <p className="mx-auto mt-8 max-w-[46ch] font-serif text-ink text-[clamp(1.2rem,2.4vw,1.6rem)] leading-[1.5]">
              {tier.body}
            </p>
            <Link
              href={tier.href}
              className="eyebrow mt-10 inline-block text-oxblood transition-opacity duration-500 hover:opacity-60"
            >
              {tier.cta} &rarr;
            </Link>
          </div>
        </FadeUp>
      )}
    </div>
  );
}
