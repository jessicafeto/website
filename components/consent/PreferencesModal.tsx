"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useConsent } from "./ConsentProvider";

const EASE = [0.2, 0.6, 0.2, 1] as [number, number, number, number];

function Toggle({
  checked,
  disabled = false,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
        checked ? "bg-oxblood" : "bg-rule"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Row({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-t border-rule py-5">
      <div>
        <h3 className="font-sans font-bold tracking-[-0.01em] text-[1.05rem] leading-tight text-ink">{name}</h3>
        <p className="mt-1.5 font-sans text-[0.9rem] leading-relaxed text-grey">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

/** Granular preferences modal, opened from the banner or the footer "Cookie Settings" link. */
export default function PreferencesModal() {
  const t = useTranslations("cookieModal");
  const { prefsOpen, closePreferences, consent, save, acceptAll } = useConsent();

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Sync the toggles to the stored choice each time the modal opens.
  useEffect(() => {
    if (prefsOpen) {
      setAnalytics(consent?.analytics ?? false);
      setMarketing(consent?.marketing ?? false);
    }
  }, [prefsOpen, consent]);

  // Escape to close + lock background scroll while open.
  useEffect(() => {
    if (!prefsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePreferences();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [prefsOpen, closePreferences]);

  return (
    <AnimatePresence>
      {prefsOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[rgba(20,18,16,0.4)]"
            onClick={closePreferences}
            aria-hidden
          />

          {/* Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-prefs-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative w-full max-w-[34rem] rounded-xl border border-rule bg-white p-8 shadow-[0_20px_60px_-20px_rgba(30,26,22,0.35)] sm:p-10"
          >
            <button
              type="button"
              onClick={closePreferences}
              aria-label={t("closeAria")}
              className="absolute right-6 top-6 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-grey transition-colors duration-300 hover:text-ink"
            >
              {t("close")}
            </button>

            <h2
              id="cookie-prefs-title"
              className="font-sans font-bold tracking-[-0.01em] text-[1.6rem] leading-tight text-ink"
            >
              {t("title")}
            </h2>
            <p className="mt-3 max-w-[42ch] font-sans text-[0.95rem] leading-relaxed text-grey">
              {t("intro")}
            </p>

            <div className="mt-8">
              <Row name={t("essentialName")} description={t("essentialDesc")}>
                <Toggle checked disabled label={t("essentialAria")} />
              </Row>
              <Row name={t("analyticsName")} description={t("analyticsDesc")}>
                <Toggle
                  checked={analytics}
                  onChange={setAnalytics}
                  label={t("analyticsAria")}
                />
              </Row>
              <Row name={t("marketingName")} description={t("marketingDesc")}>
                <Toggle
                  checked={marketing}
                  onChange={setMarketing}
                  label={t("marketingAria")}
                />
              </Row>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-7 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full border border-ink bg-white px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
              >
                {t("acceptAll")}
              </button>
              <button
                type="button"
                onClick={() => save({ analytics, marketing })}
                className="rounded-full bg-oxblood px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-white transition-opacity duration-300 hover:opacity-90"
              >
                {t("save")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
