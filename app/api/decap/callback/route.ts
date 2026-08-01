import { NextRequest, NextResponse } from "next/server";

/**
 * Step 2 of the GitHub OAuth handshake: GitHub redirects here with a `code`.
 * We exchange it server-side for an access token (client secret never
 * reaches the browser), then hand the token to the CMS popup's opener window
 * via the postMessage protocol Decap's GitHub backend expects.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = request.cookies.get("decap_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return new NextResponse("Invalid or expired OAuth state. Please try signing in again.", {
      status: 400,
    });
  }

  const clientId = process.env.DECAP_GITHUB_CLIENT_ID;
  const clientSecret = process.env.DECAP_GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new NextResponse("Missing GitHub OAuth credentials", { status: 500 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const tokenJson = (await tokenRes.json()) as {
    access_token?: string;
    error_description?: string;
  };

  if (!tokenJson.access_token) {
    return new NextResponse(
      `<p>GitHub authorization failed: ${tokenJson.error_description ?? "unknown error"}</p>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const html = `<!DOCTYPE html>
<html><body>
<script>
(function() {
  var token = ${JSON.stringify(tokenJson.access_token)};
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:success:' + JSON.stringify({ token: token, provider: 'github' }),
      e.origin
    );
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body></html>`;

  const res = new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  res.cookies.delete("decap_oauth_state");
  return res;
}
