import "server-only";
import { AUDIT, BOOKING_URL, SHORT_TITLES } from "@/content/audit";
import type { Result } from "./scoring";

/**
 * Resend — sends the visitor's results email and a lead notification to noova.
 * Both are transactional: they go to everyone who asks for their results,
 * regardless of marketing consent, and contain no promotional content.
 *
 * Each send carries an Idempotency-Key derived from the submission id, so a
 * repeated submission (double click, retry, flaky connection) can't send twice.
 *
 * Env: RESEND_API_KEY, AUDIT_EMAIL_FROM (e.g. "Jessica at noova <jessica@noovadata.com>"),
 *      AUDIT_NOTIFY_TO (where lead notifications go)
 */
const API = "https://api.resend.com/emails";

export function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.AUDIT_EMAIL_FROM);
}

async function send(
  idempotencyKey: string,
  msg: {
    to: string;
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
  }
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "content-type": "application/json",
        "idempotency-key": idempotencyKey,
      },
      body: JSON.stringify({
        from: process.env.AUDIT_EMAIL_FROM,
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };
    if (res.ok && data.id) return { ok: true, id: data.id };
    return {
      ok: false,
      error: `Resend ${res.status}: ${data.message ?? ""}`.slice(0, 300),
    };
  } catch (e) {
    return {
      ok: false,
      error: `Resend request failed: ${(e as Error).message}`,
    };
  }
}

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const C = {
  paper: "#faf8f3",
  stone: "#e6ddce",
  ink: "#1a1917",
  grey: "#6e6a63",
  rule: "#e0d9cc",
  oxblood: "#7a2e2e",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "Lato, Helvetica, Arial, sans-serif",
};

function button(href: string, label: string, solid = true) {
  return `<a href="${esc(
    href
  )}" style="display:inline-block;margin:6px 8px 6px 0;padding:14px 24px;font-family:${
    C.sans
  };font-size:12px;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;${
    solid
      ? `background:${C.oxblood};color:#ffffff;`
      : `border:1px solid ${C.ink};color:${C.ink};`
  }">${esc(label)}</a>`;
}

function shell(inner: string, footer: string) {
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${C.paper};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${C.rule};">
<tr><td style="padding:36px 36px 8px;font-family:${C.sans};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${C.grey};">noova · Brand &amp; Growth Audit</td></tr>
<tr><td style="padding:8px 36px 36px;font-family:${C.sans};font-size:15px;line-height:1.65;color:${C.ink};">${inner}</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;"><tr><td style="padding:20px 36px;font-family:${C.sans};font-size:12px;line-height:1.6;color:${C.grey};">${footer}</td></tr></table>
</td></tr></table></body></html>`;
}

export type ReportEmail = {
  to: string;
  firstName?: string;
  result: Result;
  resultsUrl: string;
  reportUrl: string;
  workbookUrl: string;
  privacyUrl: string;
  marketingConsent: boolean;
};

export function renderReportEmail(e: ReportEmail) {
  const { result } = e;
  const band = AUDIT.bands.find((b) => b.name === result.overallBand);
  const strongest = result.strongest
    ? SHORT_TITLES[result.strongest.areaId]
    : null;
  const first = result.priorities[0];
  const hello = e.firstName ? `Hello ${e.firstName},` : "Hello,";

  const summary =
    result.overall === null
      ? `<p style="margin:0 0 16px;">Too many questions were marked as not applicable to give an overall score, but your area-by-area results are ready.</p>`
      : `<p style="margin:24px 0 4px;font-family:${
          C.serif
        };font-size:44px;line-height:1;color:${
          C.ink
        };">${result.overall.toFixed(1)}<span style="font-size:20px;color:${
          C.grey
        };"> / 4.0</span></p>
<p style="margin:0 0 16px;font-family:${
          C.sans
        };font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${
          C.oxblood
        };">${esc(result.overallBand ?? "")}</p>
<p style="margin:0 0 20px;color:${C.grey};">${esc(band?.meaning ?? "")}</p>`;

  const lines = [
    strongest
      ? `<strong>Your strongest area${
          result.strongest?.soFar ? " so far" : ""
        }:</strong> ${esc(strongest)}`
      : "",
    first
      ? `<strong>Your first priority:</strong> ${esc(
          SHORT_TITLES[first.areaId]
        )} — ${esc(first.action.title.toLowerCase())}`
      : "",
  ].filter(Boolean);

  const consentLine = e.marketingConsent
    ? "You also asked to receive occasional insights and updates from noova. Every one of those emails includes an unsubscribe link."
    : "We won’t send you marketing emails unless you ask us to.";

  const html = shell(
    `<p style="margin:0 0 16px;">${esc(hello)}</p>
<p style="margin:0 0 8px;">Thank you for completing the Small Business Brand &amp; Growth Audit. Here’s a summary of your results.</p>
${summary}
${
  lines.length
    ? `<p style="margin:0 0 24px;border-top:1px solid ${
        C.rule
      };padding-top:16px;">${lines.join("<br>")}</p>`
    : ""
}
<p style="margin:0 0 8px;">Your full results include all six area scores, recommendations based on your answers, three priorities and a 30-day plan.</p>
<p style="margin:16px 0 8px;">${button(
      e.resultsUrl,
      "View your full results"
    )}</p>
<p style="margin:0 0 24px;">${button(
      e.reportUrl,
      "Your personalised report (PDF)",
      false
    )}${button(e.workbookUrl, "The 28-page workbook (PDF)", false)}</p>
<p style="margin:0 0 8px;font-family:${
      C.serif
    };font-style:italic;font-size:20px;">Would a second opinion help?</p>
<p style="margin:0 0 16px;">If you’d like to talk through your results, book a free 30-minute discovery call. Bring your scores and your three priorities, and we’ll help you think through what to tackle first, whether or not you decide to work with us.</p>
<p style="margin:0 0 24px;"><a href="${BOOKING_URL}" style="color:${
      C.oxblood
    };">Book a free discovery call</a></p>
<p style="margin:0;">Jessica Feto<br><span style="color:${
      C.grey
    };">Founder, noova · London | Tirana</span></p>`,
    `Your results link is private: it shows your scores but not your name or email address, so share it only with people you choose. It works for 12 months.<br><br>
You’re receiving this email because you asked for your audit results at noovadata.com. ${consentLine} <a href="${esc(
      e.privacyUrl
    )}" style="color:${C.grey};">Privacy policy</a>.<br><br>
${esc(AUDIT.disclaimer)}`
  );

  const text = [
    hello,
    "",
    "Thank you for completing the Small Business Brand & Growth Audit.",
    result.overall === null
      ? ""
      : `Your overall score: ${result.overall.toFixed(1)} / 4.0 (${
          result.overallBand
        }). ${band?.meaning ?? ""}`,
    strongest
      ? `Your strongest area${
          result.strongest?.soFar ? " so far" : ""
        }: ${strongest}`
      : "",
    first
      ? `Your first priority: ${SHORT_TITLES[first.areaId]} — ${
          first.action.title
        }`
      : "",
    "",
    `View your full results: ${e.resultsUrl}`,
    `Your personalised report (PDF): ${e.reportUrl}`,
    `The 28-page workbook (PDF): ${e.workbookUrl}`,
    "",
    `Would a second opinion help? Book a free 30-minute discovery call: ${BOOKING_URL}`,
    "",
    "Jessica Feto, noova",
    "",
    `Your results link is private and works for 12 months. ${consentLine} Privacy policy: ${e.privacyUrl}`,
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");

  return { subject: "Your Brand & Growth Audit results", html, text };
}

export function sendReportEmail(submissionId: string, e: ReportEmail) {
  const msg = renderReportEmail(e);
  return send(`audit-report-${submissionId}`, {
    to: e.to,
    ...msg,
    replyTo: process.env.AUDIT_REPLY_TO || undefined,
  });
}

export type LeadNotification = {
  lead: Record<string, string>;
  result: Result;
  tags: string[];
  resultsUrl: string;
  test: boolean;
};

/** Internal heads-up to noova, so a promising lead can be followed up personally. */
export function sendLeadNotification(
  submissionId: string,
  n: LeadNotification
) {
  const to = process.env.AUDIT_NOTIFY_TO;
  if (!to)
    return Promise.resolve({
      ok: false as const,
      error: "AUDIT_NOTIFY_TO not set",
    });
  const who = n.lead["Business"] || n.lead["Email"];
  const score =
    n.result.overall === null
      ? "no overall score"
      : `${n.result.overall.toFixed(1)} ${n.result.overallBand}`;
  const rows = [
    ...Object.entries(n.lead),
    ...n.result.areas.map((a) => [
      SHORT_TITLES[a.id],
      a.score === null
        ? "Not scored"
        : `${a.score.toFixed(1)} · ${a.band} · ${a.status}`,
    ]),
    [
      "Priorities",
      n.result.priorities.map((p) => SHORT_TITLES[p.areaId]).join(", ") ||
        "None",
    ],
    ["Tags", n.tags.join(", ")],
  ];
  const html = shell(
    `<p style="margin:0 0 16px;font-family:${
      C.serif
    };font-size:22px;">New audit submission${n.test ? " (TEST)" : ""}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;">${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:${
            C.grey
          };vertical-align:top;white-space:nowrap;">${esc(
            k
          )}</td><td style="padding:6px 0;border-bottom:1px solid ${
            C.rule
          };">${esc(v || "—")}</td></tr>`
      )
      .join("")}</table>
<p style="margin:24px 0 0;">${button(n.resultsUrl, "Open their results")}</p>`,
    "The contact has been saved in Brevo. Follow up only within what they asked for: marketing emails need their consent."
  );
  const text =
    rows.map(([k, v]) => `${k}: ${v || "—"}`).join("\n") +
    `\n\nResults: ${n.resultsUrl}`;
  return send(`audit-notify-${submissionId}`, {
    to,
    subject: `${n.test ? "[TEST] " : ""}Audit lead: ${who} — ${score}`,
    html,
    text,
  });
}
