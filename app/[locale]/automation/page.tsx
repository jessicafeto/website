import type { Metadata } from "next";
import OfferPage from "@/components/OfferPage";
import { getOffer } from "@/content/offers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "AI & Automation",
    description: getOffer(locale, "automation").offer,
    alternates: {
      canonical: locale === "en" ? "/automation" : `/${locale}/automation`,
    },
  };
}

export default function AutomationPage() {
  return <OfferPage slug="automation" />;
}
