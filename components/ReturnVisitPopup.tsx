"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useConsent } from "@/components/consent/ConsentProvider";

/**
 * A quiet aside for returning visitors — "Back for more?"
 *
 * Anonymous by design: it keeps a visit counter on this device only
 * (localStorage) and a once-per-session flag (sessionStorage). Nothing is
 * sent anywhere and no one is identified. The first visit is never greeted;
 * each later browsing session is, the moment the page lands. It never
 * competes with the language chooser, cookie banner or cookie preferences.
 *
 * Preview: add ?noova-popup to any URL to force it.
 */

const VISITS_KEY = "noova-visits"; // localStorage: completed browsing sessions
const SESSION_KEY = "noova-visit-session"; // sessionStorage: this session counted
const SHOWN_KEY = "noova-return-shown"; // sessionStorage: greeted this session
const LANG_COOKIE = "noova-lang-chosen";

const OXBLOOD = "#5E1414";
const INK = "#1a1917";

function store(kind: "local" | "session") {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null; // private mode / storage blocked — the popup simply stays away
  }
}

/** Decide, once per page load, whether this visit is greeted. */
function isEligible(): boolean {
  if (new URLSearchParams(window.location.search).has("noova-popup")) return true;

  const local = store("local");
  const session = store("session");
  if (!local || !session) return false;

  // Count each browsing session once.
  let visits = Number(local.getItem(VISITS_KEY)) || 0;
  if (!session.getItem(SESSION_KEY)) {
    visits += 1;
    local.setItem(VISITS_KEY, String(visits));
    session.setItem(SESSION_KEY, "1");
  }

  if (visits < 2) return false; // first visit: no greeting
  return !session.getItem(SHOWN_KEY); // once per session
}

export default function ReturnVisitPopup() {
  const t = useTranslations("returnPopup");
  const { ready, bannerVisible, prefsOpen } = useConsent();
  const [eligible, setEligible] = useState(false);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false); // drives the fade
  const decided = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Decide once, after consent state is known on the client.
  useEffect(() => {
    if (!ready || decided.current) return;
    decided.current = true;
    setEligible(isEligible());
  }, [ready]);

  // Open as soon as the page lands — but never over the cookie UI or language chooser.
  useEffect(() => {
    if (!eligible || open || bannerVisible || prefsOpen) return;
    const forced = new URLSearchParams(window.location.search).has("noova-popup");
    const langChosen = document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${LANG_COOKIE}=`));
    if (!langChosen && !forced) return;

    returnFocus.current = document.activeElement as HTMLElement | null;
    store("session")?.setItem(SHOWN_KEY, "1");
    setOpen(true);
  }, [eligible, open, bannerVisible, prefsOpen]);

  // Fade in once mounted. A timer, not rAF: rAF is paused in background tabs
  // and would strand the fade.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setVisible(true), 30);
    return () => window.clearTimeout(timer);
  }, [open]);

  const close = useCallback(() => {
    setVisible(false);
    setEligible(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      setOpen(false);
      returnFocus.current?.focus?.();
    }, reduce ? 0 : 400);
  }, []);

  // Focus the action on open; Escape closes; Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return;
    actionRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = dialogRef.current.querySelectorAll<HTMLElement>("button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[140] flex items-end justify-center p-4 sm:items-center sm:p-6 motion-safe:transition-opacity motion-safe:duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Veil — clicking it dismisses, like the close button */}
      <div
        aria-hidden
        onClick={close}
        className="absolute inset-0 bg-[#1c1a17]/35 backdrop-blur-[2px]"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-popup-title"
        aria-describedby="return-popup-text"
        className={`relative w-full max-w-[26rem] bg-paper px-9 pb-10 pt-12 text-center shadow-[0_24px_60px_-20px_rgba(28,26,23,0.45)] sm:px-12 sm:pb-12 sm:pt-14 motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.2,0.6,0.2,1)] ${
          visible ? "translate-y-0" : "motion-safe:translate-y-3"
        }`}
        style={{ color: INK }}
      >
        {/* Hairline frame, inset — the editorial touch */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[7px] border"
          style={{ borderColor: `${OXBLOOD}33` }}
        />

        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-[1.35rem] leading-none opacity-55 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2"
          style={{ outlineColor: OXBLOOD }}
        >
          <span aria-hidden>×</span>
        </button>

        {/* noova is always lowercase — override .eyebrow's uppercase */}
        <p className="eyebrow" style={{ color: OXBLOOD, textTransform: "none" }}>
          noova
        </p>

        <h2
          id="return-popup-title"
          className="mt-5 font-serif italic leading-[1.02] text-[clamp(2.3rem,7vw,2.9rem)]"
        >
          {t("headline")}
        </h2>

        <span
          aria-hidden
          className="mx-auto mt-6 block h-px w-10"
          style={{ backgroundColor: OXBLOOD }}
        />

        <p
          id="return-popup-text"
          className="mt-6 font-sans text-[0.98rem] leading-relaxed opacity-75"
        >
          {t("text")}
        </p>

        <button
          ref={actionRef}
          type="button"
          onClick={close}
          className="mt-9 inline-flex items-center justify-center px-8 py-[0.95rem] font-sans text-[0.74rem] uppercase tracking-[0.22em] text-paper transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
          style={{ backgroundColor: OXBLOOD, outlineColor: OXBLOOD }}
        >
          {t("button")}
        </button>
      </div>
    </div>
  );
}
