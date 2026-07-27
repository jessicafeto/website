import type { Metadata } from "next";
import { LegalLayout, H2, P, UL } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "What cookies noova uses, why, and how to control them. Non-essential cookies load only with your consent.",
};

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="July 2026">
      <P>
        Cookies are small files stored on your device that help a website work
        and provide information to its owners. This policy explains which cookies
        we use and how you control them. Non-essential cookies load{" "}
        <strong>only after you consent</strong>.
      </P>

      <H2>The categories we use</H2>
      <UL>
        <li>
          <strong>Essential.</strong> Needed for the site to function — for
          example, remembering your cookie choice. These are always on and cannot
          be switched off.
        </li>
        <li>
          <strong>Analytics.</strong> Help us understand, in aggregate, how the
          site is used so we can improve it. Off until you allow them.
        </li>
        <li>
          <strong>Marketing.</strong> Help us measure campaigns and show relevant
          work on other platforms. Off until you allow them.
        </li>
      </UL>

      <H2>The tools we may use</H2>
      <P>Each of these loads only if you consent to its category:</P>
      <UL>
        <li>
          <strong>Google Analytics 4 &amp; Google Tag Manager</strong> (analytics)
          — measure website usage.
        </li>
        <li>
          <strong>Microsoft Clarity</strong> (analytics) — anonymised insight into
          how pages are used.
        </li>
        <li>
          <strong>Meta Pixel</strong> (marketing) — campaign measurement across
          Meta platforms.
        </li>
        <li>
          <strong>LinkedIn Insight Tag</strong> (marketing) — campaign measurement
          on LinkedIn.
        </li>
      </UL>

      <H2>Managing your choice</H2>
      <P>
        When you first visit, a banner lets you accept all, reject non-essential,
        or set your preferences. You can change your decision at any time using
        the <strong>&ldquo;Cookie Settings&rdquo;</strong> link in the footer. You
        can also block or delete cookies through your browser settings, though the
        site may not work as intended without essential cookies.
      </P>

      <H2>Changes</H2>
      <P>
        We may update this policy as the tools we use change. The date above shows
        when it was last revised. For more on how we handle personal data, see our{" "}
        <a
          href="/privacy"
          className="text-oxblood underline underline-offset-2 hover:opacity-70"
        >
          Privacy Policy
        </a>
        .
      </P>

      <P>
        <em>
          This document is a template provided for implementation. Please have it
          reviewed by a qualified legal professional before publishing.
        </em>
      </P>
    </LegalLayout>
  );
}
