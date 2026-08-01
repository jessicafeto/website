/**
 * Case studies — one immersive, image-led project page per portfolio piece
 * (/work/[slug]). Editorial "design-book" layout: full-screen hero, concise
 * overview, a minimal snapshot, then a rhythm of mixed image blocks.
 *
 * The actual copy lives in content/caseStudies.en.json and caseStudies.sq.json
 * — plain JSON, editable directly (by hand, or via the /admin content editor).
 * This file only carries the types and the lookup helpers. Image blocks carry
 * their real pixel width/height so every image renders at natural aspect and is
 * never cropped. To add frames to a project, drop files in /public/img and add
 * blocks in the JSON — nothing here needs to change.
 *
 * intellimation.ai is a REAL engagement (factual copy). The others are concept /
 * spec brand pieces.
 */
import casesEnData from "./caseStudies.en.json";
import casesSqData from "./caseStudies.sq.json";

export type Img = { src: string; w: number; h: number };

export type Block =
  | { kind: "full"; src: string; w: number; h: number }
  | { kind: "portrait"; src: string; w: number; h: number }
  | { kind: "duo"; items: [Img, Img] }
  | { kind: "caption"; label: string; note: string };

export type Snapshot = {
  industry: string;
  services: string[];
  timeline: string;
  deliverables: string[];
};

export type CaseStudy = {
  slug: string;
  name: string;
  category: string;
  heroImage: string;
  overviewHeading: string;
  overview: string;
  snapshot: Snapshot;
  blocks: Block[];
  finalImage?: Img;
};

export const CASE_ORDER: string[] = [
  "intellimation",
  "seereen",
  "opa-taverne",
  "ame",
  "355",
  "her-club",
];

const CASES_EN = casesEnData as unknown as Record<string, CaseStudy>;
const CASES_SQ = casesSqData as unknown as Record<string, CaseStudy>;

const BY_LOCALE: Record<string, Record<string, CaseStudy>> = {
  en: CASES_EN,
  sq: CASES_SQ,
};

export function getCaseStudy(locale: string, slug: string): CaseStudy | undefined {
  return (BY_LOCALE[locale] ?? CASES_EN)[slug];
}

export function getCaseStudies(locale: string): CaseStudy[] {
  const set = BY_LOCALE[locale] ?? CASES_EN;
  return CASE_ORDER.map((s) => set[s]);
}

/** The next project in CASE_ORDER, wrapping around to the first. */
export function getNextCaseStudy(locale: string, slug: string): CaseStudy {
  const set = BY_LOCALE[locale] ?? CASES_EN;
  const i = CASE_ORDER.indexOf(slug);
  const next = CASE_ORDER[(i + 1) % CASE_ORDER.length];
  return set[next];
}
