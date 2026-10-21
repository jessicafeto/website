/**
 * The Small Business Brand & Growth Audit — content and rules.
 *
 * The questions, answers, band wording and actions live in audit.en.json, which
 * is exported from the workbook source (noova-audit/content/audit.en.md, via
 * noova-audit/export_web.py) so the PDF and the online assessment never drift
 * apart. Don't edit the JSON by hand: edit the markdown and re-export.
 *
 * This file only adds what the workbook leaves to the reader: which action
 * answers which question, a rough effort estimate per action, and the lists
 * used by the lead form.
 */
import auditEn from "./audit.en.json";

export type Band = { min: number; max: number; name: BandName; meaning: string };
export type BandName = "Foundations" | "Taking shape" | "Established" | "Distinctive";

export type Question = {
  id: string; // "1.1"
  title: string;
  prompt: string;
  answers: string[]; // four described answers, levels 1–4
};

export type Action = { title: string; body: string; note: string | null };

export type Category = {
  id: string; // "01"
  title: string;
  assessing: string;
  why: string;
  questions: Question[];
  meanings: Record<BandName, string>;
  actions: Action[];
  specialist: string[];
  priority: string;
  tools: string[];
};

export type AuditContent = {
  lang: string;
  source: string;
  bands: Band[];
  disclaimer: string;
  milestones: { day: string; text: string }[];
  milestoneTip: string;
  categories: Category[];
};

export const AUDIT = auditEn as AuditContent;

/** Every question in workbook order — the order answers are encoded in. */
export const QUESTIONS = AUDIT.categories.flatMap((c) => c.questions);
export const CATEGORY_IDS = AUDIT.categories.map((c) => c.id);

/** Shorter area names for charts, tags and tight layouts. */
export const SHORT_TITLES: Record<string, string> = {
  "01": "Brand",
  "02": "Website & online presence",
  "03": "Content & social media",
  "04": "Attracting new customers",
  "05": "Keeping customers coming back",
  "06": "Systems & AI",
};

/**
 * The action(s) that address each question, as "<area>-<action number>" from
 * that area's "Actions you can take yourself" list. The first is the main one.
 * 2.5 (reviews) is answered by the review action in area 04.
 */
export const QUESTION_ACTIONS: Record<string, string[]> = {
  "1.1": ["01-1"], "1.2": ["01-2"], "1.3": ["01-1"], "1.4": ["01-3", "01-4"], "1.5": ["01-5"],
  "2.1": ["02-1"], "2.2": ["02-2"], "2.3": ["02-3", "02-5"], "2.4": ["02-4", "02-6"], "2.5": ["04-2"],
  "3.1": ["03-6"], "3.2": ["03-1"], "3.3": ["03-2"], "3.4": ["03-4"], "3.5": ["03-3", "03-5"],
  "4.1": ["04-1"], "4.2": ["04-2"], "4.3": ["04-3"], "4.4": ["04-4", "04-6"], "4.5": ["04-5"],
  "5.1": ["05-1"], "5.2": ["05-2"], "5.3": ["05-3"], "5.4": ["05-4"], "5.5": ["05-5"],
  "6.1": ["06-1"], "6.2": ["06-4", "06-3"], "6.3": ["06-2"], "6.4": ["06-5"], "6.5": ["06-6"],
};

/** Shown to Distinctive areas instead of a fix (the workbook's "build on it" actions). */
export const DISTINCTIVE_ACTIONS: Record<string, string> = { "05": "05-6" };

export type Effort = "Quick win" | "Moderate" | "Project";

/**
 * noova's rough effort estimate for each action, using the workbook's
 * definitions: quick win = an afternoon or less; moderate = a few sessions over
 * several weeks; project = significant time, budget or specialist help.
 */
export const EFFORT: Record<string, Effort> = {
  "01-1": "Quick win", "01-2": "Moderate", "01-3": "Quick win", "01-4": "Moderate", "01-5": "Moderate",
  "02-1": "Quick win", "02-2": "Quick win", "02-3": "Moderate", "02-4": "Quick win", "02-5": "Moderate", "02-6": "Quick win",
  "03-1": "Quick win", "03-2": "Quick win", "03-3": "Moderate", "03-4": "Quick win", "03-5": "Moderate", "03-6": "Quick win",
  "04-1": "Quick win", "04-2": "Quick win", "04-3": "Moderate", "04-4": "Quick win", "04-5": "Moderate", "04-6": "Project",
  "05-1": "Moderate", "05-2": "Quick win", "05-3": "Moderate", "05-4": "Quick win", "05-5": "Moderate", "05-6": "Project",
  "06-1": "Moderate", "06-2": "Quick win", "06-3": "Moderate", "06-4": "Moderate", "06-5": "Moderate", "06-6": "Quick win",
};

/** The noova service page most relevant to each area. */
export const AREA_SERVICE: Record<string, { label: string; href: string }> = {
  "01": { label: "Branding", href: "/branding" },
  "02": { label: "Websites", href: "/websites" },
  "03": { label: "Marketing", href: "/marketing" },
  "04": { label: "Marketing", href: "/marketing" },
  "05": { label: "Automation", href: "/automation" },
  "06": { label: "Automation", href: "/automation" },
};

export function getAction(key: string): Action & { key: string; areaId: string; effort: Effort } {
  const [areaId, n] = key.split("-");
  const cat = AUDIT.categories.find((c) => c.id === areaId);
  const action = cat?.actions[Number(n) - 1];
  if (!action) throw new Error(`Unknown audit action ${key}`);
  return { ...action, key, areaId, effort: EFFORT[key] };
}

/* ---------- lead form options ---------- */

export const BUSINESS_TYPES = [
  "Aesthetics or skin clinic",
  "Hair or beauty salon",
  "Wellness, fitness or yoga studio",
  "Café or restaurant",
  "Florist",
  "Boutique or retail",
  "Other",
] as const;

export const CHALLENGES = [
  "Standing out from competitors",
  "Getting more enquiries or bookings",
  "Keeping up with content and social media",
  "Getting clients to come back",
  "Too much admin and manual work",
  "Knowing what's working",
  "Other",
] as const;

export const BOOKING_URL = "https://cal.com/jessicafeto/30min";
export const WORKBOOK_URL = "/downloads/noova-brand-growth-audit-2026.pdf";
export const MARKETING_CONSENT_TEXT =
  "Yes, I’d like to receive occasional marketing insights, resources and updates from noova by email. I can unsubscribe at any time.";
