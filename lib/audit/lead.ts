import "server-only";
import {
  BUSINESS_TYPES,
  CHALLENGES,
  MARKETING_CONSENT_TEXT,
} from "@/content/audit";
import type { BrevoAttributes } from "./brevo";

/**
 * Shared lead handling for the audit's two server routes:
 * /api/audit/start (details given before the questions) and
 * /api/audit/submit (answers in, results out).
 */
export const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;
const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

// Best-effort burst protection (per serverless instance, not a hard limit).
const recent = new Map<string, number[]>();
export function tooMany(req: Request, limit = 8) {
  const ip =
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > limit;
}

export function str(v: unknown, max: number): string {
  return typeof v === "string"
    ? v
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .trim()
        .slice(0, max)
    : "";
}

function normaliseWebsite(v: string): string | null {
  if (!v) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    if (!u.hostname.includes(".")) return null;
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function leadSource(utmSource: string) {
  const s = utmSource.toLowerCase();
  if (s === "instagram" || s === "ig")
    return "Instagram – Brand & Growth Audit";
  if (s) return `${utmSource} – Brand & Growth Audit`;
  return "Website – Brand & Growth Audit";
}

export type Contact = {
  email: string;
  firstName: string;
  businessName: string;
  website: string;
  businessType: string;
  challenge: string;
  marketingConsent: boolean;
  test: boolean;
  honeypot: boolean;
  utm: Record<(typeof UTM_KEYS)[number], string>;
};

/** Validate the contact part of a request body. */
export function readContact(
  body: Record<string, unknown>
):
  | { ok: true; contact: Contact }
  | { ok: false; error: string; field: string } {
  const email = str(body.email, 254).toLowerCase();
  if (!EMAIL.test(email))
    return {
      ok: false,
      error: "Please enter a valid email address.",
      field: "email",
    };
  const website = normaliseWebsite(str(body.website, 200));
  if (website === null)
    return {
      ok: false,
      error: "Please enter a valid website address, or leave it blank.",
      field: "website",
    };
  const pick = (v: unknown, list: readonly string[]) =>
    list.includes(str(v, 80)) ? str(v, 80) : "";
  const utmIn = (body.utm ?? {}) as Record<string, unknown>;
  return {
    ok: true,
    contact: {
      email,
      firstName: str(body.firstName, 60),
      businessName: str(body.businessName, 120),
      website,
      businessType: pick(body.businessType, BUSINESS_TYPES),
      challenge: pick(body.challenge, CHALLENGES),
      marketingConsent: body.marketingConsent === true,
      test: body.test === true,
      honeypot: Boolean(str(body.company_url, 200)),
      utm: Object.fromEntries(
        UTM_KEYS.map((k) => [k, str(utmIn[k], 100)])
      ) as Contact["utm"],
    },
  };
}

/** The contact, source and consent attributes shared by both routes. */
export function contactAttributes(
  c: Contact,
  origin: string,
  now: Date
): BrevoAttributes {
  const a: BrevoAttributes = {
    FIRSTNAME: c.firstName,
    BUSINESS_NAME: c.businessName,
    WEBSITE: c.website,
    INDUSTRY: c.businessType,
    PRIMARY_CHALLENGE: c.challenge,
    LEAD_SOURCE: leadSource(c.utm.source),
    CAMPAIGN_ID: c.utm.campaign || "brand_growth_audit",
    UTM_SOURCE: c.utm.source,
    UTM_MEDIUM: c.utm.medium,
    UTM_CAMPAIGN: c.utm.campaign,
    UTM_CONTENT: c.utm.content,
    AUDIT_DATE: now.toISOString().slice(0, 10),
    TEST_SUBMISSION: c.test,
  };
  // Only ever record consent when it's given. An unticked box on a later visit
  // must not overwrite consent given earlier (withdrawal happens by unsubscribing).
  if (c.marketingConsent) {
    a.MARKETING_CONSENT = true;
    a.MARKETING_CONSENT_AT = now.toISOString();
    a.MARKETING_CONSENT_SOURCE = `Brand & Growth Audit form (${origin}/brand-growth-audit): "${MARKETING_CONSENT_TEXT}"`;
  }
  return a;
}

/** Brevo rejects empty strings for typed attributes; leave blanks out. */
export function dropBlanks(a: BrevoAttributes) {
  for (const [k, v] of Object.entries(a)) if (v === "") delete a[k];
  return a;
}
