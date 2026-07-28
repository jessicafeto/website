import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { OFFERS } from "@/content/offers";

export const metadata: Metadata = {
  title: "Marketing & Growth",
  description: OFFERS.marketing.offer,
  alternates: { canonical: "/marketing" },
};

export default function MarketingPage() {
  return <OfferPage offer={OFFERS.marketing} />;
}
