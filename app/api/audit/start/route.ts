import { NextResponse } from "next/server";
import { brevoConfigured, upsertContact } from "@/lib/audit/brevo";
import {
  UUID,
  contactAttributes,
  dropBlanks,
  readContact,
  str,
  tooMany,
} from "@/lib/audit/lead";

/**
 * POST /api/audit/start — the visitor's name and email, given before the
 * questions. Saves them in Brevo straight away (tagged "Audit started"), so a
 * lead isn't lost if they stop part-way. No emails are sent here; the results
 * email goes out from /api/audit/submit when they finish.
 *
 * Never blocks the audit: if saving fails, the details are sent again with the
 * answers at the end.
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > 5_000)
    return NextResponse.json({ ok: false }, { status: 413 });
  if (tooMany(req, 12))
    return NextResponse.json({ ok: false }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const submissionId = str(body.submissionId, 36);
  if (!UUID.test(submissionId))
    return NextResponse.json({ ok: false }, { status: 400 });
  const read = readContact(body);
  if (!read.ok)
    return NextResponse.json(
      { ok: false, error: read.error, field: read.field },
      { status: 422 }
    );
  const c = read.contact;
  if (c.honeypot) return NextResponse.json({ ok: true, saved: false });

  if (!brevoConfigured()) {
    console.info(`[audit] ${submissionId} started (Brevo not configured)`);
    return NextResponse.json({ ok: true, saved: false });
  }
  const origin = process.env.AUDIT_BASE_URL || new URL(req.url).origin;
  const attributes = dropBlanks({
    ...contactAttributes(c, origin, new Date()),
    AUDIT_REPORT_ID: submissionId,
    AUDIT_TAGS: "Brand Audit, Audit started",
  });
  const r = await upsertContact(c.email, attributes, c.marketingConsent);
  if (!r.ok)
    console.error(`[audit] ${submissionId} start save failed: ${r.error}`);
  else
    console.info(`[audit] ${submissionId} started${c.test ? " (test)" : ""}`);
  return NextResponse.json({ ok: true, saved: r.ok });
}
