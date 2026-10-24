"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AUDIT, QUESTIONS, SHORT_TITLES } from "@/content/audit";
import {
  encodeResponses,
  score,
  type Answer,
  type Importance,
  type Result,
} from "@/lib/audit/scoring";
import { markTestRun, track } from "@/lib/audit/analytics";
import DetailsForm, { EMPTY_DETAILS, type Details } from "./DetailsForm";
import FullResults from "./FullResults";
import Md from "./Md";

/**
 * The Brand & Growth Audit, end to end:
 * landing → "before we begin" (name + email) → 36 steps (30 questions plus an
 * importance rating per area) → full results, on screen and by email.
 *
 * The visitor's details are saved as soon as they're given (/api/audit/start),
 * so a lead isn't lost if they stop part-way; the answers and results follow
 * on completion (/api/audit/submit). Progress is kept in this browser (answers
 * only, never contact details) so a visitor can resume. UTM parameters are
 * captured on arrival and sent with both requests.
 */
type Step =
  | { kind: "question"; areaIndex: number; qIndex: number; id: string }
  | { kind: "importance"; areaIndex: number; id: string };

const STEPS: Step[] = AUDIT.categories.flatMap((c, areaIndex) => [
  ...c.questions.map((q, qIndex) => ({
    kind: "question" as const,
    areaIndex,
    qIndex,
    id: q.id,
  })),
  { kind: "importance" as const, areaIndex, id: c.id },
]);

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

/** "How important is … to your business right now?" */
const IMPORTANCE_SUBJECT: Record<string, string> = {
  "01": "your brand",
  "02": "your website and online presence",
  "03": "your content and social media",
  "04": "attracting new customers",
  "05": "keeping customers coming back",
  "06": "saving time with systems and AI",
};

const STORE = "noova-audit:v1";
const UTM_STORE = "noova-audit:utm";
const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

type Saved = {
  answers: Record<string, Answer>;
  importance: Record<string, Importance>;
  step: number;
  token?: string;
};

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}
function save(s: Saved | null) {
  try {
    if (s) localStorage.setItem(STORE, JSON.stringify(s));
    else localStorage.removeItem(STORE);
  } catch {
    // Private mode or blocked storage: the audit still works, just without resume.
  }
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (Number(c) ^ ((Math.random() * 16) >> (Number(c) / 4))).toString(16)
      );
}

function readUtm() {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORE) ?? "{}");
  } catch {
    return {};
  }
}

type Phase = "landing" | "details" | "quiz" | "finishing" | "results";
type Outcome = {
  token: string | null;
  emailSent: boolean | null;
  failed: boolean;
};

export default function AuditApp({ emailEnabled }: { emailEnabled: boolean }) {
  const [phase, setPhase] = useState<Phase>("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [importance, setImportance] = useState<Record<string, Importance>>({});
  const [resume, setResume] = useState<Saved | null>(null);
  const [resuming, setResuming] = useState(false);
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [error, setError] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const submissionId = useRef<string>("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isTest = useRef(false);

  // Arrival: capture UTMs and the test flag; offer to resume saved progress.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    try {
      const utm = Object.fromEntries(
        UTM_KEYS.map((k) => [k, params.get(`utm_${k}`) ?? ""])
      );
      if (Object.values(utm).some(Boolean))
        sessionStorage.setItem(UTM_STORE, JSON.stringify(utm));
      if (params.get("test") === "1")
        sessionStorage.setItem("noova-audit:test", "1");
      isTest.current = sessionStorage.getItem("noova-audit:test") === "1";
    } catch {
      isTest.current = params.get("test") === "1";
    }
    markTestRun(isTest.current);
    const saved = load();
    if (saved && (Object.keys(saved.answers ?? {}).length || saved.token))
      setResume(saved);
    track("audit_landing_view", {
      utm_source: params.get("utm_source") ?? undefined,
      utm_campaign: params.get("utm_campaign") ?? undefined,
    });
  }, []);

  // Persist progress (answers only) while the quiz is in play.
  useEffect(() => {
    if (phase === "quiz") save({ answers, importance, step });
  }, [answers, importance, step, phase]);

  // Move focus to the new screen's heading so screen readers announce it.
  useEffect(() => {
    if (phase !== "landing") headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, phase]);

  const result: Result | null = useMemo(
    () =>
      phase === "finishing" || phase === "results"
        ? score({ answers, importance })
        : null,
    [phase, answers, importance]
  );

  /** Landing buttons: a fresh start, or continue saved answers. */
  const begin = useCallback((fresh: boolean) => {
    if (fresh) {
      setAnswers({});
      setImportance({});
      setStep(0);
      save(null);
    }
    setResuming(!fresh);
    setError("");
    setPhase("details");
  }, []);

  /** "Before we begin" submitted: save the lead, then start the questions. */
  function onDetails(d: Details) {
    setDetails(d);
    submissionId.current = newId();
    track("audit_form_submit", {
      marketing_consent: d.marketingConsent,
      has_business: Boolean(d.businessName),
    });
    // Fire and forget: the audit never waits on this.
    fetch("/api/audit/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        ...d,
        submissionId: submissionId.current,
        utm: readUtm(),
        test: isTest.current,
      }),
    }).catch(() => {});
    if (resuming && resume) {
      setAnswers(resume.answers ?? {});
      setImportance(resume.importance ?? {});
      setStep(Math.min(resume.step ?? 0, STEPS.length - 1));
    }
    setResume(null);
    setPhase("quiz");
    track("audit_start", { resumed: resuming });
  }

  const current = STEPS[step];
  const answered = (s: Step) =>
    s.kind === "question"
      ? answers[s.id] !== undefined
      : importance[s.id] !== undefined;

  async function finish() {
    setPhase("finishing");
    const r = score({ answers, importance });
    track("audit_complete", { band: r.overallBand ?? "none" });
    let out: Outcome = { token: null, emailSent: null, failed: true };
    try {
      const res = await fetch("/api/audit/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...details,
          submissionId: submissionId.current || newId(),
          responses: encodeResponses({ answers, importance }),
          utm: readUtm(),
          test: isTest.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok)
        out = {
          token: data.token ?? null,
          emailSent: data.emailConfigured ? Boolean(data.emailSent) : null,
          failed: false,
        };
    } catch {}
    setOutcome(out);
    setPhase("results");
    track("audit_results_unlocked", {
      email_sent: Boolean(out.emailSent),
      band: r.overallBand ?? "none",
    });
    if (out.token) {
      save({ answers: {}, importance: {}, step: 0, token: out.token });
      window.history.replaceState(
        null,
        "",
        `/brand-growth-audit/results?r=${encodeURIComponent(out.token)}`
      );
    } else if (!out.failed) save(null);
  }

  function next() {
    if (!answered(current)) {
      setError(
        current.kind === "question"
          ? "Choose the answer that fits best. If it really doesn’t apply to your business, choose Not applicable."
          : "Choose how important this area is to you right now."
      );
      return;
    }
    setError("");
    if (step < STEPS.length - 1) setStep(step + 1);
    else finish();
  }
  function back() {
    setError("");
    if (phase === "details") setPhase("landing");
    else if (step > 0) setStep(step - 1);
    else setPhase("details");
  }

  // Tapping an answer moves on after a beat; keyboard users move on with Next.
  const pointerPick = useRef(false);
  function advanceSoon() {
    pointerPick.current = false;
    const at = step;
    window.setTimeout(
      () => setStep((s) => (s === at && at < STEPS.length - 1 ? s + 1 : s)),
      380
    );
  }
  function pick(value: number) {
    setError("");
    if (current.kind === "question")
      setAnswers((a) => ({ ...a, [current.id]: value as Answer }));
    else setImportance((m) => ({ ...m, [current.id]: value as Importance }));
    if (pointerPick.current) advanceSoon();
  }
  /** Pointer tap on an option: advance after the change (or now, if it was already chosen). */
  function tapped(selected: boolean) {
    if (selected) advanceSoon();
    else pointerPick.current = true;
  }

  /* ---------------------------------------------------------------- results */

  if (phase === "results" && result && outcome) {
    return (
      <div className="wrap pt-[calc(82px+clamp(2.5rem,7vh,5rem))] pb-[clamp(4rem,10vh,7rem)]">
        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Your full results
        </h2>
        {outcome.failed && (
          <div
            role="status"
            className="mx-auto mb-10 flex max-w-[60rem] flex-wrap items-center justify-between gap-4 border border-oxblood/40 bg-limestone px-5 py-4"
          >
            <p className="font-sans text-[0.95rem] text-ink">
              Your results are below, but we couldn’t save them or send your
              email just now.
            </p>
            <button
              type="button"
              onClick={finish}
              className="hero-btn hero-btn--oxblood !w-auto"
            >
              Try again
            </button>
          </div>
        )}
        <FullResults
          result={result}
          reportHref={
            outcome.token
              ? `/api/audit/report?r=${encodeURIComponent(outcome.token)}`
              : `/api/audit/report?a=${encodeResponses({
                  answers,
                  importance,
                })}`
          }
          firstName={details.firstName}
          emailSent={outcome.failed ? null : outcome.emailSent}
        />
      </div>
    );
  }

  /* ---------------------------------------------------------------- finishing */

  if (phase === "finishing") {
    return (
      <section className="audit-material flex min-h-screen items-center justify-center px-6 text-center text-white">
        <div className="relative z-[2]">
          <span className="audit-spinner mx-auto block" aria-hidden />
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-8 font-serif italic text-[clamp(1.8rem,4vw,2.6rem)] outline-none"
          >
            Calculating your results…
          </h1>
          <p className="mt-3 font-sans text-[1rem] text-white/75">
            {details.firstName ? `Thank you, ${details.firstName}. ` : ""}
            This takes a few seconds.
          </p>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- details */

  if (phase === "details") {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal px-4 pt-[calc(82px+2.5rem)] pb-16">
        <Image
          src="/idea/idea-desk.png"
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover object-[60%_55%] blur-[6px]"
        />
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="audit-material audit-card relative w-full max-w-[34rem] px-[clamp(1.5rem,5vw,3rem)] py-[clamp(2rem,6vw,3.25rem)] text-white">
          <div className="relative z-[2]">
            <p className="eyebrow text-center text-[#c9a7a2]">
              Before we begin
            </p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-4 text-center font-serif text-[clamp(1.9rem,4.5vw,2.6rem)] leading-[1.12] outline-none"
            >
              Where should we send <em>your results?</em>
            </h1>
            <p className="mx-auto mt-4 max-w-[34ch] text-center font-sans text-[1rem] leading-[1.65] text-white/80">
              {emailEnabled
                ? "You’ll see your score the moment you finish, and we’ll email you a copy with your full report."
                : "You’ll see your score and full report the moment you finish."}
            </p>
            <div className="mt-8">
              <DetailsForm
                initial={details}
                emailEnabled={emailEnabled}
                onSubmit={onDetails}
              />
            </div>
            <button
              type="button"
              onClick={back}
              className="eyebrow mt-6 block w-full text-center text-white/60 hover:text-white"
            >
              ← Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- quiz */

  if (phase === "quiz") {
    const cat = AUDIT.categories[current.areaIndex];
    const q =
      current.kind === "question" ? cat.questions[current.qIndex] : null;
    const value =
      current.kind === "question"
        ? answers[current.id]
        : importance[current.id];
    const questionNo = QUESTIONS.findIndex((x) => x.id === q?.id) + 1;
    const name = `step-${current.id}`;
    const options: { v: number; label: string; level?: string }[] = q
      ? q.answers.map((a, i) => ({ v: i + 1, label: a, level: String(i + 1) }))
      : [
          { v: 1, label: "Low", level: "Not a focus right now" },
          { v: 2, label: "Medium", level: "Worth improving" },
          { v: 3, label: "High", level: "Important to us now" },
        ];
    const pct = ((step + (answered(current) ? 1 : 0)) / STEPS.length) * 100;

    return (
      <div className="pt-[82px] pb-[clamp(4rem,10vh,7rem)]">
        {/* Area banner: oxblood card stock, which area and how far along */}
        <div className="audit-material text-white">
          <div className="wrap relative z-[2] py-[clamp(1.4rem,3.5vh,2.2rem)]">
            <div className="mx-auto flex max-w-[46rem] items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-[#c9a7a2]">
                  Area {current.areaIndex + 1} of 6
                </p>
                <p className="mt-2 font-serif text-[clamp(1.35rem,3vw,1.9rem)] leading-[1.15]">
                  <em className="mr-3 text-[#c9a7a2]">
                    {ROMAN[current.areaIndex]}
                  </em>
                  {cat.title}
                </p>
              </div>
              <p
                className="eyebrow shrink-0 text-right text-white/75"
                aria-live="polite"
              >
                {q
                  ? `Question ${questionNo} of ${QUESTIONS.length}`
                  : "Your priority"}
              </p>
            </div>
            <div
              className="mx-auto mt-5 h-[3px] max-w-[46rem] overflow-hidden bg-white/15"
              role="progressbar"
              aria-label="Audit progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
            >
              <span
                className="audit-progress block h-full bg-[#c9a7a2]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="wrap">
          <div className="mx-auto max-w-[46rem]">
            <section
              key={current.id}
              className="audit-step pt-[clamp(2.2rem,6vh,3.5rem)]"
            >
              {current.kind === "question" && current.qIndex === 0 && (
                <p className="mb-7 border-l-2 border-oxblood bg-limestone px-5 py-4 font-sans text-[0.98rem] leading-[1.65] text-ink">
                  <span className="eyebrow mb-1 block text-oxblood">
                    In this area
                  </span>
                  <Md text={cat.assessing} />
                </p>
              )}
              <p className="eyebrow text-grey">
                {q ? `${q.id} · ${q.title}` : "How much does this matter?"}
              </p>
              <h1
                id="step-q"
                ref={headingRef}
                tabIndex={-1}
                className="mt-3 font-sans font-medium tracking-[-0.01em] text-ink leading-[1.3] text-[clamp(1.5rem,3.2vw,2.1rem)] outline-none"
              >
                {q ? (
                  <Md text={q.prompt} />
                ) : (
                  `How important is ${
                    IMPORTANCE_SUBJECT[cat.id]
                  } to your business right now?`
                )}
              </h1>
              {!q && (
                <p className="mt-4 max-w-[52ch] font-sans text-[1rem] leading-[1.7] text-grey">
                  A low score in an area that isn’t important to your business
                  at the moment is not a problem. This helps set your
                  priorities.
                </p>
              )}

              <div
                className="mt-8 flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="step-q"
                aria-required="true"
                aria-describedby={error ? "step-error" : undefined}
                onKeyDown={() => (pointerPick.current = false)}
              >
                {options.map((o) => (
                  <label
                    key={o.v}
                    className="audit-option"
                    data-checked={value === o.v}
                    onPointerUp={() => tapped(value === o.v)}
                  >
                    <input
                      type="radio"
                      name={name}
                      value={o.v}
                      checked={value === o.v}
                      onChange={() => pick(o.v)}
                      className="sr-only"
                    />
                    <span className="audit-option__mark" aria-hidden>
                      {q ? o.level : ""}
                    </span>
                    <span className="flex-1">
                      <span className="audit-option__text block">
                        <Md text={o.label} />
                      </span>
                      {!q && (
                        <span className="audit-option__sub mt-0.5 block">
                          {o.level}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
                {q && (
                  <label
                    className="audit-option audit-option--na"
                    data-checked={value === 0}
                    onPointerUp={() => tapped(value === 0)}
                  >
                    <input
                      type="radio"
                      name={name}
                      value={0}
                      checked={value === 0}
                      onChange={() => pick(0)}
                      className="sr-only"
                    />
                    <span className="audit-option__mark" aria-hidden>
                      –
                    </span>
                    <span className="audit-option__text flex-1">
                      Not applicable to my business
                    </span>
                  </label>
                )}
              </div>
              {q && (
                <p className="mt-4 font-sans text-[0.88rem] text-grey">
                  If you sit between two answers, choose the lower one.
                </p>
              )}
            </section>

            <div aria-live="assertive">
              {error && (
                <p
                  id="step-error"
                  className="mt-6 font-sans text-[0.95rem] text-oxblood"
                >
                  {error}
                </p>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-rule pt-6">
              <button
                type="button"
                onClick={back}
                className="eyebrow px-1 py-3 text-grey hover:text-ink"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={next}
                className="hero-btn hero-btn--oxblood !w-auto"
              >
                {step === STEPS.length - 1 ? "See my results" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- landing */
  const resumeAt = resume ? Math.min((resume.step ?? 0) + 1, STEPS.length) : 0;
  const canResume = Boolean(resume && !resume.token);
  const cta = (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      {canResume ? (
        <>
          <button
            type="button"
            onClick={() => begin(false)}
            className="hero-btn hero-btn--light"
          >
            Continue from step {resumeAt}
          </button>
          <button
            type="button"
            onClick={() => begin(true)}
            className="hero-btn hero-btn--outline-light"
          >
            Start again
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => begin(true)}
          className="hero-btn hero-btn--light"
        >
          Start your free audit
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Hero — the carousel's hook, over the founder-at-the-desk photograph */}
      <section className="film-grain relative flex min-h-[92vh] items-center overflow-hidden bg-charcoal text-white">
        <Image
          src="/idea/idea-desk.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/50"
          aria-hidden
        />
        <div className="audit-shadow wrap relative z-10 w-full pt-[calc(82px+clamp(3rem,9vh,6rem))] pb-[clamp(3.5rem,9vh,6rem)] text-center">
          <p className="eyebrow text-white/80">
            Free · The Brand &amp; Growth Audit
          </p>
          <h1 className="mx-auto mt-6 max-w-[18ch] font-serif leading-[1.08] text-[clamp(2.6rem,6.4vw,5rem)]">
            Losing clients?
            <br />
            <em>Not getting enough leads?</em>
          </h1>
          <p className="mx-auto mt-6 max-w-[38ch] font-sans text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.65] text-white/90">
            Score your business in 10 minutes with our free Brand &amp; Growth
            Audit.
          </p>
          <div className="mx-auto mt-9 max-w-[22rem] sm:max-w-none">{cta}</div>
          <ul className="mx-auto mt-8 flex max-w-[40rem] flex-wrap justify-center gap-x-6 gap-y-2 font-sans text-[0.8rem] uppercase tracking-[0.18em] text-white/80">
            <li>10 minutes</li>
            <li aria-hidden className="text-[#c9a7a2]">
              ·
            </li>
            <li>30 questions</li>
            <li aria-hidden className="text-[#c9a7a2]">
              ·
            </li>
            <li>Results by email</li>
          </ul>
          {resume?.token && (
            <p className="mt-6 font-sans text-[0.9rem] text-white/80">
              Taken it before?{" "}
              <a
                href={`/brand-growth-audit/results?r=${encodeURIComponent(
                  resume.token
                )}`}
                className="underline underline-offset-4 hover:text-white"
              >
                View your last results
              </a>
            </p>
          )}
        </div>
      </section>

      {/* Six areas — on oxblood card stock, like the carousel */}
      <section className="audit-material py-[clamp(4.5rem,11vh,7.5rem)] text-white">
        <div className="wrap relative z-[2]">
          <div className="mx-auto max-w-[56rem] text-center">
            <p className="eyebrow text-[#c9a7a2]">What’s inside</p>
            <h2 className="mt-4 font-serif text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.05]">
              Six areas, <em>scored.</em>
            </h2>
            <span
              className="mx-auto mt-6 block h-px w-14 bg-[#c9a7a2]"
              aria-hidden
            />
          </div>
          <ol className="mx-auto mt-12 grid max-w-[56rem] gap-x-14 md:grid-cols-2">
            {AUDIT.categories.map((c, i) => (
              <li
                key={c.id}
                className="grid grid-cols-[3rem_1fr] border-t border-white/20 py-6"
              >
                <em className="font-serif text-[1.6rem] leading-none text-[#c9a7a2]">
                  {ROMAN[i]}
                </em>
                <span>
                  <span className="block font-serif text-[1.55rem] leading-[1.15]">
                    {c.title}
                  </span>
                  <span className="mt-2 block font-sans text-[0.95rem] leading-[1.6] text-white/75">
                    <Md text={c.assessing} />
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What you'll get */}
      <section className="wrap py-[clamp(4.5rem,11vh,7.5rem)]">
        <div className="mx-auto max-w-[64rem]">
          <p className="eyebrow text-center text-oxblood">What you’ll get</p>
          <h2 className="mt-4 text-center font-serif text-ink text-[clamp(2rem,4vw,3rem)] leading-[1.1]">
            A clear plan, <em>not a lecture.</em>
          </h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              [
                "Your score, instantly",
                "A score for each of the six areas, so you can see your strengths and where attention will make the biggest difference.",
              ],
              [
                "Three clear priorities",
                "Practical actions matched to your answers, with a rough idea of the effort each one takes.",
              ],
              [
                "A 30-day plan",
                "A realistic plan for the month ahead, a PDF of your report and our 28-page companion workbook.",
              ],
            ].map(([h, b], i) => (
              <li key={h} className="border-t-2 border-ink pt-6">
                <em className="font-serif text-[3rem] leading-none text-oxblood">
                  {i + 1}
                </em>
                <h3 className="mt-4 font-sans text-[1.2rem] font-bold text-ink">
                  {h}
                </h3>
                <p className="mt-2 font-sans text-[1rem] leading-[1.7] text-grey">
                  {b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="film-grain relative overflow-hidden bg-charcoal py-[clamp(4.5rem,11vh,7rem)] text-white">
        <div className="wrap relative z-10 text-center">
          <h2 className="mx-auto max-w-[20ch] font-serif text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.1]">
            10 minutes now. <em>A clearer business next month.</em>
          </h2>
          <div className="mx-auto mt-9 max-w-[22rem] sm:max-w-none">{cta}</div>
          <p className="mx-auto mt-10 max-w-[60ch] font-sans text-[0.8rem] leading-[1.7] text-white/55">
            {AUDIT.disclaimer}
          </p>
        </div>
      </section>
    </>
  );
}
