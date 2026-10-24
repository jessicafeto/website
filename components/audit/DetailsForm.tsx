"use client";

import { useState } from "react";
import { MARKETING_CONSENT_TEXT } from "@/content/audit";

export type Details = {
  firstName: string;
  email: string;
  businessName: string;
  marketingConsent: boolean;
  company_url: string; // honeypot
};

export const EMPTY_DETAILS: Details = {
  firstName: "",
  email: "",
  businessName: "",
  marketingConsent: false,
  company_url: "",
};

/**
 * "Before we begin": name and email, asked before the first question so the
 * results can be emailed. Business name is optional. The marketing box is
 * optional, unticked, and has nothing to do with getting the results.
 * Styled for the oxblood card (light text on dark).
 */
export default function DetailsForm({
  initial,
  emailEnabled,
  onSubmit,
}: {
  initial: Details;
  emailEnabled: boolean;
  onSubmit: (d: Details) => void;
}) {
  const [d, setD] = useState<Details>(initial);
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>(
    {}
  );
  const set = <K extends keyof Details>(k: K, v: Details[K]) =>
    setD((x) => ({ ...x, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!d.firstName.trim()) next.firstName = "Please tell us your first name.";
    if (!d.email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim()))
      next.email = "That email address doesn’t look quite right.";
    setErrors(next);
    if (next.firstName) return document.getElementById("audit-first")?.focus();
    if (next.email) return document.getElementById("audit-email")?.focus();
    onSubmit({ ...d, firstName: d.firstName.trim(), email: d.email.trim() });
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-6 text-left"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="audit-field__label">First name</span>
          <input
            id="audit-first"
            autoComplete="given-name"
            value={d.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "err-first" : undefined}
            className="audit-field"
          />
          {errors.firstName && (
            <span id="err-first" className="audit-field__error">
              {errors.firstName}
            </span>
          )}
        </label>
        <label className="block">
          <span className="audit-field__label">Email address</span>
          <input
            id="audit-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={d.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "err-email" : undefined}
            className="audit-field"
          />
          {errors.email && (
            <span id="err-email" className="audit-field__error">
              {errors.email}
            </span>
          )}
        </label>
      </div>
      <label className="block">
        <span className="audit-field__label">
          Business name{" "}
          <span className="normal-case tracking-normal opacity-70">
            (optional)
          </span>
        </span>
        <input
          autoComplete="organization"
          value={d.businessName}
          onChange={(e) => set("businessName", e.target.value)}
          className="audit-field"
        />
      </label>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div
        aria-hidden
        className="absolute left-[-10000px] h-px w-px overflow-hidden"
      >
        <label>
          Company URL
          <input
            tabIndex={-1}
            autoComplete="off"
            value={d.company_url}
            onChange={(e) => set("company_url", e.target.value)}
          />
        </label>
      </div>

      <label className="flex cursor-pointer items-start gap-4 border-t border-white/15 pt-5">
        <input
          type="checkbox"
          checked={d.marketingConsent}
          onChange={(e) => set("marketingConsent", e.target.checked)}
          className="audit-check audit-check--dark mt-1 shrink-0"
        />
        <span className="font-sans text-[0.9rem] leading-[1.6] text-white/85">
          {MARKETING_CONSENT_TEXT}{" "}
          <span className="text-white/60">(Optional.)</span>
        </span>
      </label>

      <button type="submit" className="hero-btn hero-btn--light w-full">
        Start the audit
      </button>

      <p className="font-sans text-[0.78rem] leading-[1.65] text-white/60">
        {emailEnabled
          ? "We use your email to send your results and report."
          : "We keep your details with your results."}{" "}
        We store your details and answers for up to 12 months, or until you
        unsubscribe if you agree to marketing emails. We never sell your data.
        See our{" "}
        <a
          href="/privacy"
          target="_blank"
          className="underline underline-offset-2 hover:text-white"
        >
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
