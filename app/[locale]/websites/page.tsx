import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { getOffer } from "@/content/offers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Websites",
    description: getOffer(locale, "websites").offer,
    alternates: {
      canonical: locale === "en" ? "/websites" : `/${locale}/websites`,
    },
  };
}

export default function WebsitesPage() {
  return <OfferPage slug="websites" />;
}
