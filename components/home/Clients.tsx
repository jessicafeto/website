"use client";

import { useTranslations } from "next-intl";
import { FadeUp } from "./Motion";

/**
 * A quiet trust strip — the brands noova has worked with, shown as restrained
 * grey wordmarks. Sits between the Welcome and the Founder. To add or change a
 * client, edit this list (they're set as text, not logo images).
 */
const CLIENTS = [
  "Intellimation.ai",
  "Seereen",
  "Opa Taverne",
  "355",
  "The Her Club",
];

export default function Clients() {
  const t = useTranslations("clients");
  return (
    <section className="border-t border-rule bg-white">
      <div className="wrap py-[clamp(2.75rem,6vh,4.5rem)]">
        <FadeUp>
          <div className="flex flex-col items-center gap-7 lg:flex-row lg:justify-center lg:gap-14">
            <p className="eyebrow whitespace-nowrap text-grey">{t("label")}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
              {CLIENTS.map((client) => (
                <span
                  key={client}
                  className="font-serif text-[1.2rem] leading-none text-light transition-colors duration-500 hover:text-ink"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
