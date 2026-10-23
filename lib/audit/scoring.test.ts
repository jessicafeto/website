/**
 * Tests for the audit scoring engine. Run with `npm run test:audit`.
 * Uses Node's built-in test runner (bundled with esbuild so the @/ alias resolves).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CATEGORY_IDS,
  QUESTIONS,
  QUESTION_ACTIONS,
  getAction,
} from "@/content/audit";
import {
  bandFor,
  decodeResponses,
  encodeResponses,
  round1,
  score,
  statusFor,
  tagsFor,
  type Answer,
  type Importance,
  type Responses,
} from "./scoring";

/** Build responses from one 30-digit string ("0" = N/A) and a 6-digit importance string. */
function r(answers: string, importance = "222222"): Responses {
  const a = answers.replace(/\s/g, "");
  return decodeResponses(a + importance)!;
}
const area = (res: ReturnType<typeof score>, id: string) =>
  res.areas.find((x) => x.id === id)!;

test("content matches the workbook: 6 areas × 5 questions × 4 answers, every action mapped", () => {
  assert.equal(CATEGORY_IDS.length, 6);
  assert.equal(QUESTIONS.length, 30);
  for (const q of QUESTIONS) {
    assert.equal(q.answers.length, 4, q.id);
    assert.ok(QUESTION_ACTIONS[q.id]?.length, `no action for ${q.id}`);
    for (const k of QUESTION_ACTIONS[q.id]) assert.ok(getAction(k).effort, k);
  }
});

test("rounding and band boundaries follow the workbook", () => {
  assert.equal(round1(2.75), 2.8); // the workbook's own worked example
  assert.equal(round1(11 / 4), 2.8);
  assert.equal(round1(1.95), 2.0);
  assert.equal(bandFor(1.0), "Foundations");
  assert.equal(bandFor(1.9), "Foundations");
  assert.equal(bandFor(2.0), "Taking shape");
  assert.equal(bandFor(2.7), "Taking shape");
  assert.equal(bandFor(2.8), "Established");
  assert.equal(bandFor(3.4), "Established");
  assert.equal(bandFor(3.5), "Distinctive");
  assert.equal(bandFor(4.0), "Distinctive");
});

test("priority grid matches the workbook", () => {
  const H = 3,
    M = 2,
    L = 1;
  assert.equal(statusFor("Foundations", H), "Act now");
  assert.equal(statusFor("Taking shape", M), "Plan next");
  assert.equal(statusFor("Taking shape", L), "Keep in view");
  assert.equal(statusFor("Established", H), "Plan next");
  assert.equal(statusFor("Established", M), "Keep in view");
  assert.equal(statusFor("Established", L), "Maintain");
  for (const i of [L, M, H] as Importance[])
    assert.equal(statusFor("Distinctive", i), "Maintain");
});

test("the workbook's worked example: 3, 2, 2, 4 and one N/A → 2.8", () => {
  const res = score(r("32240 44444 44444 44444 44444 44444"));
  const a = area(res, "01");
  assert.equal(a.score, 2.8);
  assert.equal(a.answered, 4);
  assert.equal(a.notApplicable, 1);
});

test("all 1s → Foundations everywhere; all 4s → Distinctive with no priorities", () => {
  const low = score(r("1".repeat(30), "333333"));
  assert.equal(low.overall, 1.0);
  assert.equal(low.overallBand, "Foundations");
  assert.ok(low.areas.every((a) => a.status === "Act now"));
  assert.equal(low.priorities.length, 3);
  assert.equal(low.strongest?.soFar, true);
  assert.equal(low.missedEnquiries, true);
  assert.equal(low.priorities[0].areaId, "06"); // missed enquiries are urgent
  assert.equal(low.priorities[0].questionId, "6.2");

  const high = score(r("4".repeat(30), "333333"));
  assert.equal(high.overall, 4.0);
  assert.equal(high.allDistinctive, true);
  assert.equal(high.priorities.length, 0);
  assert.equal(high.recommendations["05"][0].actionKey, "05-6"); // "build on it" action
  assert.equal(high.recommendations["01"].length, 0);
});

test("more than two N/A in an area → not scored and excluded from overall", () => {
  const res = score(r("00044 00011 44444 44444 44444 44444"));
  assert.equal(area(res, "01").score, null);
  assert.equal(area(res, "02").score, null);
  assert.equal(res.overall, 4.0); // only the four scored areas count
});

test("N/A handling at the threshold", () => {
  const two = score(r("00444 44444 44444 44444 44444 44444"));
  assert.equal(area(two, "01").score, 4.0); // two N/A still scored
  const three = score(r("00044 22222 22222 22222 22222 22222"));
  assert.equal(area(three, "01").score, null);
  assert.equal(area(three, "01").band, null);
  assert.equal(three.overall, 2.0); // average of the five scored areas only
  assert.ok(!three.priorities.some((p) => p.areaId === "01"));
  const all = score(r("0".repeat(30)));
  assert.equal(all.overall, null);
  assert.equal(all.strongest, null);
  assert.equal(all.priorities.length, 0);
});

test("fewer than three scored areas → no overall score", () => {
  const res = score(r("33333 33333 00000 00000 00000 00000"));
  assert.equal(res.overall, null);
  assert.equal(res.overallBand, null);
  assert.equal(res.strongest?.areaId, "01");
});

test("unanswered and invalid values count as N/A; unrated importance counts as Medium", () => {
  const res = score({
    answers: { "1.1": 4, "1.2": 9 as Answer, "1.3": 3 },
    importance: { "01": 7 as Importance },
  });
  assert.equal(area(res, "01").answered, 2);
  assert.equal(area(res, "01").score, null); // three missing → not scored
  assert.equal(area(res, "01").importance, 2);
  assert.equal(score({} as Responses).overall, null);
});

test("overall is the average of rounded area scores", () => {
  // Areas: 1.0, 2.0, 3.0, 4.0, 2.4 (22233 → 12/5), 3.6 (34444 → 19/5... 3.8)
  const res = score(r("11111 22222 33333 44444 22233 34444"));
  assert.deepEqual(
    res.areas.map((a) => a.score),
    [1.0, 2.0, 3.0, 4.0, 2.4, 3.8]
  );
  assert.equal(res.overall, round1((1 + 2 + 3 + 4 + 2.4 + 3.8) / 6)); // 2.7
  assert.equal(res.overallBand, "Taking shape");
  assert.equal(res.strongest?.areaId, "04");
});

test("priorities: Act now first, then Plan next, lowest score first, ties by importance", () => {
  // 01 = 2.0 Low, 02 = 2.0 High (Act now), 03 = 3.0 High (Plan next), 04 = 1.0 Medium (Plan next)
  const res = score(r("22222 22222 33333 11111 44444 44444", "133222"));
  assert.deepEqual(
    res.priorities.map((p) => [p.areaId, p.status]),
    [
      ["02", "Act now"],
      ["04", "Plan next"],
      ["03", "Plan next"],
    ]
  );
  assert.deepEqual(
    res.priorities.map((p) => p.when),
    ["Week 1", "Weeks 2–3", "Week 4"]
  );
});

test("priorities fall back to areas below 3.5 when the grid gives fewer than three", () => {
  // Everything Low importance → Keep in view / Maintain only.
  const res = score(r("22222 33333 44444 44444 44444 44444", "111111"));
  assert.deepEqual(
    res.priorities.map((p) => p.areaId),
    ["01", "02"]
  );
});

test("ties for strongest area go to the more important area, then workbook order", () => {
  const res = score(r("33333 33333 33333 33333 33333 33333", "123222"));
  assert.equal(res.strongest?.areaId, "03");
  const res2 = score(r("33333 33333 33333 33333 33333 33333"));
  assert.equal(res2.strongest?.areaId, "01");
});

test("each priority uses the visitor's weakest answer and the workbook's level-4 answer", () => {
  const res = score(r("44144 44444 44444 44444 44444 44444", "322222"));
  const p = res.priorities[0];
  assert.equal(p.areaId, "01");
  assert.equal(p.questionId, "1.3");
  const q = QUESTIONS.find((x) => x.id === "1.3")!;
  assert.equal(p.challenge, q.answers[0]);
  assert.equal(p.goodLooksLike, q.answers[3]);
  assert.equal(p.action.actionKey, "01-1");
});

test("at least one quick win among the priorities when the areas allow it", () => {
  // Weakest questions map to Moderate actions: 1.2 (01-2), 3.5 (03-3), 5.1 (05-1).
  // Area 05 (2.4) is now lowest, so first; 5.2 = 2 recommends 05-2, a quick win.
  const res = score(r("31333 44444 33331 44444 12333 44444", "333333"));
  assert.deepEqual(
    res.priorities.map((p) => p.action.actionKey),
    ["05-2", "01-2", "03-3"]
  );
  assert.equal(res.priorities[0].questionId, "5.2");
  // No quick win available anywhere → actions are left as they are.
  const none = score(r("31333 44444 33331 44444 13333 44444", "333333"));
  assert.deepEqual(
    none.priorities.map((p) => p.action.actionKey),
    ["01-2", "03-3", "05-1"]
  );
});

test("recommendations come only from answers of 1 or 2, weakest first, no duplicates", () => {
  const res = score(r("21344 44444 44444 44444 44444 44444"));
  // 1.2 (=1) → 01-2, then 1.1 (=2) → 01-1; 1.3 (=3) contributes nothing.
  assert.deepEqual(
    res.recommendations["01"].map((x) => x.actionKey),
    ["01-2", "01-1"]
  );
  const dup = score(r("11144 44444 44444 44444 44444 44444"));
  assert.deepEqual(
    dup.recommendations["01"].map((x) => x.actionKey),
    ["01-1", "01-2"]
  );
});

test("tags are applied only when the answers support them", () => {
  const strong = r("4".repeat(30), "333333");
  assert.deepEqual(tagsFor(score(strong), strong.answers), ["Brand Audit"]);
  const weak = r("1".repeat(30), "333333");
  assert.deepEqual(tagsFor(score(weak), weak.answers), [
    "Brand Audit",
    "Brand Opportunity",
    "Website Opportunity",
    "Marketing Opportunity",
    "CRM & Automation Opportunity",
    "Analytics Opportunity",
  ]);
  const analyticsOnly = r("44444 44444 44444 24444 44444 44444", "111111");
  assert.deepEqual(tagsFor(score(analyticsOnly), analyticsOnly.answers), [
    "Brand Audit",
    "Analytics Opportunity",
  ]);
});

test("encoding round-trips and rejects malformed input", () => {
  const x = r("12340 43210 11111 22222 33333 44444", "123321");
  assert.equal(encodeResponses(x), "123404321011111222223333344444123321");
  assert.deepEqual(decodeResponses(encodeResponses(x)), x);
  assert.equal(decodeResponses("123"), null);
  assert.equal(decodeResponses("5".repeat(36)), null);
  assert.equal(decodeResponses("1".repeat(30) + "000000"), null);
});

test("scoring is deterministic", () => {
  const x = r("12340 43210 11111 22222 33333 44444", "123321");
  assert.deepEqual(score(x), score(x));
});
