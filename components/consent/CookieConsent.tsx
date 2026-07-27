"use client";

import { type ReactNode } from "react";
import ConsentProvider from "./ConsentProvider";
import CookieBanner from "./CookieBanner";
import PreferencesModal from "./PreferencesModal";
import ConsentScripts from "./ConsentScripts";

/**
 * Single entry point for the whole consent system. Wraps the app so the banner,
 * modal, footer "Cookie Settings" link and the gated tracking scripts all share
 * one consent context. Mounted once, in the root layout.
 */
export default function CookieConsent({ children }: { children: ReactNode }) {
  return (
    <ConsentProvider>
      {children}
      <CookieBanner />
      <PreferencesModal />
      <ConsentScripts />
    </ConsentProvider>
  );
}
