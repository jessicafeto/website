import "server-only";

/**
 * Fallback lead capture while Brevo isn't connected: the submission is emailed
 * to noova through the Formspree form the site already uses for enquiries.
 * Once BREVO_API_KEY is set, Brevo takes over and this is no longer called.
 */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkolzzyy";

export async function sendToFormspree(
  fields: Record<string, string>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(fields),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { ok: true };
    return {
      ok: false,
      error: `Formspree ${res.status}: ${(
        await res.text().catch(() => "")
      ).slice(0, 300)}`,
    };
  } catch (e) {
    return {
      ok: false,
      error: `Formspree request failed: ${(e as Error).message}`,
    };
  }
}
