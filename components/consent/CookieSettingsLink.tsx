"use client";

import { useConsent } from "./ConsentProvider";

/**
 * Footer link that re-opens the preferences modal, so visitors can change their
 * mind at any time. Styling is passed in so it matches whatever it sits beside.
 */
export default function CookieSettingsLink({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      {children ?? "Cookie Settings"}
    </button>
  );
}
