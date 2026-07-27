import type { Metadata } from "next";
import { LegalLayout, H2, P, UL } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How noova collects, uses and protects your personal data, and the rights you have under the UK GDPR and EU GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="July 2026">
      <P>
        This policy explains how noova (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
        collects, uses and protects your personal data, and the rights you have.
        We are the data controller for the information described here. It is
        written to align with the UK GDPR and the EU GDPR.
      </P>

      <H2>Who we are</H2>
      <P>
        noova is a branding, websites and marketing studio based in London,
        United Kingdom, with a studio in Tirana, Albania. For any privacy
        question, or to exercise your rights, contact us at{" "}
        <a
          href="mailto:hello@noovadata.com"
          className="text-oxblood underline underline-offset-2 hover:opacity-70"
        >
          hello@noovadata.com
        </a>
        .
      </P>

      <H2>What we collect</H2>
      <UL>
        <li>
          <strong>Information you give us.</strong> When you use our contact form
          we collect your name, email address, company and the details of your
          enquiry.
        </li>
        <li>
          <strong>Information collected automatically.</strong> With your consent,
          we use analytics and marketing cookies that collect usage data such as
          pages viewed, approximate location, device and browser. See our{" "}
          <a
            href="/cookies"
            className="text-oxblood underline underline-offset-2 hover:opacity-70"
          >
            Cookie Policy
          </a>
          .
        </li>
      </UL>

      <H2>How we use your data</H2>
      <UL>
        <li>To respond to your enquiry and provide the services you ask for.</li>
        <li>
          To understand and improve how the website is used (only with your
          consent).
        </li>
        <li>
          To measure and, where relevant, deliver marketing (only with your
          consent).
        </li>
      </UL>

      <H2>Legal bases</H2>
      <P>
        We rely on your <strong>consent</strong> for analytics and marketing
        cookies; on the necessity to take steps at your request and our{" "}
        <strong>legitimate interest</strong> in responding to enquiries when you
        contact us; and on our legitimate interest in keeping the site secure and
        functioning for essential cookies.
      </P>

      <H2>Who we share it with</H2>
      <P>
        We do not sell your data. We use a small number of trusted processors who
        act on our instructions:
      </P>
      <UL>
        <li>
          <strong>Formspree</strong> — delivers contact-form submissions to us.
        </li>
        <li>
          <strong>Google Analytics &amp; Google Tag Manager, Microsoft
          Clarity</strong> — website analytics, loaded only with your analytics
          consent.
        </li>
        <li>
          <strong>Meta Pixel, LinkedIn Insight Tag</strong> — marketing
          measurement, loaded only with your marketing consent.
        </li>
      </UL>

      <H2>International transfers</H2>
      <P>
        Some of these providers are based outside the UK/EEA. Where data is
        transferred internationally, it is protected by appropriate safeguards
        such as the UK International Data Transfer Agreement or the EU Standard
        Contractual Clauses.
      </P>

      <H2>How long we keep it</H2>
      <P>
        Enquiry correspondence is kept only as long as needed to deal with your
        request and for a reasonable period afterwards. Analytics and marketing
        data is retained according to each provider&rsquo;s settings and your
        consent.
      </P>

      <H2>Your rights</H2>
      <P>
        You have the right to access, correct, erase, restrict or object to the
        processing of your data, to data portability, and to withdraw consent at
        any time (including via the &ldquo;Cookie Settings&rdquo; link in our
        footer). To exercise any of these, email{" "}
        <a
          href="mailto:hello@noovadata.com"
          className="text-oxblood underline underline-offset-2 hover:opacity-70"
        >
          hello@noovadata.com
        </a>
        . You may also complain to the UK Information Commissioner&rsquo;s Office
        (ico.org.uk) or your local supervisory authority.
      </P>

      <H2>Changes</H2>
      <P>
        We may update this policy from time to time. The date above shows when it
        was last revised.
      </P>

      <P>
        <em>
          This document is a template provided for implementation. Please have it
          reviewed by a qualified legal professional and complete your company
          details before publishing.
        </em>
      </P>
    </LegalLayout>
  );
}
