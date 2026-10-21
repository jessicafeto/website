/**
 * Scoring engine for the Brand & Growth Audit.
 *
 * Deterministic and dependency-free, so the browser (score preview) and the
 * server (submission, results page, PDF) always agree. It implements the
 * workbook's method exactly:
 *   - each question is scored 1–4, or N/A (left out);
 *   - an area's score is the average of its answered questions, to 1 dp;
 *   - an area with more than two N/A answers is not scored;
 *   - the overall score is the average of the scored areas, to 1 dp;
 *   - bands: Foundations 1.0–1.9, Taking shape 2.0–2.7, Established 2.8–3.4,
 *     Distinctive 3.5–4.0;
 *   - priorities follow the workbook's band × importance grid.
 * It's a self-assessment, not a validated measure — see AUDIT.disclaimer.
 */
import {
  AUDIT,
  CATEGORY_IDS,
  DISTINCTIVE_ACTIONS,
  QUESTION_ACTIONS,
  QUESTIONS,
  getAction,
  type BandName,
  type Effort,
} from "@/content/audit";

/** 0 = not applicable; 1–4 = the described answer chosen. */
export type Answer = 0 | 1 | 2 | 3 | 4;
/** 1 = Low, 2 = Medium, 3 = High. */
export type Importance = 1 | 2 | 3;

export type Responses = {
  answers: Record<string, Answer>; // keyed by question id, e.g. "2.4"
  importance: Record<string, Importance>; // keyed by area id, e.g. "02"
};

export type Status = "Act now" | "Plan next" | "Keep in view" | "Maintain";

export type AreaResult = {
  id: string;
  title: string;
  score: number | null; // null = not scored (more than two N/A)
  band: BandName | null;
  answered: number;
  notApplicable: number;
  importance: Importance;
  status: Status | null;
};

export type Recommendation = {
  questionId: string;
  answer: Answer;
  actionKey: string;
  title: string;
  body: string;
  note: string | null;
  effort: Effort;
};

export type Priority = {
  rank: 1 | 2 | 3;
  areaId: string;
  status: Status | null;
  urgent: boolean;
  questionId: string;
  challenge: string; // the visitor's own answer
  goodLooksLike: string; // the workbook's level-4 answer
  action: Recommendation;
  when: string;
};

export type Result = {
  areas: AreaResult[];
  overall: number | null; // null when fewer than three areas could be scored
  overallBand: BandName | null;
  strongest: { areaId: string; soFar: boolean } | null;
  priorities: Priority[];
  /** Per area: actions for questions answered 1 or 2, weakest first. */
  recommendations: Record<string, Recommendation[]>;
  allDistinctive: boolean;
  missedEnquiries: boolean;
};

export const IMPORTANCE_LABEL: Record<Importance, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
};
export const MIN_SCORED_AREAS = 3;

/** Round to one decimal place, as the workbook does (2.75 → 2.8). */
export function round1(x: number): number {
  return Math.round((x + Number.EPSILON) * 10) / 10;
}

export function bandFor(score: number): BandName {
  if (score >= 3.5) return "Distinctive";
  if (score >= 2.8) return "Established";
  if (score >= 2.0) return "Taking shape";
  return "Foundations";
}

/** The workbook's priority grid: band (rows) × importance (columns). */
export function statusFor(band: BandName, importance: Importance): Status {
  if (band === "Distinctive") return "Maintain";
  if (band === "Established")
    return importance === 3
      ? "Plan next"
      : importance === 2
      ? "Keep in view"
      : "Maintain";
  return importance === 3
    ? "Act now"
    : importance === 2
    ? "Plan next"
    : "Keep in view";
}

function toAnswer(v: unknown): Answer {
  return v === 1 || v === 2 || v === 3 || v === 4 ? v : 0; // anything else counts as N/A
}
function toImportance(v: unknown): Importance {
  return v === 1 || v === 3 ? v : 2; // unrated counts as Medium
}

function recommendation(
  questionId: string,
  answer: Answer,
  actionKey: string
): Recommendation {
  const a = getAction(actionKey);
  return {
    questionId,
    answer,
    actionKey,
    title: a.title,
    body: a.body,
    note: a.note,
    effort: a.effort,
  };
}

const WHEN = ["Week 1", "Weeks 2–3", "Week 4"] as const;

export function score(input: Responses): Result {
  const answers: Record<string, Answer> = {};
  for (const q of QUESTIONS) answers[q.id] = toAnswer(input.answers?.[q.id]);

  const areas: AreaResult[] = AUDIT.categories.map((cat) => {
    const vals = cat.questions.map((q) => answers[q.id]).filter((v) => v > 0);
    const notApplicable = cat.questions.length - vals.length;
    const importance = toImportance(input.importance?.[cat.id]);
    const scored = notApplicable <= 2 && vals.length > 0;
    const s = scored
      ? round1(vals.reduce<number>((t, v) => t + v, 0) / vals.length)
      : null;
    const band = s === null ? null : bandFor(s);
    return {
      id: cat.id,
      title: cat.title,
      score: s,
      band,
      answered: vals.length,
      notApplicable,
      importance,
      status: band ? statusFor(band, importance) : null,
    };
  });

  const scored = areas.filter((a) => a.score !== null);
  const overall =
    scored.length >= MIN_SCORED_AREAS
      ? round1(
          scored.reduce((t, a) => t + (a.score as number), 0) / scored.length
        )
      : null;

  // Strongest: highest score; ties → more important, then workbook order.
  const order = (id: string) => CATEGORY_IDS.indexOf(id);
  const strongestArea = [...scored].sort(
    (a, b) =>
      (b.score as number) - (a.score as number) ||
      b.importance - a.importance ||
      order(a.id) - order(b.id)
  )[0];

  // Recommendations: every question answered 1 or 2, weakest answers first.
  const recommendations: Record<string, Recommendation[]> = {};
  for (const cat of AUDIT.categories) {
    const seen = new Set<string>();
    const recs: Recommendation[] = [];
    const weak = cat.questions
      .filter((q) => answers[q.id] === 1 || answers[q.id] === 2)
      .sort((a, b) => answers[a.id] - answers[b.id]);
    for (const q of weak) {
      for (const key of QUESTION_ACTIONS[q.id]) {
        if (seen.has(key)) continue;
        seen.add(key);
        recs.push(recommendation(q.id, answers[q.id], key));
      }
    }
    const area = areas.find((a) => a.id === cat.id);
    if (
      !recs.length &&
      area?.band === "Distinctive" &&
      DISTINCTIVE_ACTIONS[cat.id]
    ) {
      recs.push(recommendation("", 0, DISTINCTIVE_ACTIONS[cat.id]));
    }
    recommendations[cat.id] = recs;
  }

  // Priorities: Act now, then Plan next, then anything else below 3.5.
  // Lowest score first; ties → more important, then workbook order.
  const byNeed = (a: AreaResult, b: AreaResult) =>
    (a.score as number) - (b.score as number) ||
    b.importance - a.importance ||
    order(a.id) - order(b.id);
  const act = scored.filter((a) => a.status === "Act now").sort(byNeed);
  const plan = scored.filter((a) => a.status === "Plan next").sort(byNeed);
  const rest = scored
    .filter(
      (a) =>
        a.status !== "Act now" &&
        a.status !== "Plan next" &&
        (a.score as number) < 3.5
    )
    .sort(byNeed);
  let picked = [...act, ...plan, ...rest].map((a) => a.id);

  // The workbook: "if missed enquiries are happening, treat them as urgent."
  const missedEnquiries = answers["6.2"] === 1;
  if (missedEnquiries) picked = ["06", ...picked.filter((id) => id !== "06")];
  picked = picked.slice(0, 3);

  const priorities: Priority[] = picked.map((areaId, i) => {
    const cat = AUDIT.categories.find((c) => c.id === areaId)!;
    const urgent = missedEnquiries && areaId === "06";
    // Focus on the weakest answered question in the area (ties → workbook order).
    const focus = urgent
      ? cat.questions.find((q) => q.id === "6.2")!
      : [...cat.questions]
          .filter((q) => answers[q.id] > 0)
          .sort((a, b) => answers[a.id] - answers[b.id])[0];
    const level = answers[focus.id];
    return {
      rank: (i + 1) as 1 | 2 | 3,
      areaId,
      status: areas.find((a) => a.id === areaId)!.status,
      urgent,
      questionId: focus.id,
      challenge: focus.answers[level - 1],
      goodLooksLike: focus.answers[3],
      action: recommendation(focus.id, level, QUESTION_ACTIONS[focus.id][0]),
      when: WHEN[i],
    };
  });

  // The workbook asks for at least one quick win among the three. If there's
  // none, swap one action (starting with the last priority) for a quick win
  // recommended in the same area.
  if (
    priorities.length &&
    !priorities.some((p) => p.action.effort === "Quick win")
  ) {
    for (const p of [...priorities].reverse()) {
      if (p.urgent) continue;
      const alt = recommendations[p.areaId].find(
        (x) => x.effort === "Quick win"
      );
      if (!alt) continue;
      const q = QUESTIONS.find((x) => x.id === alt.questionId)!;
      Object.assign(p, {
        questionId: q.id,
        challenge: q.answers[alt.answer - 1],
        goodLooksLike: q.answers[3],
        action: alt,
      });
      break;
    }
  }

  return {
    areas,
    overall,
    overallBand: overall === null ? null : bandFor(overall),
    strongest: strongestArea
      ? {
          areaId: strongestArea.id,
          soFar: strongestArea.band === "Foundations",
        }
      : null,
    priorities,
    recommendations,
    allDistinctive:
      scored.length > 0 && scored.every((a) => a.band === "Distinctive"),
    missedEnquiries,
  };
}

/* ---------- compact encoding (used by the signed results token) ---------- */

/** 30 digits (0 = N/A) + 6 digits of importance, in workbook order. */
export function encodeResponses(r: Responses): string {
  const a = QUESTIONS.map((q) => toAnswer(r.answers?.[q.id])).join("");
  const i = CATEGORY_IDS.map((id) => toImportance(r.importance?.[id])).join("");
  return a + i;
}

export function decodeResponses(s: string): Responses | null {
  if (
    !new RegExp(
      `^[0-4]{${QUESTIONS.length}}[1-3]{${CATEGORY_IDS.length}}$`
    ).test(s)
  )
    return null;
  const answers: Record<string, Answer> = {};
  QUESTIONS.forEach((q, i) => (answers[q.id] = Number(s[i]) as Answer));
  const importance: Record<string, Importance> = {};
  CATEGORY_IDS.forEach(
    (id, i) => (importance[id] = Number(s[QUESTIONS.length + i]) as Importance)
  );
  return { answers, importance };
}

/* ---------- CRM tags (only applied when the answers support them) ---------- */

export function tagsFor(
  result: Result,
  answers: Record<string, Answer>
): string[] {
  const needs = (...ids: string[]) =>
    result.areas.some(
      (a) =>
        ids.includes(a.id) &&
        (a.status === "Act now" || a.status === "Plan next")
    );
  const tags = ["Brand Audit"];
  if (needs("01")) tags.push("Brand Opportunity");
  if (needs("02")) tags.push("Website Opportunity");
  if (needs("03", "04")) tags.push("Marketing Opportunity");
  if (needs("05", "06")) tags.push("CRM & Automation Opportunity");
  if (
    ["4.1", "4.5", "6.5"].some((id) => answers[id] === 1 || answers[id] === 2)
  )
    tags.push("Analytics Opportunity");
  return tags;
}
