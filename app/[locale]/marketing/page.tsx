import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { getOffer } from "@/content/offers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Marketing & Growth",
    description: getOffer(locale, "marketing").offer,
    alternates: {
      canonical: locale === "en" ? "/marketing" : `/${locale}/marketing`,
    },
  };
}

export default function MarketingPage() {
  return <OfferPage slug="marketing" />;
}
