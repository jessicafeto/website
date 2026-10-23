import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { decodeResponses, type Responses } from "./scoring";

/**
 * Signed results tokens — how a visitor's results link works without a database.
 *
 * The token carries only the encoded answers, when it was issued and a random
 * submission id: never a name, email or business. It's signed with
 * AUDIT_TOKEN_SECRET (HMAC-SHA256), so nobody can forge or alter results by
 * editing the URL, and it expires after TOKEN_TTL_DAYS.
 *
 *   v1.<36 digits>.<issued, base36 seconds>.<submission id>.<signature>
 */
const VERSION = "v1";
export const TOKEN_TTL_DAYS = 365;

function secret(): string | null {
  const s = process.env.AUDIT_TOKEN_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV !== "production")
    return "dev-only-audit-secret-do-not-use-in-production";
  return null; // not configured: no private links (results still unlock on the page)
}

export function tokensEnabled(): boolean {
  return secret() !== null;
}

function sign(body: string, key: string): string {
  return createHmac("sha256", key)
    .update(body)
    .digest("base64url")
    .slice(0, 32);
}

export function createToken(
  encoded: string,
  submissionId: string,
  issuedAt = new Date()
): string | null {
  const key = secret();
  if (!key) return null;
  const body = [
    VERSION,
    encoded,
    Math.floor(issuedAt.getTime() / 1000).toString(36),
    submissionId,
  ].join(".");
  return `${body}.${sign(body, key)}`;
}

export type VerifiedToken = {
  responses: Responses;
  encoded: string;
  submissionId: string;
  issuedAt: Date;
};

export function verifyToken(
  token: string | null | undefined
): VerifiedToken | null {
  const key = secret();
  if (!key || !token || token.length > 200) return null;
  const parts = token.split(".");
  if (parts.length !== 5 || parts[0] !== VERSION) return null;
  const body = parts.slice(0, 4).join(".");
  const given = Buffer.from(parts[4]);
  const expected = Buffer.from(sign(body, key));
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return null;

  const responses = decodeResponses(parts[1]);
  const issuedAt = new Date(parseInt(parts[2], 36) * 1000);
  if (!responses || Number.isNaN(issuedAt.getTime())) return null;
  if (Date.now() - issuedAt.getTime() > TOKEN_TTL_DAYS * 86_400_000)
    return null;

  return { responses, encoded: parts[1], submissionId: parts[3], issuedAt };
}
