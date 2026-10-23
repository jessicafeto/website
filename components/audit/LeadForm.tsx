"use client";

import { useId, useState } from "react";
import {
  BUSINESS_TYPES,
  CHALLENGES,
  MARKETING_CONSENT_TEXT,
} from "@/content/audit";

export type LeadDetails = {
  email: string;
  firstName: string;
  businessName: string;
  website: string;
  businessType: string;
  challenge: string;
  marketingConsent: boolean;
  company_url: string; // honeypot
};

const EMPTY: LeadDetails = {
  email: "",
  firstName: "",
  businessName: "",
  website: "",
  businessType: "",
  challenge: "",
  marketingConsent: false,
  company_url: "",
};

const inputCls =
  "mt-2 w-full border-b border-rule bg-transparent pb-3 font-sans text-[1.05rem] text-ink outline-none transition-colors focus:border-oxblood aria-[invalid=true]:border-oxblood";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: (ids: { id: string; describedBy?: string }) => React.ReactNode;
}) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-grey">
        {label}
      </label>
      {children({ id, describedBy: error ? errId : undefined })}
      {error && (
        <p id={errId} className="mt-2 font-sans text-[0.85rem] text-oxblood">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * The details form that unlocks the full results. Only the email is required.
 * The marketing box is optional, unticked, and has nothing to do with getting
 * the report.
 */
export default function LeadForm({
  onSubmit,
  status,
  serverError,
  serverField,
  emailEnabled,
}: {
  onSubmit: (d: LeadDetails) => void;
  status: "idle" | "sending" | "error";
  serverError?: string;
  serverField?: string;
  emailEnabled: boolean;
}) {
  const [d, setD] = useState<LeadDetails>(EMPTY);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LeadDetails, string>>
  >({});
  const set = <K extends keyof LeadDetails>(k: K, v: LeadDetails[K]) =>
    setD((x) => ({ ...x, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!d.email.trim())
      next.email = "Please enter your email address to unlock your results.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim()))
      next.email = "That email address doesn’t look quite right.";
    if (
      d.website.trim() &&
      !/^(https?:\/\/)?[^\s/]+\.[^\s]{2,}/i.test(d.website.trim())
    )
      next.website =
        "Please enter a website address, such as yourbusiness.co.uk, or leave it blank.";
    setErrors(next);
    if (Object.keys(next).length) {
      document
        .getElementById(
          Object.keys(next)[0] === "email" ? "audit-email" : "audit-website"
        )
        ?.focus();
      return;
    }
    onSubmit(d);
  }

  const err = (k: keyof LeadDetails) =>
    errors[k] ?? (serverField === k ? serverError : undefined);
  const sending = status === "sending";

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-7 text-left"
      aria-describedby="audit-privacy"
    >
      <p className="font-sans text-[0.85rem] text-grey">
        Only your email address is required. The rest helps us make the report
        more relevant.
      </p>
      <Field label="Email address" error={err("email")}>
        {({ describedBy }) => (
          <input
            id="audit-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={d.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={Boolean(err("email"))}
            aria-describedby={describedBy}
            className={inputCls}
          />
        )}
      </Field>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="First name">
          {({ id }) => (
            <input
              id={id}
              autoComplete="given-name"
              value={d.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className={inputCls}
            />
          )}
        </Field>
        <Field label="Business name">
          {({ id }) => (
            <input
              id={id}
              autoComplete="organization"
              value={d.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              className={inputCls}
            />
          )}
        </Field>
      </div>

      <Field label="Website" error={err("website")}>
        {({ describedBy }) => (
          <input
            id="audit-website"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourbusiness.co.uk"
            value={d.website}
            onChange={(e) => set("website", e.target.value)}
            aria-invalid={Boolean(err("website"))}
            aria-describedby={describedBy}
            className={`${inputCls} placeholder:text-light`}
          />
        )}
      </Field>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Type of business">
          {({ id }) => (
            <select
              id={id}
              value={d.businessType}
              onChange={(e) => set("businessType", e.target.value)}
              className={`${inputCls} audit-select`}
            >
              <option value="">Choose one</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Biggest challenge right now">
          {({ id }) => (
            <select
              id={id}
              value={d.challenge}
              onChange={(e) => set("challenge", e.target.value)}
              className={`${inputCls} audit-select`}
            >
              <option value="">Choose one</option>
              {CHALLENGES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          )}
        </Field>
      </div>

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

      <label className="flex cursor-pointer items-start gap-4 border-t border-rule pt-6">
        <input
          type="checkbox"
          checked={d.marketingConsent}
          onChange={(e) => set("marketingConsent", e.target.checked)}
          className="audit-check mt-1 shrink-0"
        />
        <span className="font-sans text-[0.92rem] leading-[1.65] text-ink">
          {MARKETING_CONSENT_TEXT}{" "}
          <span className="text-grey">
            (Optional. You’ll get your report either way.)
          </span>
        </span>
      </label>

      <p
        id="audit-privacy"
        className="font-sans text-[0.82rem] leading-[1.7] text-grey"
      >
        {emailEnabled
          ? "We use your email to send your report, and keep"
          : "We keep"}{" "}
        your details and answers so we have a record of your results, for up to
        12 months, or until you unsubscribe if you agree to marketing emails. We
        never sell your data. See our{" "}
        <a
          href="/privacy"
          target="_blank"
          className="underline underline-offset-2 hover:text-ink"
        >
          privacy policy
        </a>
        .
      </p>

      <div>
        <button
          type="submit"
          disabled={sending}
          className="hero-btn hero-btn--oxblood w-full disabled:opacity-60 sm:w-auto"
        >
          {sending ? "Unlocking your results…" : "Unlock my full results"}
        </button>
        <div aria-live="polite">
          {status === "error" && serverError && !serverField && (
            <p className="mt-4 font-sans text-[0.9rem] text-oxblood">
              {serverError}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
