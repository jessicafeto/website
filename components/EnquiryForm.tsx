"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkolzzyy";

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="relative block">
      <span className="eyebrow text-grey">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="peer mt-2 w-full border-b border-rule bg-transparent pb-3 font-sans text-[1.05rem] text-ink outline-none"
      />
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-oxblood transition-transform duration-700 peer-focus:scale-x-100" />
    </label>
  );
}

/**
 * The bottom-of-page enquiry form for an engagement. Posts to the same
 * Formspree endpoint as the contact section; a hidden field records which
 * engagement the enquiry is for, and `_subject` labels the email.
 */
export default function EnquiryForm({ engagement }: { engagement: string }) {
  const t = useTranslations("offer.form");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-center font-serif italic text-[1.4rem] text-ink">
        {t("sent")}
      </p>
    );
  }

  return (
    <form
      action={FORMSPREE_ENDPOINT}
      method="POST"
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-6 text-left"
    >
      <input type="hidden" name="engagement" value={engagement} />
      <input type="hidden" name="_subject" value={`New ${engagement} enquiry — noova`} />

      <Field label={t("name")} name="name" required />
      <Field label={t("email")} name="email" type="email" required />
      <Field label={t("business")} name="business" />
      <Field label={t("timeline")} name="timeline" />
      <Field label={t("budget")} name="budget" />

      <div className="pt-2 text-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-oxblood px-10 py-4 font-sans text-[0.8rem] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? t("sending") : t("submit")}
        </button>
        {status === "error" && (
          <p className="mt-4 font-sans text-[0.9rem] text-oxblood">
            {t("error")}
          </p>
        )}
      </div>
    </form>
  );
}
