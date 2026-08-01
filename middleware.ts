import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Handles locale detection and routing:
 *  - on first visit, reads the browser's Accept-Language header and picks `sq`
 *    for Albanian speakers, English otherwise (no popup);
 *  - persists the choice in a `NEXT_LOCALE` cookie so it sticks across visits;
 *  - rewrites/redirects requests to the correct locale.
 */
export default createMiddleware(routing);

export const config = {
  // Run on everything except API routes, the Decap /admin content editor,
  // Next internals and files with an extension.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
