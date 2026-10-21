"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AUDIT, QUESTIONS, SHORT_TITLES } from "@/content/audit";
import {
  encodeResponses,
  score,
  type Answer,
  type Importance,
  type Result,
} from "@/lib/audit/scoring";
import { markTestRun, track } from "@/lib/audit/analytics";
import ScoreDial from "./ScoreDial";
import LeadForm, { type LeadDetails } from "./LeadForm";
import FullResults from "./FullResults";
import Md from "./Md";

/**
 * The Brand & Growth Audit, end to end: landing → 36 steps (30 questions plus an
 * importance rating per area) → score preview → details form → full results.
 *
 * Progress is kept in this browser (answers only, never contact details) so a
 * visitor can resume. UTM parameters are captured on arrival and sent with the
 * form so the CRM knows where the lead came from.
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

type Phase = "landing" | "quiz" | "preview" | "results";

export default function AuditApp({ emailEnabled }: { emailEnabled: boolean }) {
  const [phase, setPhase] = useState<Phase>("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [importance, setImportance] = useState<Record<string, Importance>>({});
  const [resume, setResume] = useState<Saved | null>(null);
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState<{
    status: "idle" | "sending" | "error";
    error?: string;
    field?: string;
  }>({ status: "idle" });
  const [unlocked, setUnlocked] = useState<{
    token: string | null;
    emailSent: boolean | null;
    firstName: string;
  } | null>(null);
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

  // Persist progress while the quiz is in play.
  useEffect(() => {
    if (phase === "quiz" || phase === "preview")
      save({ answers, importance, step });
  }, [answers, importance, step, phase]);

  // Move focus to the new question so screen readers announce it.
  useEffect(() => {
    if (phase !== "landing") headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, phase]);

  const result: Result | null = useMemo(
    () =>
      phase === "preview" || phase === "results"
        ? score({ answers, importance })
        : null,
    [phase, answers, importance]
  );

  const start = useCallback(
    (fresh: boolean) => {
      if (fresh) {
        setAnswers({});
        setImportance({});
        setStep(0);
        save(null);
      } else if (resume) {
        setAnswers(resume.answers ?? {});
        setImportance(resume.importance ?? {});
        setStep(Math.min(resume.step ?? 0, STEPS.length - 1));
      }
      setResume(null);
      setError("");
      submissionId.current = "";
      setPhase("quiz");
      track("audit_start", { resumed: !fresh });
    },
    [resume]
  );

  const current = STEPS[step];
  const answered = (s: Step) =>
    s.kind === "question"
      ? answers[s.id] !== undefined
      : importance[s.id] !== undefined;

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
    else {
      const r = score({ answers, importance });
      setPhase("preview");
      track("audit_complete", { band: r.overallBand ?? "none" });
      track("audit_preview_shown", {
        band: r.overallBand ?? "none",
        score: r.overall ?? undefined,
      });
    }
  }
  function back() {
    setError("");
    if (phase === "preview") setPhase("quiz");
    else if (step > 0) setStep(step - 1);
    else setPhase("landing");
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

  async function onLead(d: LeadDetails) {
    if (submit.status === "sending") return;
    if (!submissionId.current) submissionId.current = newId(); // stable across retries
    setSubmit({ status: "sending" });
    track("audit_form_submit", {
      marketing_consent: d.marketingConsent,
      has_business: Boolean(d.businessName),
    });
    let utm = {};
    try {
      utm = JSON.parse(sessionStorage.getItem(UTM_STORE) ?? "{}");
    } catch {}
    try {
      const res = await fetch("/api/audit/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...d,
          submissionId: submissionId.current,
          responses: encodeResponses({ answers, importance }),
          utm,
          test: isTest.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setSubmit({
          status: "error",
          error: data.error ?? "Something went wrong. Please try again.",
          field: data.field,
        });
        return;
      }
      setUnlocked({
        token: data.token ?? null,
        emailSent: data.emailConfigured ? Boolean(data.emailSent) : null,
        firstName: d.firstName.trim(),
      });
      setSubmit({ status: "idle" });
      setPhase("results");
      track("audit_results_unlocked", {
        email_sent: Boolean(data.emailSent),
        band: result?.overallBand ?? "none",
      });
      if (data.token) {
        save({ answers: {}, importance: {}, step: 0, token: data.token });
        window.history.replaceState(
          null,
          "",
          `/brand-growth-audit/results?r=${encodeURIComponent(data.token)}`
        );
      } else {
        save(null);
      }
    } catch {
      setSubmit({
        status: "error",
        error:
          "We couldn’t reach the server. Check your connection and try again.",
      });
    }
  }

  /* ---------------------------------------------------------------- views */

  if (phase === "results" && result && unlocked) {
    return (
      <div className="wrap pt-[calc(82px+clamp(2.5rem,7vh,5rem))] pb-[clamp(4rem,10vh,7rem)]">
        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Your full results
        </h2>
        <FullResults
          result={result}
          reportHref={
            unlocked.token
              ? `/api/audit/report?r=${encodeURIComponent(unlocked.token)}`
              : `/api/audit/report?a=${encodeResponses({
                  answers,
                  importance,
                })}`
          }
          firstName={unlocked.firstName}
          emailSent={unlocked.emailSent}
        />
      </div>
    );
  }

  if (phase === "preview" && result) {
    const band = AUDIT.bands.find((b) => b.name === result.overallBand);
    const p1 = result.priorities[0];
    const p1Cat = p1 && AUDIT.categories.find((c) => c.id === p1.areaId);
    const p1Area = p1 && result.areas.find((a) => a.id === p1.areaId);
    return (
      <div className="wrap pt-[calc(82px+clamp(2.5rem,7vh,5rem))] pb-[clamp(4rem,10vh,7rem)]">
        <div className="mx-auto grid max-w-[64rem] gap-[clamp(3rem,6vw,5rem)] lg:grid-cols-[1fr_1.05fr]">
          <section
            aria-labelledby="preview-h"
            className="text-center lg:text-left"
          >
            <p className="eyebrow text-oxblood">Your score</p>
            <h1
              id="preview-h"
              ref={headingRef}
              tabIndex={-1}
              className="mt-5 font-serif italic text-ink leading-[1.1] text-[clamp(2rem,4vw,2.9rem)] outline-none"
            >
              {result.overallBand
                ? `${result.overallBand}.`
                : "Your results are in."}
            </h1>
            <div className="mt-8 lg:-ml-4 lg:w-fit">
              <ScoreDial score={result.overall} band={result.overallBand} />
            </div>
            <p className="mx-auto mt-6 max-w-[44ch] font-sans text-[1.02rem] leading-[1.8] text-grey lg:mx-0">
              {result.overall === null
                ? "Many questions were marked not applicable, so there’s no overall score, but your area results are ready."
                : `${band?.meaning} Your overall score is the average of the areas you scored.`}
            </p>
            <dl className="mt-8 space-y-6 border-t border-rule pt-6 text-left">
              {result.strongest && (
                <div>
                  <dt className="eyebrow text-grey">
                    Your strongest area{result.strongest.soFar ? " so far" : ""}
                  </dt>
                  <dd className="mt-2 font-sans text-[1.05rem] text-ink">
                    {SHORT_TITLES[result.strongest.areaId]}{" "}
                    <span className="text-grey">
                      ·{" "}
                      {result.areas
                        .find((a) => a.id === result.strongest!.areaId)
                        ?.score?.toFixed(1)}
                    </span>
                  </dd>
                </div>
              )}
              {p1 && p1Cat && p1Area && (
                <div>
                  <dt className="eyebrow text-grey">
                    {p1.urgent
                      ? "Worth fixing first"
                      : "Your biggest opportunity"}
                  </dt>
                  <dd className="mt-2 font-sans text-[1.05rem] text-ink">
                    {SHORT_TITLES[p1.areaId]}{" "}
                    <span className="text-grey">
                      · {p1Area.score?.toFixed(1)}
                    </span>
                  </dd>
                  <dd className="mt-2 font-sans text-[0.95rem] leading-[1.7] text-grey">
                    {p1.urgent
                      ? "You said enquiries often go unanswered. Missed enquiries cost you clients directly, so this comes first."
                      : p1Area.band && (
                          <Md text={p1Cat.meanings[p1Area.band]} />
                        )}
                  </dd>
                </div>
              )}
              {!p1 && result.allDistinctive && (
                <p className="font-sans text-[0.95rem] leading-[1.7] text-grey">
                  Every area you scored is a genuine strength.
                </p>
              )}
            </dl>
            <p className="mt-8 text-left font-sans text-[0.78rem] leading-[1.6] text-light">
              A practical self-assessment, not a validated measure or formal
              audit.
            </p>
            <button
              type="button"
              onClick={back}
              className="eyebrow mt-6 text-grey hover:text-ink"
            >
              ← Review my answers
            </button>
          </section>

          <section
            aria-labelledby="unlock-h"
            className="border border-rule bg-white p-[clamp(1.5rem,4vw,2.75rem)]"
          >
            <p className="eyebrow text-oxblood">Your full report</p>
            <h2
              id="unlock-h"
              className="mt-4 font-serif italic text-ink text-[clamp(1.7rem,3vw,2.2rem)] leading-[1.15]"
            >
              Your results are ready.
            </h2>
            <p className="mt-4 font-sans text-[0.98rem] leading-[1.75] text-grey">
              {emailEnabled
                ? "Get your personalised Brand & Growth Report, including your category breakdown and recommended next steps, delivered to your inbox. You’ll also see it here straight away, with three priorities, a 30-day plan and the 28-page companion workbook."
                : "Get your personalised Brand & Growth Report, including your category breakdown, recommended next steps, three priorities and a 30-day plan. It opens here straight away, with a PDF copy to download and the 28-page companion workbook."}
            </p>
            <div className="mt-8">
              <LeadForm
                onSubmit={onLead}
                status={submit.status}
                serverError={submit.error}
                serverField={submit.field}
                emailEnabled={emailEnabled}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }

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

    return (
      <div className="wrap pt-[calc(82px+clamp(1.5rem,5vh,3.5rem))] pb-[clamp(4rem,10vh,7rem)]">
        <div className="mx-auto max-w-[44rem]">
          {/* progress: six segments, one per area */}
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow text-oxblood">
              {cat.id} · {SHORT_TITLES[cat.id]}
            </p>
            <p className="eyebrow text-grey" aria-live="polite">
              {q
                ? `Question ${questionNo} of ${QUESTIONS.length}`
                : `Area ${current.areaIndex + 1} of 6 · importance`}
            </p>
          </div>
          <div
            className="mt-4 grid grid-cols-6 gap-1.5"
            role="progressbar"
            aria-label="Audit progress"
            aria-valuemin={0}
            aria-valuemax={STEPS.length}
            aria-valuenow={step}
            aria-valuetext={`Step ${step + 1} of ${STEPS.length}`}
          >
            {AUDIT.categories.map((c, i) => {
              const per = c.questions.length + 1;
              const done = Math.max(
                0,
                Math.min(
                  per,
                  step -
                    i * per +
                    (answered(current) && current.areaIndex === i ? 1 : 0)
                )
              );
              return (
                <span
                  key={c.id}
                  className="relative h-[3px] overflow-hidden bg-rule"
                >
                  <span
                    className="audit-progress absolute inset-y-0 left-0 bg-oxblood"
                    style={{ width: `${(done / per) * 100}%` }}
                  />
                </span>
              );
            })}
          </div>

          <section
            key={current.id}
            className="audit-step mt-[clamp(2.5rem,7vh,4rem)]"
          >
            {current.kind === "question" && current.qIndex === 0 && (
              <p className="mb-6 max-w-[56ch] font-sans text-[0.9rem] leading-[1.7] text-grey">
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
              className="mt-4 font-sans font-normal tracking-[-0.01em] text-ink leading-[1.35] text-[clamp(1.35rem,2.8vw,1.85rem)] outline-none"
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
              <p className="mt-4 max-w-[52ch] font-sans text-[0.95rem] leading-[1.7] text-grey">
                A low score in an area that isn’t important to your business at
                the moment is not a problem. This helps set your priorities.
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
                    <span className="block font-sans text-[1rem] leading-[1.55] text-ink">
                      <Md text={o.label} />
                    </span>
                    {!q && (
                      <span className="mt-0.5 block font-sans text-[0.85rem] text-grey">
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
                  <span className="flex-1 font-sans text-[0.95rem] text-grey">
                    Not applicable to my business
                  </span>
                </label>
              )}
            </div>
            {q && (
              <p className="mt-4 font-sans text-[0.82rem] text-light">
                If you sit between two answers, choose the lower one.
              </p>
            )}
          </section>

          <div aria-live="assertive">
            {error && (
              <p
                id="step-error"
                className="mt-6 font-sans text-[0.92rem] text-oxblood"
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
              {step === STEPS.length - 1 ? "See my score" : "Next"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- landing */
  const resumeAt = resume ? Math.min((resume.step ?? 0) + 1, STEPS.length) : 0;
  return (
    <>
      <section className="film-grain relative overflow-hidden bg-charcoal text-white">
        <div className="wrap relative z-10 pt-[calc(82px+clamp(3.5rem,11vh,7.5rem))] pb-[clamp(4rem,11vh,7.5rem)] text-center">
          <p className="eyebrow text-white/70">
            Free · The Small Business Brand &amp; Growth Audit
          </p>
          <h1 className="mx-auto mt-7 max-w-[18ch] font-serif italic leading-[1.06] text-[clamp(2.5rem,6vw,4.6rem)]">
            How well is your business set up to grow?
          </h1>
          <p className="mx-auto mt-7 max-w-[46ch] font-sans font-light text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.8] text-white/85">
            Thirty questions across six areas of your business. See your score
            straight away, then get a personalised report with three priorities
            and a 30-day plan.
          </p>
          <div className="mx-auto mt-10 flex max-w-[22rem] flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            {resume && !resume.token ? (
              <>
                <button
                  type="button"
                  onClick={() => start(false)}
                  className="hero-btn hero-btn--light"
                >
                  Continue from step {resumeAt}
                </button>
                <button
                  type="button"
                  onClick={() => start(true)}
                  className="hero-btn hero-btn--outline-light"
                >
                  Start again
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => start(true)}
                className="hero-btn hero-btn--light"
              >
                Start your free audit
              </button>
            )}
          </div>
          <p className="hero-note">
            About 10–12 minutes · No sign-up needed to see your score
          </p>
          {resume?.token && (
            <p className="mt-6 font-sans text-[0.9rem] text-white/75">
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

      <section className="wrap py-[clamp(4.5rem,11vh,7.5rem)]">
        <div className="mx-auto grid max-w-[64rem] gap-[clamp(2.5rem,6vw,5rem)] md:grid-cols-2">
          <div>
            <p className="eyebrow text-grey">Who it’s for</p>
            <p className="mt-5 font-serif italic text-ink text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.25]">
              Owner-led businesses that are already trading, and want to attract
              the right clients, keep them coming back and run with less effort.
            </p>
            <p className="mt-5 font-sans text-[1rem] leading-[1.8] text-grey">
              Written for clinics, salons, studios, cafés, florists and
              boutiques with one to fifteen people. It doesn’t assume you have a
              marketing team, a large budget or specialist software.
            </p>
          </div>
          <div>
            <p className="eyebrow text-grey">What you’ll get</p>
            <ul className="mt-5 border-t border-rule">
              {[
                "A score for six areas of your business, showing your strengths and where attention will make the biggest difference",
                "Practical actions matched to your answers, with a rough idea of the effort each one takes",
                "Three priorities and a realistic 30-day plan, plus the 28-page companion workbook",
              ].map((t) => (
                <li
                  key={t}
                  className="border-b border-rule py-4 font-sans text-[1rem] leading-[1.7] text-ink"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-rule bg-limestone py-[clamp(4.5rem,11vh,7.5rem)]">
        <div className="wrap">
          <div className="mx-auto max-w-[64rem]">
            <p className="eyebrow text-grey">Six areas, five questions each</p>
            <ol className="mt-8 grid gap-x-12 md:grid-cols-2">
              {AUDIT.categories.map((c) => (
                <li
                  key={c.id}
                  className="grid grid-cols-[2.75rem_1fr] border-t border-ink/15 py-6"
                >
                  <span className="pt-1 font-sans text-[0.8rem] tracking-[0.16em] text-oxblood">
                    {c.id}
                  </span>
                  <span>
                    <span className="block font-serif text-[1.5rem] leading-[1.15] text-ink">
                      {c.title}
                    </span>
                    <span className="mt-2 block font-sans text-[0.92rem] leading-[1.65] text-grey">
                      <Md text={c.assessing} />
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="wrap py-[clamp(4.5rem,11vh,7.5rem)]">
        <div className="mx-auto max-w-[44rem] text-center">
          <p className="eyebrow text-grey">How it works</p>
          <ol className="mt-8 space-y-5 text-left">
            {[
              [
                "Answer as things are today.",
                "Not as you plan them to be. Choose the description that fits best, and mark anything that genuinely doesn’t apply.",
              ],
              [
                "See your score straight away.",
                "Your overall score, your strongest area and your biggest opportunity, with no sign-up.",
              ],
              [
                "Unlock your full report.",
                "Add your email to see every area in detail, with your three priorities, a 30-day plan, a PDF copy and the workbook.",
              ],
            ].map(([h, b], i) => (
              <li
                key={h}
                className="grid grid-cols-[2.5rem_1fr] border-b border-rule pb-5"
              >
                <span className="font-serif italic text-[1.6rem] leading-none text-oxblood">
                  {i + 1}
                </span>
                <span className="font-sans text-[1rem] leading-[1.7] text-ink">
                  <strong className="font-bold">{h}</strong>{" "}
                  <span className="text-grey">{b}</span>
                </span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => start(!resume || Boolean(resume.token))}
            className="hero-btn hero-btn--oxblood mt-12"
          >
            {resume && !resume.token
              ? `Continue from step ${resumeAt}`
              : "Start your free audit"}
          </button>
          <p className="mx-auto mt-10 max-w-[56ch] font-sans text-[0.8rem] leading-[1.7] text-grey">
            {AUDIT.disclaimer}
          </p>
        </div>
      </section>
    </>
  );
}
