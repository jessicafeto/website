import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation helpers. Use these `Link` / `usePathname` / `useRouter`
 * in place of the ones from `next/navigation` so internal links automatically
 * keep the visitor in their current language (and add the `/sq` prefix when needed).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
