import { NextResponse } from "next/server";
import {
  AREA_SERVICE,
  BUSINESS_TYPES,
  CHALLENGES,
  MARKETING_CONSENT_TEXT,
  SHORT_TITLES,
  WORKBOOK_URL,
} from "@/content/audit";
import { decodeResponses, score, tagsFor } from "@/lib/audit/scoring";
import { createToken } from "@/lib/audit/token";
import { sendToFormspree } from "@/lib/audit/formspree";
import {
  brevoConfigured,
  upsertContact,
  type BrevoAttributes,
} from "@/lib/audit/brevo";
import {
  resendConfigured,
  sendLeadNotification,
  sendReportEmail,
} from "@/lib/audit/email";

/**
 * POST /api/audit/submit — the Brand & Growth Audit lead form.
 *
 * 1. Validates the submission and recalculates the scores from the raw answers
 *    (the browser's numbers are never trusted).
 * 2. Creates or updates the contact in Brevo, by email (or, until Brevo is
 *    connected, emails the lead to noova through Formspree).
 * 3. Emails the visitor their results and sends noova a lead notification.
 * 4. Returns a signed results token (when AUDIT_TOKEN_SECRET is set); the full
 *    results unlock on the page either way.
 *
 * Saving the lead is required; if it fails, nothing unlocks and the visitor can
 * retry. If only the email fails, results still unlock and the page says so.
 * Personal details are never logged.
 */
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;
const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

// Best-effort burst protection (per serverless instance, not a hard limit).
const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 8;
}

function str(v: unknown, max: number): string {
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

function leadSource(utmSource: string) {
  const s = utmSource.toLowerCase();
  if (s === "instagram" || s === "ig")
    return "Instagram – Brand & Growth Audit";
  if (s) return `${utmSource} – Brand & Growth Audit`;
  return "Website – Brand & Growth Audit";
}

const fail = (status: number, error: string, field?: string) =>
  NextResponse.json({ ok: false, error, field }, { status });

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > 10_000)
    return fail(413, "Submission too large.");
  const ip =
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    "unknown";
  if (tooMany(ip))
    return fail(
      429,
      "Too many attempts. Please wait a few minutes and try again."
    );

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Invalid submission.");
  }

  const submissionId = str(body.submissionId, 36);
  if (!UUID.test(submissionId)) return fail(400, "Invalid submission.");
  const encoded = str(body.responses, 40);
  const responses = decodeResponses(encoded);
  if (!responses)
    return fail(
      400,
      "Your answers couldn’t be read. Please restart the audit."
    );

  const email = str(body.email, 254).toLowerCase();
  if (!EMAIL.test(email))
    return fail(422, "Please enter a valid email address.", "email");
  const website = normaliseWebsite(str(body.website, 200));
  if (website === null)
    return fail(
      422,
      "Please enter a valid website address, or leave it blank.",
      "website"
    );

  const firstName = str(body.firstName, 60);
  const businessName = str(body.businessName, 120);
  const businessType = (BUSINESS_TYPES as readonly string[]).includes(
    str(body.businessType, 80)
  )
    ? str(body.businessType, 80)
    : "";
  const challenge = (CHALLENGES as readonly string[]).includes(
    str(body.challenge, 80)
  )
    ? str(body.challenge, 80)
    : "";
  const marketingConsent = body.marketingConsent === true;
  const test = body.test === true;
  const utmIn = (body.utm ?? {}) as Record<string, unknown>;
  const utm = Object.fromEntries(
    UTM_KEYS.map((k) => [k, str(utmIn[k], 100)])
  ) as Record<(typeof UTM_KEYS)[number], string>;

  const origin = process.env.AUDIT_BASE_URL || new URL(req.url).origin;
  const now = new Date();
  const token = createToken(encoded, submissionId, now);
  const resultsUrl = token
    ? `${origin}/brand-growth-audit/results?r=${encodeURIComponent(token)}`
    : "";
  const reportUrl = token
    ? `${origin}/api/audit/report?r=${encodeURIComponent(token)}`
    : `${origin}/api/audit/report?a=${encoded}`;

  // Honeypot: bots fill the hidden field. Pretend it worked; store and send nothing.
  if (str(body.company_url, 200)) {
    return NextResponse.json({
      ok: true,
      token,
      saved: false,
      emailSent: false,
      emailConfigured: false,
    });
  }

  const result = score(responses);
  const tags = tagsFor(result, responses.answers);
  const areaScore = (id: string) =>
    result.areas.find((a) => a.id === id)?.score ?? "";

  const attributes: BrevoAttributes = {
    FIRSTNAME: firstName,
    BUSINESS_NAME: businessName,
    WEBSITE: website,
    INDUSTRY: businessType,
    PRIMARY_CHALLENGE: challenge,
    AUDIT_SCORE: result.overall ?? "",
    AUDIT_BAND: result.overallBand ?? "",
    AUDIT_BRAND: areaScore("01"),
    AUDIT_WEBSITE: areaScore("02"),
    AUDIT_CONTENT: areaScore("03"),
    AUDIT_ACQUISITION: areaScore("04"),
    AUDIT_RETENTION: areaScore("05"),
    AUDIT_SYSTEMS: areaScore("06"),
    AUDIT_STRONGEST: result.strongest
      ? SHORT_TITLES[result.strongest.areaId]
      : "",
    AUDIT_PRIORITIES: result.priorities
      .map((p) => SHORT_TITLES[p.areaId])
      .join(", "),
    AUDIT_ANSWERS: encoded,
    AUDIT_DATE: now.toISOString().slice(0, 10),
    AUDIT_REPORT_ID: submissionId,
    AUDIT_RESULTS_URL: resultsUrl,
    AUDIT_TAGS: tags.join(", "),
    OPP_BRAND: tags.includes("Brand Opportunity"),
    OPP_WEBSITE: tags.includes("Website Opportunity"),
    OPP_MARKETING: tags.includes("Marketing Opportunity"),
    OPP_CRM_AUTOMATION: tags.includes("CRM & Automation Opportunity"),
    OPP_ANALYTICS: tags.includes("Analytics Opportunity"),
    LEAD_SOURCE: leadSource(utm.source),
    CAMPAIGN_ID: utm.campaign || "brand_growth_audit",
    UTM_SOURCE: utm.source,
    UTM_MEDIUM: utm.medium,
    UTM_CAMPAIGN: utm.campaign,
    UTM_CONTENT: utm.content,
    TEST_SUBMISSION: test,
  };
  // Only ever record consent when it's given. An unticked box on a later visit
  // must not overwrite consent given earlier (withdrawal happens by unsubscribing).
  if (marketingConsent) {
    attributes.MARKETING_CONSENT = true;
    attributes.MARKETING_CONSENT_AT = now.toISOString();
    attributes.MARKETING_CONSENT_SOURCE = `Brand & Growth Audit form (${origin}/brand-growth-audit): "${MARKETING_CONSENT_TEXT}"`;
  }
  // Brevo rejects empty strings for typed attributes; leave blanks out.
  for (const [k, v] of Object.entries(attributes))
    if (v === "") delete attributes[k];

  const devMock = process.env.NODE_ENV !== "production";

  // 1. Save the lead (required).
  let saved = false;
  if (brevoConfigured()) {
    const r = await upsertContact(email, attributes, marketingConsent);
    saved = r.ok;
    if (!r.ok)
      console.error(`[audit] ${submissionId} Brevo save failed: ${r.error}`);
  } else if (devMock && !process.env.AUDIT_DEV_FORMSPREE) {
    console.info(
      `[audit] ${submissionId} (dev) Brevo not configured — would save`,
      { attributes: Object.keys(attributes).length, tags, marketingConsent }
    );
    saved = true;
  } else {
    // Brevo not connected yet: email the full lead record to noova instead.
    const fields: Record<string, string> = {
      _subject: `${test ? "[TEST] " : ""}Audit lead: ${
        businessName || email
      } — ${
        result.overall === null
          ? "no overall score"
          : `${result.overall.toFixed(1)} ${result.overallBand}`
      }`,
      email,
      ...Object.fromEntries(
        Object.entries(attributes).map(([k, v]) => [k, String(v)])
      ),
      MARKETING_CONSENT: marketingConsent ? "true" : "false",
      AUDIT_PDF_URL: reportUrl,
    };
    const r = await sendToFormspree(fields);
    saved = r.ok;
    if (!r.ok)
      console.error(
        `[audit] ${submissionId} Formspree fallback failed: ${r.error}`
      );
  }
  if (!saved) {
    return fail(
      502,
      "Sorry, we couldn’t save your details just now. Please try again in a moment."
    );
  }

  // 2. Emails (best effort; the results unlock either way).
  let emailSent = false;
  if (resendConfigured() && token) {
    const sent = await sendReportEmail(submissionId, {
      to: email,
      firstName,
      result,
      resultsUrl,
      reportUrl,
      workbookUrl: `${origin}${WORKBOOK_URL}`,
      privacyUrl: `${origin}/privacy`,
      marketingConsent,
    });
    emailSent = sent.ok;
    if (!sent.ok)
      console.error(
        `[audit] ${submissionId} report email failed: ${sent.error}`
      );

    const lead: Record<string, string> = {
      Email: email,
      "First name": firstName,
      Business: businessName,
      Website: website,
      Type: businessType,
      Challenge: challenge,
      Overall:
        result.overall === null
          ? "Not scored"
          : `${result.overall.toFixed(1)} · ${result.overallBand}`,
      "Marketing consent": marketingConsent
        ? `Yes (${now.toISOString()})`
        : "No",
      Source: `${leadSource(utm.source)}${
        utm.campaign ? ` · ${utm.campaign}` : ""
      }`,
      "Report email": emailSent ? "Sent" : "Failed",
      "Suggested service": result.priorities[0]
        ? AREA_SERVICE[result.priorities[0].areaId].label
        : "—",
    };
    const n = await sendLeadNotification(submissionId, {
      lead,
      result,
      tags,
      resultsUrl,
      test,
    });
    if (!n.ok)
      console.error(`[audit] ${submissionId} notification failed: ${n.error}`);
  } else if (devMock) {
    console.info(
      `[audit] ${submissionId} (dev) Resend not configured — no email sent. Results: ${
        resultsUrl || "(no token)"
      }`
    );
  } else {
    console.warn(
      `[audit] ${submissionId} report email not sent (Resend${
        token ? "" : " or AUDIT_TOKEN_SECRET"
      } not configured)`
    );
  }

  console.info(
    `[audit] ${submissionId} saved${test ? " (test)" : ""}; email ${
      emailSent ? "sent" : "not sent"
    }`
  );
  return NextResponse.json({
    ok: true,
    token,
    saved,
    emailSent,
    emailConfigured: resendConfigured() && Boolean(token),
  });
}
