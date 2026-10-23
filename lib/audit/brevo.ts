import "server-only";

/**
 * Brevo — the audit's contact store and CRM (free plan).
 *
 * Contacts are created or updated by email (updateEnabled), so a returning
 * visitor never becomes a duplicate. Every submission joins the "audit" list,
 * which is never used for marketing. Only visitors who ticked the marketing box
 * join the "marketing" list, which is the only list campaigns and sequences
 * may target.
 *
 * Attributes and lists must exist in Brevo first: run `node scripts/brevo-setup.mjs`
 * once (see docs/brand-growth-audit.md).
 *
 * Env: BREVO_API_KEY, BREVO_LIST_AUDIT, BREVO_LIST_MARKETING
 */
const API = "https://api.brevo.com/v3";

export type BrevoAttributes = Record<string, string | number | boolean>;

export function brevoConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_LIST_AUDIT);
}

export async function upsertContact(
  email: string,
  attributes: BrevoAttributes,
  marketingConsent: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const listIds = [Number(process.env.BREVO_LIST_AUDIT)];
  if (marketingConsent && process.env.BREVO_LIST_MARKETING) {
    listIds.push(Number(process.env.BREVO_LIST_MARKETING));
  }
  try {
    const res = await fetch(`${API}/contacts`, {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY as string,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ email, attributes, listIds, updateEnabled: true }),
      signal: AbortSignal.timeout(8000),
    });
    // 201 = created, 204 = updated.
    if (res.ok) return { ok: true };
    const detail = await res.text().catch(() => "");
    return { ok: false, error: `Brevo ${res.status}: ${detail.slice(0, 300)}` };
  } catch (e) {
    return {
      ok: false,
      error: `Brevo request failed: ${(e as Error).message}`,
    };
  }
}
