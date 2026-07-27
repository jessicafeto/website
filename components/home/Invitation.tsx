"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FadeUp } from "./Motion";

function Field({
  label,
  name,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="relative block">
      <span className="eyebrow text-grey">{label}</span>

      {textarea ? (
        <textarea
          name={name}
          rows={3}
          className="peer mt-2 w-full resize-none border-b border-rule bg-transparent pb-3 font-sans text-[1.05rem] text-ink outline-none"
        />
      ) : (
        <input
          name={name}
          type={type}
          className="peer mt-2 w-full border-b border-rule bg-transparent pb-3 font-sans text-[1.05rem] text-ink outline-none"
        />
      )}

      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-oxblood transition-transform duration-700 peer-focus:scale-x-100" />
    </label>
  );
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkolzzyy";

export default function Invitation() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

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

  return (
    <section
      id="contact"
      className="border-t border-rule bg-white py-[clamp(6rem,10vh,8rem)]"
    >
      <div className="mx-auto max-w-[1400px] px-8">
        {/* Double Editorial Frame */}
        <div className="border-2 border-oxblood p-[6px]">
          <div className="relative border border-oxblood/70 bg-white px-10 py-12 md:px-20 md:py-14">
            {/* Wax Seal */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <FadeUp>
                <Image
                  src="/brand/wax-seal.png"
                  alt="noova wax seal"
                  width={100}
                  height={100}
                  priority
                />
              </FadeUp>
            </div>

            <div className="mx-auto flex max-w-[650px] flex-col items-center text-center">
              {/* Heading */}
              <FadeUp delay={0.1}>
  <h2 className="font-serif italic text-center text-[clamp(2.6rem,4vw,3.8rem)] leading-none text-ink whitespace-nowrap">
    {t("heading")}
  </h2>
</FadeUp>

              {/* Intro */}
              <FadeUp delay={0.18}>
                <p className="mt-4 max-w-[34ch] font-sans text-[1.05rem] leading-relaxed text-grey">
                  {t("intro")}
                </p>
              </FadeUp>

              {/* Form */}
              <FadeUp delay={0.25} className="mt-8 w-full">
                <form
                  action={FORMSPREE_ENDPOINT}
                  method="POST"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6 text-left"
                >
                  <Field label={t("fieldName")} name="name" />

                  <Field label={t("fieldEmail")} name="email" type="email" />

                  <Field label={t("fieldCompany")} name="company" />

                  <Field label={t("fieldProject")} name="message" textarea />

                  <div className="pt-2 text-center">
                    {status === "sent" ? (
                      <p className="font-serif italic text-[1.2rem] text-ink">
                        {t("sent")}
                      </p>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </form>
              </FadeUp>

              {/* Bottom */}
              <FadeUp delay={0.35}>
                <div className="mt-10 w-full border-t border-oxblood/20 pt-6 text-center">
                  <p className="eyebrow text-grey">{t("location")}</p>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}