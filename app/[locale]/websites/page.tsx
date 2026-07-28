import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { OFFERS } from "@/content/offers";

export const metadata: Metadata = {
  title: "Websites",
  description: OFFERS.websites.offer,
  alternates: { canonical: "/websites" },
};

export default function WebsitesPage() {
  return <OfferPage offer={OFFERS.websites} />;
}
