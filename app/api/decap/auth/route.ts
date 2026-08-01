import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

/**
 * Step 1 of the GitHub OAuth handshake for Decap CMS (self-hosted on Vercel,
 * not Netlify — Decap needs someone to run this exchange, so we do it
 * ourselves in two tiny routes instead of relying on Netlify's built-in one).
 * The CMS admin (public/admin) opens this in a popup; we redirect straight to
 * GitHub's authorize screen. See ./callback/route.ts for step 2.
 */
const SITE_ORIGIN = "https://noovadata.com";

export async function GET(_request: NextRequest) {
  const clientId = process.env.DECAP_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Missing DECAP_GITHUB_CLIENT_ID env var", { status: 500 });
  }

  const state = randomBytes(16).toString("hex");
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", `${SITE_ORIGIN}/api/decap/callback`);
  authorizeUrl.searchParams.set("scope", "repo,user");
  authorizeUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authorizeUrl.toString());
  res.cookies.set("decap_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/api/decap",
  });
  return res;
}
