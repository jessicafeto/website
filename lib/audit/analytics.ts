/**
 * Audit conversion events. They go to the site's existing analytics only:
 * pushed to window.dataLayer (read by GTM) and sent with gtag (GA4) when those
 * are loaded, which ConsentScripts only does after analytics consent. Without
 * consent, or with no analytics configured, nothing leaves the browser.
 *
 * Never put personal details (email, name, business, website) in params.
 * `test: true` marks runs started with ?test=1 so they can be filtered out.
 */
export type AuditEvent =
  | "audit_landing_view"
  | "audit_start"
  | "audit_complete"
  | "audit_preview_shown"
  | "audit_form_submit"
  | "audit_results_unlocked"
  | "audit_report_download"
  | "audit_workbook_download"
  | "audit_call_click"
  | "audit_service_click";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let testRun = false;
export function markTestRun(v: boolean) {
  testRun = v;
}

export function track(event: AuditEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const p = { ...params, test: testRun || undefined, audit_version: "2026-en" };
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...p });
    window.gtag?.("event", event, p);
  } catch {
    // Analytics must never break the audit.
  }
}
