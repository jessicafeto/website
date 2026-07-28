import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { getOffer } from "@/content/offers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Branding",
    description: getOffer(locale, "branding").offer,
    alternates: {
      canonical: locale === "en" ? "/branding" : `/${locale}/branding`,
    },
  };
}

export default function BrandingPage() {
  return <OfferPage slug="branding" />;
}
