/**
 * The three (now four) noova engagements, per locale.
 *
 * The actual copy/pricing lives in content/offers.en.json and offers.sq.json —
 * plain JSON, editable directly (by hand, or via the /admin content editor).
 * This file only carries the types and the lookup helpers. Look up an offer
 * with getOffer(locale, slug); nothing else needs to change when the JSON
 * content changes.
 */
import offersEnData from "./offers.en.json";
import offersSqData from "./offers.sq.json";

export type Phase = { n: string; title: string; body: string };
export type Group = { label: string; items: string[] };
export type Faq = { q: string; a: string };

export type Tier = {
  name: string;
  price: string;
  summary: string;
  builds?: string;
  scope: string[];
  featured?: boolean;
};

export type Offer = {
  slug: "branding" | "websites" | "marketing" | "automation";
  eyebrow: string;
  name: string;
  heroImage: string;
  heroAlt: string;
  headline: string;
  offer: string;
  cadence: string;
  booking: string;
  shift: { heading: string; body: string };
  tiers: Tier[];
  includes: Group[];
  process: Phase[];
  faqs: Faq[];
};

export const OFFER_ORDER: Offer["slug"][] = [
  "branding",
  "websites",
  "marketing",
  "automation",
];

const OFFERS_EN = offersEnData as unknown as Record<Offer["slug"], Offer>;
const OFFERS_SQ = offersSqData as unknown as Record<Offer["slug"], Offer>;

const BY_LOCALE: Record<string, Record<Offer["slug"], Offer>> = {
  en: OFFERS_EN,
  sq: OFFERS_SQ,
};

/** Get an engagement's content for the active locale (falls back to English). */
export function getOffer(locale: string, slug: Offer["slug"]): Offer {
  return (BY_LOCALE[locale] ?? OFFERS_EN)[slug];
}
