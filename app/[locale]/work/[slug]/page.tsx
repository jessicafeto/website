import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/CaseStudyPage";
import { getCaseStudy, CASE_ORDER } from "@/content/caseStudies";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Only listed projects have pages; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const cs = CASE_ORDER.includes(slug) ? getCaseStudy(locale, slug) : undefined;
  if (!cs) return {};
  return {
    title: `${cs.name} — Selected Work`,
    description: `${cs.category}. ${cs.overviewHeading}`,
    alternates: {
      canonical: locale === "en" ? `/work/${slug}` : `/${locale}/work/${slug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!CASE_ORDER.includes(slug)) notFound();
  return <CaseStudyPage slug={slug} />;
}
