import type { Metadata } from "next";
import CaseStudyPage from "@/components/CaseStudyPage";
import { getCaseStudy, CASE_ORDER } from "@/content/caseStudies";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return CASE_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const cs = getCaseStudy(locale, slug);
  if (!cs) return {};
  return {
    title: `${cs.name} — Selected Work`,
    description: cs.intro,
    alternates: {
      canonical: locale === "en" ? `/work/${slug}` : `/${locale}/work/${slug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CaseStudyPage slug={slug} />;
}
