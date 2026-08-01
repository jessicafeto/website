import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { LegalLayout, H2, P, UL } from "@/components/legal/LegalLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sq = locale === "sq";
  return {
    title: sq ? "Politika e Cookie-ve" : "Cookie Policy",
    description: sq
      ? "Cilat cookie përdor noova, pse, dhe si t'i kontrolloni. Cookie-t joesenciale ngarkohen vetëm me pëlqimin tuaj."
      : "What cookies noova uses, why, and how to control them. Non-essential cookies load only with your consent.",
    alternates: { canonical: locale === "en" ? "/cookies" : `/${locale}/cookies` },
  };
}

export default async function CookiePolicyPage() {
  const sq = (await getLocale()) === "sq";
  return (
    <LegalLayout
      title={sq ? "Politika e Cookie-ve" : "Cookie Policy"}
      eyebrow={sq ? "Ligjore" : "Legal"}
      updatedLabel={sq ? "Përditësuar më Korrik 2026" : "Last updated July 2026"}
    >
      {sq ? <CookiesSq /> : <CookiesEn />}
    </LegalLayout>
  );
}

function CookiesEn() {
  return (
    <>
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
    </>
  );
}

function CookiesSq() {
  return (
    <>
      <P>
        Cookie-t janë skedarë të vegjël të ruajtur në pajisjen tuaj, që ndihmojnë
        një uebsajt të funksionojë dhe u japin informacion pronarëve të tij. Kjo
        politikë shpjegon cilat cookie përdorim dhe si t&rsquo;i kontrolloni ato.
        Cookie-t joesenciale ngarkohen <strong>vetëm pasi jepni pëlqimin</strong>.
      </P>

      <H2>Kategoritë që përdorim</H2>
      <UL>
        <li>
          <strong>Thelbësore.</strong> Të nevojshme që faqja të funksionojë — për
          shembull, për të kujtuar zgjedhjen tuaj për cookie-t. Këto janë gjithmonë
          aktive dhe nuk mund të çaktivizohen.
        </li>
        <li>
          <strong>Analitike.</strong> Na ndihmojnë të kuptojmë, në përgjithësi, si
          përdoret faqja, që ta përmirësojmë. Të fikura derisa t&rsquo;i lejoni.
        </li>
        <li>
          <strong>Marketingu.</strong> Na ndihmojnë të masim fushatat dhe të
          shfaqim punë relevante në platforma të tjera. Të fikura derisa
          t&rsquo;i lejoni.
        </li>
      </UL>

      <H2>Mjetet që mund të përdorim</H2>
      <P>Secili prej tyre ngarkohet vetëm nëse jepni pëlqimin për kategorinë e tij:</P>
      <UL>
        <li>
          <strong>Google Analytics 4 &amp; Google Tag Manager</strong> (analitike)
          — masin përdorimin e uebsajtit.
        </li>
        <li>
          <strong>Microsoft Clarity</strong> (analitike) — të dhëna të anonimizuara
          mbi mënyrën si përdoren faqet.
        </li>
        <li>
          <strong>Meta Pixel</strong> (marketing) — matje fushatash nëpër platformat
          Meta.
        </li>
        <li>
          <strong>LinkedIn Insight Tag</strong> (marketing) — matje fushatash në
          LinkedIn.
        </li>
      </UL>

      <H2>Menaxhimi i zgjedhjes suaj</H2>
      <P>
        Në vizitën tuaj të parë, një banderolë ju lejon të pranoni të gjitha, të
        refuzoni joesencialet, ose të vendosni preferencat tuaja. Mund ta ndryshoni
        vendimin në çdo kohë duke përdorur lidhjen{" "}
        <strong>&ldquo;Cilësimet e Cookie-ve&rdquo;</strong> në fund të faqes.
        Gjithashtu mund t&rsquo;i bllokoni ose fshini cookie-t përmes cilësimeve të
        shfletuesit tuaj, megjithëse faqja mund të mos funksionojë siç duhet pa
        cookie-t thelbësore.
      </P>

      <H2>Ndryshimet</H2>
      <P>
        Ne mund ta përditësojmë këtë politikë ndërsa ndryshojnë mjetet që përdorim.
        Data më sipër tregon kur është rishikuar për herë të fundit. Për më shumë
        mbi mënyrën si i trajtojmë të dhënat personale, shihni{" "}
        <a
          href="/sq/privacy"
          className="text-oxblood underline underline-offset-2 hover:opacity-70"
        >
          Politikën tonë të Privatësisë
        </a>
        .
      </P>
    </>
  );
}
