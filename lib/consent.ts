/**
 * Consent storage — the single source of truth for what the visitor has agreed to.
 *
 * Preferences are persisted in a first-party cookie (so the choice survives across
 * visits and could be read server-side later). Bumping CONSENT_VERSION re-prompts
 * everyone — use it when the cookie policy materially changes.
 *
 * GDPR notes: essential is always true and cannot be switched off; analytics and
 * marketing default to FALSE and only become true through an explicit action.
 */

export const CONSENT_COOKIE = "noova-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 180;

/** The categories a visitor can control. Essential is implicit and always on. */
export type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
};

/** What we store. `essential` is recorded for completeness but is always true. */
export type ConsentRecord = {
  version: number;
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

/** Everything off but the essentials — the pre-consent / "reject" baseline. */
export const DENIED: ConsentCategories = { analytics: false, marketing: false };
/** Everything on — the "accept all" state. */
export const GRANTED: ConsentCategories = { analytics: true, marketing: true };

/** Read the stored consent, or null if none / stale / unreadable. */
export function readConsent(): ConsentRecord | null {
  if (typeof document === "undefined") return null;
  const row = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!row) return null;
  try {
    const value = decodeURIComponent(row.slice(CONSENT_COOKIE.length + 1));
    const parsed = JSON.parse(value) as ConsentRecord;
    if (parsed?.version !== CONSENT_VERSION) return null; // policy changed → re-prompt
    return parsed;
  } catch {
    return null;
  }
}

/** Persist a choice and return the record that was written. */
export function writeConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    essential: true,
    analytics: categories.analytics,
    marketing: categories.marketing,
    updatedAt: new Date().toISOString(),
  };
  if (typeof document !== "undefined") {
    const maxAge = 60 * 60 * 24 * CONSENT_MAX_AGE_DAYS;
    document.cookie =
      `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}` +
      `; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
  return record;
}
