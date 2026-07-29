import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/home/Footer";
import BrandAudit from "@/components/BrandAudit";

export const metadata: Metadata = {
  title: "The Brand Coherence Audit",
  description:
    "Most brands aren't broken — just scattered. A free three-minute audit to see how coherent your brand really is, and where it could be made whole.",
  alternates: { canonical: "/audit" },
};

export default function AuditPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <section className="wrap pt-[calc(82px+clamp(3.5rem,10vh,7rem))] pb-[clamp(5rem,12vh,9rem)]">
          <BrandAudit />
        </section>
      </main>
      <Footer />
    </>
  );
}
