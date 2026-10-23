import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

/**
 * Handles locale detection and routing:
 *  - on first visit, reads the browser's Accept-Language header and picks `sq`
 *    for Albanian speakers, English otherwise (no popup);
 *  - persists the choice in a `NEXT_LOCALE` cookie so it sticks across visits;
 *  - rewrites/redirects requests to the correct locale.
 *
 * Exception: the Brand & Growth Audit only exists in English, so it is always
 * served in English, whatever the visitor's language or cookie. (/sq/… audit
 * URLs redirect to the English page in next.config.ts.) Remove this once an
 * Albanian edition exists.
 */
const intl = createMiddleware(routing);
const ENGLISH_ONLY = /^\/brand-growth-audit(\/|$)/;

export default function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (ENGLISH_ONLY.test(pathname)) {
    return NextResponse.rewrite(new URL(`/en${pathname}${search}`, req.url));
  }
  return intl(req);
}

export const config = {
  // Run on everything except API routes, the Decap /admin content editor,
  // Next internals and files with an extension.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
