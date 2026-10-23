import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import AuditApp from "@/components/audit/AuditApp";
import { resendConfigured } from "@/lib/audit/email";
import { tokensEnabled } from "@/lib/audit/token";

export const metadata: Metadata = {
  title: "Free Brand & Growth Audit for small businesses",
  description:
    "Thirty questions across six areas of your business, from your brand and website to client retention and time-saving systems. See your score instantly, then get a personalised report and 30-day plan.",
  alternates: { canonical: "/brand-growth-audit" },
  openGraph: {
    title: "The Small Business Brand & Growth Audit",
    description:
      "A free ten-minute self-assessment with instant scores, three priorities and a 30-day plan.",
    url: "/brand-growth-audit",
  },
};

export default async function BrandGrowthAuditPage() {
  const sq = (await getLocale()) === "sq";
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-paper">
        {sq && (
          <p className="eyebrow fixed inset-x-0 top-[82px] z-[110] bg-oxblood py-2 text-center text-white">
            Ky vlerësim është aktualisht vetëm në anglisht
          </p>
        )}
        {/* Only promise an emailed report when email delivery is actually set up. */}
        <AuditApp emailEnabled={resendConfigured() && tokensEnabled()} />
      </main>
      <Footer />
    </>
  );
}
