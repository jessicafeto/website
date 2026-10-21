import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import FullResults from "@/components/audit/FullResults";
import { verifyToken } from "@/lib/audit/token";
import { score } from "@/lib/audit/scoring";

/**
 * A visitor's private results page, opened from their email. The signed token
 * in ?r= carries their answers (no personal details); it's verified on the
 * server and the scores are recalculated, never read from the URL.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Brand & Growth Audit results",
  robots: { index: false, follow: false },
  // Keep the private token out of the Referer header on outbound links.
  referrer: "no-referrer",
};

export default async function AuditResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  const verified = verifyToken(r);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-paper">
        <div className="wrap pt-[calc(82px+clamp(2.5rem,7vh,5rem))] pb-[clamp(4rem,10vh,7rem)]">
          {verified && r ? (
            <FullResults
              result={score(verified.responses)}
              reportHref={`/api/audit/report?r=${encodeURIComponent(r)}`}
            />
          ) : (
            <div className="mx-auto max-w-[40rem] py-[10vh] text-center">
              <p className="eyebrow text-oxblood">Brand &amp; Growth Audit</p>
              <h1 className="mt-6 font-serif italic text-ink text-[clamp(2rem,4vw,3rem)] leading-[1.1]">
                This results link isn’t working.
              </h1>
              <p className="mt-6 font-sans text-[1.02rem] leading-[1.8] text-grey">
                It may be incomplete, or more than 12 months old. You can take
                the audit again in about ten minutes.
              </p>
              <Link
                href="/brand-growth-audit"
                className="hero-btn hero-btn--oxblood mt-10 inline-block"
              >
                Take the audit
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
