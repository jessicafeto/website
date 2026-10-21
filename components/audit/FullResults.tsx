"use client";

import { Link } from "@/i18n/navigation";
import {
  AREA_SERVICE,
  AUDIT,
  BOOKING_URL,
  QUESTIONS,
  SHORT_TITLES,
  WORKBOOK_URL,
} from "@/content/audit";
import { IMPORTANCE_LABEL, type Result } from "@/lib/audit/scoring";
import { track } from "@/lib/audit/analytics";
import ScoreDial from "./ScoreDial";
import Md from "./Md";

const pct = (s: number) => `${((s - 1) / 3) * 100}%`;

function StatusChip({ status }: { status: string | null }) {
  if (!status) return null;
  const strong = status === "Act now";
  return (
    <span
      className={`eyebrow inline-block whitespace-nowrap border px-2.5 py-1 ${
        strong
          ? "border-oxblood bg-oxblood text-white"
          : status === "Plan next"
          ? "border-oxblood text-oxblood"
          : "border-rule text-grey"
      }`}
    >
      {status}
    </span>
  );
}

function Section({
  no,
  label,
  children,
}: {
  no: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule py-[clamp(3.5rem,8vh,5.5rem)]">
      <div className="mb-10 flex items-baseline gap-5">
        <span className="chapter__no">{no}</span>
        <h2 className="chapter__label">{label}</h2>
      </div>
      {children}
    </section>
  );
}

/**
 * The unlocked results: everything the workbook's results pages ask the reader
 * to work out by hand, filled in from their answers.
 */
export default function FullResults({
  result,
  reportHref,
  firstName,
  emailSent,
}: {
  result: Result;
  reportHref: string;
  firstName?: string;
  emailSent?: boolean | null;
}) {
  const band = AUDIT.bands.find((b) => b.name === result.overallBand);
  const strongest = result.strongest;
  const priorityAreas = new Set(result.priorities.map((p) => p.areaId));

  return (
    <div className="mx-auto w-full max-w-[60rem]">
      {/* ---------- headline ---------- */}
      <header className="pb-[clamp(3rem,8vh,5rem)]">
        <div className="text-center">
          <p className="eyebrow text-oxblood">Your Brand &amp; Growth Report</p>
          <h1 className="mx-auto mt-6 max-w-[22ch] font-serif italic text-ink leading-[1.08] text-[clamp(2.2rem,5vw,3.6rem)]">
            {firstName
              ? `${firstName}, here are your full results.`
              : "Here are your full results."}
          </h1>
          {emailSent === true && (
            <p className="mx-auto mt-6 font-sans text-[0.95rem] text-grey">
              We’ve also emailed you a copy, with a private link back to this
              page.
            </p>
          )}
          {emailSent === false && (
            <p
              role="status"
              className="mx-auto mt-6 max-w-[52ch] border border-rule bg-limestone px-5 py-4 font-sans text-[0.95rem] text-ink"
            >
              We couldn’t send your results email just now. Everything is below,
              and you can download your report from this page. Bookmark it to
              come back: the link works for 12 months.
            </p>
          )}
        </div>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-[auto_1fr]">
          <ScoreDial score={result.overall} band={result.overallBand} />
          <div>
            {result.overall === null ? (
              <p className="font-sans text-[1.05rem] leading-[1.8] text-grey">
                So many questions were marked as not applicable that an overall
                score wouldn’t be meaningful. Your area-by-area results are
                below.
              </p>
            ) : (
              <>
                <p className="eyebrow text-oxblood">{result.overallBand}</p>
                <p className="mt-3 font-serif italic text-ink text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.25]">
                  {band?.meaning}
                </p>
              </>
            )}
            <dl className="mt-8 grid gap-6 border-t border-rule pt-6 sm:grid-cols-2">
              {strongest && (
                <div>
                  <dt className="eyebrow text-grey">
                    Strongest area{strongest.soFar ? " so far" : ""}
                  </dt>
                  <dd className="mt-2 font-sans text-[1.05rem] text-ink">
                    {SHORT_TITLES[strongest.areaId]}
                  </dd>
                </div>
              )}
              {result.priorities[0] && (
                <div>
                  <dt className="eyebrow text-grey">First priority</dt>
                  <dd className="mt-2 font-sans text-[1.05rem] text-ink">
                    {SHORT_TITLES[result.priorities[0].areaId]}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </header>

      {/* ---------- six areas ---------- */}
      <Section no="01" label="Your six areas">
        <ul
          className="space-y-7"
          aria-label="Scores by area, on a scale of 1.0 to 4.0"
        >
          {result.areas.map((a) => (
            <li key={a.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <span className="font-sans text-[1rem] text-ink">
                  <span className="mr-3 text-[0.8rem] tracking-[0.16em] text-oxblood">
                    {a.id}
                  </span>
                  {a.title}
                </span>
                <span className="flex items-center gap-3">
                  <span className="font-sans text-[0.85rem] text-grey">
                    {a.score === null
                      ? "Not scored"
                      : `${a.score.toFixed(1)} · ${a.band}`}
                  </span>
                  <StatusChip status={a.status} />
                </span>
              </div>
              <div className="relative mt-3 h-[6px] bg-limestone" aria-hidden>
                {a.score !== null && (
                  <div
                    className={`audit-bar absolute inset-y-0 left-0 ${
                      priorityAreas.has(a.id) ? "bg-oxblood" : "bg-charcoal"
                    }`}
                    style={{ width: pct(a.score) }}
                  />
                )}
                {[2.0, 2.8, 3.5].map((t) => (
                  <span
                    key={t}
                    className="absolute inset-y-0 w-px bg-paper"
                    style={{ left: pct(t) }}
                  />
                ))}
              </div>
              <p className="mt-2 font-sans text-[0.8rem] text-grey">
                Importance to you: {IMPORTANCE_LABEL[a.importance]}
                {a.notApplicable > 0 && ` · ${a.notApplicable} not applicable`}
              </p>
            </li>
          ))}
        </ul>
        {/* Band scale, aligned with the ticks on the bars */}
        <div
          className="relative mt-6 h-4 font-sans text-[0.7rem] text-light"
          aria-hidden
        >
          {AUDIT.bands.map((b) => (
            <span
              key={b.name}
              className="absolute top-0 whitespace-nowrap"
              style={{ left: pct(b.min) }}
            >
              {b.min.toFixed(1)}
              <span className="hidden md:inline"> {b.name}</span>
            </span>
          ))}
        </div>
      </Section>

      {/* ---------- three priorities ---------- */}
      <Section no="02" label="Your three priorities">
        {result.priorities.length === 0 ? (
          <p className="max-w-[56ch] font-sans text-[1.05rem] leading-[1.8] text-grey">
            {result.allDistinctive
              ? "Every area you scored is a genuine strength. Protect what's working, and use the 30-day check-ins below to keep it that way."
              : "None of your areas needs urgent attention right now. Use the area notes below to refine what's already working."}
          </p>
        ) : (
          <ol className="grid gap-6 md:grid-cols-3">
            {result.priorities.map((p) => (
              <li
                key={p.areaId}
                className="flex flex-col border border-rule bg-white p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-serif italic text-[2.4rem] leading-none text-oxblood">
                    {p.rank}
                  </span>
                  {p.urgent ? (
                    <StatusChip status="Act now" />
                  ) : (
                    <StatusChip status={p.status} />
                  )}
                </div>
                <h3 className="mt-5 font-sans font-bold text-[1.05rem] text-ink">
                  {SHORT_TITLES[p.areaId]}
                </h3>
                {p.urgent && (
                  <p className="mt-2 font-sans text-[0.85rem] text-oxblood">
                    Missed enquiries cost you clients directly, so treat this as
                    urgent.
                  </p>
                )}
                <p className="mt-4 font-sans text-[0.9rem] leading-[1.65] text-grey">
                  <span className="eyebrow block text-grey">You said</span>
                  <Md text={p.challenge} />
                </p>
                <p className="mt-4 font-sans text-[0.95rem] leading-[1.65] text-ink">
                  <span className="eyebrow block text-grey">Start with</span>
                  <strong className="font-bold">{p.action.title}.</strong>{" "}
                  <Md text={p.action.body} />
                </p>
                <p className="mt-auto pt-5 font-sans text-[0.8rem] text-grey">
                  {p.action.effort} · {p.when}
                </p>
              </li>
            ))}
          </ol>
        )}
      </Section>

      {/* ---------- 30-day plan ---------- */}
      {result.priorities.length > 0 && (
        <Section no="03" label="Your 30-day plan">
          <ol className="border-t border-ink/80">
            {result.priorities.map((p) => {
              const q = QUESTIONS.find((x) => x.id === p.questionId);
              return (
                <li
                  key={p.areaId}
                  className="grid gap-4 border-b border-rule py-8 md:grid-cols-[9rem_1fr] md:gap-10"
                >
                  <p className="eyebrow pt-1 text-oxblood">{p.when}</p>
                  <div>
                    <h3 className="font-sans font-bold text-[1.05rem] text-ink">
                      {p.action.title}{" "}
                      <span className="font-normal text-grey">
                        · {SHORT_TITLES[p.areaId]}
                      </span>
                    </h3>
                    <dl className="mt-4 grid gap-4 font-sans text-[0.92rem] leading-[1.65] sm:grid-cols-2">
                      <div>
                        <dt className="eyebrow text-grey">
                          Current challenge
                          {q ? ` (${q.title.toLowerCase()})` : ""}
                        </dt>
                        <dd className="mt-1 text-ink">
                          <Md text={p.challenge} />
                        </dd>
                      </div>
                      <div>
                        <dt className="eyebrow text-grey">
                          What good looks like
                        </dt>
                        <dd className="mt-1 text-ink">
                          <Md text={p.goodLooksLike} />
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="eyebrow text-grey">
                          Recommended action · {p.action.effort}
                        </dt>
                        <dd className="mt-1 text-ink">
                          <Md text={p.action.body} />
                        </dd>
                        {p.action.note && (
                          <dd className="mt-2 text-grey">
                            <Md text={p.action.note} />
                          </dd>
                        )}
                      </div>
                    </dl>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {AUDIT.milestones.map((m) => (
              <div key={m.day} className="border-t border-rule pt-4">
                <p className="eyebrow text-oxblood">{m.day}</p>
                <p className="mt-2 font-sans text-[0.92rem] leading-[1.65] text-grey">
                  {m.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 font-serif italic text-[1.15rem] text-ink">
            A tip: {AUDIT.milestoneTip}
          </p>
        </Section>
      )}

      {/* ---------- area by area ---------- */}
      <Section no={result.priorities.length ? "04" : "03"} label="Area by area">
        <div className="space-y-4">
          {AUDIT.categories.map((cat) => {
            const a = result.areas.find((x) => x.id === cat.id)!;
            const recs = result.recommendations[cat.id];
            return (
              <details
                key={cat.id}
                className="audit-details group border border-rule bg-white"
                open={priorityAreas.has(cat.id)}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 md:p-6">
                  <span className="font-sans text-[1rem] text-ink">
                    <span className="mr-3 text-[0.8rem] tracking-[0.16em] text-oxblood">
                      {cat.id}
                    </span>
                    {cat.title}
                  </span>
                  <span className="flex items-center gap-3 font-sans text-[0.85rem] text-grey">
                    {a.score === null ? "Not scored" : a.score.toFixed(1)}
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-open:rotate-45 text-[1.2rem] leading-none text-ink"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <div className="border-t border-rule p-5 md:p-6">
                  {a.band ? (
                    <p className="font-sans text-[0.98rem] leading-[1.75] text-ink">
                      <strong className="font-bold">{a.band}.</strong>{" "}
                      {cat.meanings[a.band]}
                    </p>
                  ) : (
                    <p className="font-sans text-[0.98rem] leading-[1.75] text-grey">
                      More than two questions were marked not applicable, so
                      this area isn’t scored. The workbook’s actions for it are
                      still a useful reference.
                    </p>
                  )}
                  {recs.length > 0 && (
                    <>
                      <p className="eyebrow mt-6 text-grey">
                        Recommended for you
                      </p>
                      <ul className="mt-3 space-y-4">
                        {recs.map((r) => (
                          <li
                            key={r.actionKey}
                            className="font-sans text-[0.95rem] leading-[1.7] text-ink"
                          >
                            <strong className="font-bold">{r.title}.</strong>{" "}
                            <Md text={r.body} />{" "}
                            <span className="whitespace-nowrap text-[0.8rem] text-grey">
                              ({r.effort})
                            </span>
                            {r.note && (
                              <span className="mt-1 block text-grey">
                                <Md text={r.note} />
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p className="mt-6 font-sans text-[0.85rem] leading-[1.7] text-grey">
                    <span className="eyebrow mr-2">Priority level</span>
                    <Md text={cat.priority} />
                  </p>
                  <p className="mt-6">
                    <Link
                      href={AREA_SERVICE[cat.id].href}
                      className="eyebrow text-oxblood hover:opacity-60"
                      onClick={() =>
                        track("audit_service_click", {
                          area: cat.id,
                          service: AREA_SERVICE[cat.id].label,
                        })
                      }
                    >
                      Where noova can help: {AREA_SERVICE[cat.id].label} →
                    </Link>
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      </Section>

      {/* ---------- downloads + next step ---------- */}
      <section className="border-t border-rule py-[clamp(3.5rem,8vh,5.5rem)]">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow text-grey">Keep your results</p>
            <div className="mt-6 flex flex-col items-start gap-3">
              <a
                href={reportHref}
                className="hero-btn hero-btn--oxblood"
                onClick={() => track("audit_report_download")}
              >
                Download your personalised report
              </a>
              <a
                href={WORKBOOK_URL}
                download
                className="hero-btn hero-btn--outline"
                onClick={() => track("audit_workbook_download")}
              >
                Download the 28-page workbook
              </a>
            </div>
            <p className="mt-5 max-w-[42ch] font-sans text-[0.85rem] leading-[1.7] text-grey">
              The workbook covers every area in more depth, with tools, space
              for notes and a printable plan.
            </p>
          </div>
          <div className="bg-charcoal p-8 text-white md:p-10">
            <p className="eyebrow text-white/70">
              Would a second opinion help?
            </p>
            <p className="mt-4 font-serif italic text-[1.6rem] leading-[1.25]">
              Talk through your results with Jessica.
            </p>
            <p className="mt-4 font-sans text-[0.95rem] leading-[1.75] text-white/80">
              Book a free 30-minute discovery call. Bring your scores and your
              three priorities. We’ll help you think through what to tackle
              first, whether or not you decide to work with us.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener"
              className="hero-btn hero-btn--light mt-8 inline-block"
              onClick={() =>
                track("audit_call_click", {
                  band: result.overallBand ?? "none",
                })
              }
            >
              Book a free discovery call
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-rule pt-8 pb-4">
        <p className="font-sans text-[0.8rem] leading-[1.7] text-grey">
          {AUDIT.disclaimer}
        </p>
        <p className="mt-4 font-sans text-[0.8rem] text-grey">
          <Link
            href="/brand-growth-audit"
            className="underline underline-offset-2 hover:text-ink"
          >
            Retake the audit
          </Link>
          <span className="mx-3 text-light" aria-hidden>
            ·
          </span>
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-ink"
          >
            noovadata.com
          </Link>
        </p>
      </footer>
    </div>
  );
}
