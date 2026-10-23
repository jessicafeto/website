/**
 * One-time Brevo setup for the Brand & Growth Audit: creates the two contact
 * lists and every contact attribute the audit writes. Safe to re-run (existing
 * lists and attributes are left alone).
 *
 *   BREVO_API_KEY=xkeysib-... node scripts/brevo-setup.mjs
 *
 * Then put the two list ids it prints into Vercel as BREVO_LIST_AUDIT and
 * BREVO_LIST_MARKETING.
 */
const KEY = process.env.BREVO_API_KEY;
if (!KEY) {
  console.error("Set BREVO_API_KEY first.");
  process.exit(1);
}
const api = (path, init = {}) =>
  fetch(`https://api.brevo.com/v3${path}`, {
    ...init,
    headers: {
      "api-key": KEY,
      "content-type": "application/json",
      accept: "application/json",
      ...init.headers,
    },
  });

const TEXT = [
  "BUSINESS_NAME",
  "WEBSITE",
  "INDUSTRY",
  "PRIMARY_CHALLENGE",
  "AUDIT_BAND",
  "AUDIT_STRONGEST",
  "AUDIT_PRIORITIES",
  "AUDIT_ANSWERS",
  "AUDIT_REPORT_ID",
  "AUDIT_RESULTS_URL",
  "AUDIT_TAGS",
  "LEAD_SOURCE",
  "CAMPAIGN_ID",
  "UTM_SOURCE",
  "UTM_MEDIUM",
  "UTM_CAMPAIGN",
  "UTM_CONTENT",
  "MARKETING_CONSENT_AT",
  "MARKETING_CONSENT_SOURCE",
];
const FLOAT = [
  "AUDIT_SCORE",
  "AUDIT_BRAND",
  "AUDIT_WEBSITE",
  "AUDIT_CONTENT",
  "AUDIT_ACQUISITION",
  "AUDIT_RETENTION",
  "AUDIT_SYSTEMS",
];
const BOOL = [
  "OPP_BRAND",
  "OPP_WEBSITE",
  "OPP_MARKETING",
  "OPP_CRM_AUTOMATION",
  "OPP_ANALYTICS",
  "MARKETING_CONSENT",
  "TEST_SUBMISSION",
];
const DATE = ["AUDIT_DATE"];

const existing = new Set(
  ((await (await api("/contacts/attributes")).json()).attributes ?? []).map(
    (a) => a.name
  )
);
for (const [type, names] of [
  ["text", TEXT],
  ["float", FLOAT],
  ["boolean", BOOL],
  ["date", DATE],
]) {
  for (const name of names) {
    if (existing.has(name)) continue;
    const res = await api(`/contacts/attributes/normal/${name}`, {
      method: "POST",
      body: JSON.stringify({ type }),
    });
    console.log(
      `${
        res.ok ? "created" : `FAILED (${res.status})`
      } attribute ${name} (${type})`
    );
  }
}

const folders =
  (await (await api("/contacts/folders?limit=50")).json()).folders ?? [];
const folderId =
  folders[0]?.id ??
  (
    await (
      await api("/contacts/folders", {
        method: "POST",
        body: JSON.stringify({ name: "noova" }),
      })
    ).json()
  ).id;
const lists =
  (await (await api("/contacts/lists?limit=50")).json()).lists ?? [];
for (const name of [
  "Audit – all submissions",
  "noova – marketing (consented)",
]) {
  let list = lists.find((l) => l.name === name);
  if (!list)
    list = await (
      await api("/contacts/lists", {
        method: "POST",
        body: JSON.stringify({ name, folderId }),
      })
    ).json();
  console.log(`${name}: id ${list.id}`);
}
console.log(
  "\nBREVO_LIST_AUDIT = the first id, BREVO_LIST_MARKETING = the second."
);
