# Brand & Growth Audit (`/brand-growth-audit`)

The interactive version of the 28-page workbook. Landing page → 30 questions plus
an importance rating per area → instant score preview → details form → full
results, personalised PDF and the workbook download.

## Where things live

| What | Where |
|---|---|
| Questions, answers, band wording, actions | `content/audit/audit.en.json`, **exported** from the workbook source `noova-audit/content/audit.en.md` with `python3 noova-audit/export_web.py en website`. Don't edit the JSON by hand. |
| Question→action mapping, effort estimates, form options | `content/audit/index.ts` |
| Scoring engine (pure, shared by browser and server) | `lib/audit/scoring.ts`, tests in `lib/audit/scoring.test.ts` (`npm run test:audit`) |
| Signed results links | `lib/audit/token.ts` |
| Submission (validation, CRM, emails) | `app/api/audit/submit/route.ts`, `lib/audit/brevo.ts`, `lib/audit/email.ts`, `lib/audit/formspree.ts` |
| Personalised PDF | `app/api/audit/report/route.ts`, `lib/audit/report-pdf.tsx` |
| UI | `components/audit/*`, `app/[locale]/brand-growth-audit/**` |
| Workbook PDF | `public/downloads/noova-brand-growth-audit-2026.pdf` |

`/audit` (the old Brand Coherence Audit) redirects here permanently.

## Configuration (Vercel → Project → Settings → Environment Variables)

The audit works with **none** of these set: results unlock on the page, the PDF
downloads, and each lead is emailed to noova via the existing Formspree form.
Each variable switches on more.

| Variable | Purpose |
|---|---|
| `AUDIT_TOKEN_SECRET` | 32+ random characters (`openssl rand -base64 48`). Enables private results links (`/brand-growth-audit/results?r=…`). Required for the results email. |
| `RESEND_API_KEY` | Resend API key. Enables the results email and the lead notification. |
| `AUDIT_EMAIL_FROM` | `Jessica at noova <jessica@noovadata.com>` (domain must be verified in Resend). |
| `AUDIT_NOTIFY_TO` | `jessica@noovadata.com`, which receives a summary of each lead. |
| `AUDIT_REPLY_TO` | Optional reply-to for the results email. |
| `BREVO_API_KEY` | Brevo API key. When set, Brevo replaces the Formspree fallback. |
| `BREVO_LIST_AUDIT` / `BREVO_LIST_MARKETING` | List ids from `node scripts/brevo-setup.mjs`. |
| `AUDIT_BASE_URL` | Optional; defaults to the request origin. |

Redeploy after changing variables (the landing page only promises an emailed
report once Resend and the token secret are both set).

### Resend: verifying noovadata.com
Resend → Domains → Add `noovadata.com` → add the DNS records it shows (DKIM `TXT`,
plus the `MX`/`TXT` SPF records on the `send` subdomain) at your DNS provider →
Verify. Then create an API key with "Sending access".

### Brevo
Create the account, then SMTP & API → API keys → generate. Run
`BREVO_API_KEY=… node scripts/brevo-setup.mjs` once to create the attributes and
the two lists.

## Consent and data
- Marketing consent is an optional, unticked box. It's only ever *recorded* when
  ticked (`MARKETING_CONSENT`, `_AT`, `_SOURCE` with the exact wording). An
  unticked box on a later visit never removes earlier consent; people withdraw by
  unsubscribing.
- Only the "noova – marketing (consented)" list may be used for campaigns or
  sequences. "Audit – all submissions" is a record, never a mailing list.
- Results links contain answers only, no name or email, are signed and expire
  after 12 months. Browser storage holds answers (for resuming) and the token,
  never contact details.
- Retention: once a month, in Brevo, filter "Audit – all submissions" for
  `AUDIT_DATE` older than 12 months and `MARKETING_CONSENT` not true, and delete
  those contacts. Delete the matching Formspree submissions and lead emails too.

## Instagram / Manychat
DM link:
`https://noovadata.com/brand-growth-audit?utm_source=instagram&utm_medium=organic_social&utm_campaign=brand_growth_audit`
UTMs are kept for the session and sent with the form; a source of `instagram`
records the lead as "Instagram – Brand & Growth Audit". A comment is not consent
to marketing email.

## Analytics events
Pushed to `dataLayer` (GTM) and `gtag` (GA4) only once those are loaded, which
needs analytics cookie consent and `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GTM_ID`.
No personal data is included.

`audit_landing_view` → `audit_start` → `audit_complete` → `audit_preview_shown` →
`audit_form_submit` → `audit_results_unlocked` (`email_sent` true/false), plus
`audit_report_download`, `audit_workbook_download`, `audit_call_click`,
`audit_service_click`.

- Landing → start: `audit_start / audit_landing_view`
- Completion: `audit_complete / audit_start`
- Email capture: `audit_results_unlocked / audit_preview_shown`
- Delivery success: `audit_results_unlocked` with `email_sent=true` / all unlocks
- Call conversion: `audit_call_click / audit_results_unlocked`

## Testing
Add `?test=1` to the landing URL: analytics events carry `test: true`, the CRM
record gets `TEST_SUBMISSION=true`, and email subjects are prefixed `[TEST]`. Use
`@example.com` addresses, never real people's. Locally (`npm run dev`), Brevo and
Resend calls are skipped and logged unless their keys are set.
