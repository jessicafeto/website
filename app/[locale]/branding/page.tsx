import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { OFFERS } from "@/content/offers";

export const metadata: Metadata = {
  title: "Branding",
  description: OFFERS.branding.offer,
  alternates: { canonical: "/branding" },
};

export default function BrandingPage() {
  return <OfferPage offer={OFFERS.branding} />;
}
