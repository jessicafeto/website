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
    title: sq ? "Politika e Privatësisë" : "Privacy Policy",
    description: sq
      ? "Si noova mbledh, përdor dhe mbron të dhënat tuaja personale, dhe të drejtat që keni sipas GDPR-së së Mbretërisë së Bashkuar dhe BE-së."
      : "How noova collects, uses and protects your personal data, and the rights you have under the UK GDPR and EU GDPR.",
    alternates: { canonical: locale === "en" ? "/privacy" : `/${locale}/privacy` },
  };
}

export default async function PrivacyPolicyPage() {
  const sq = (await getLocale()) === "sq";
  return (
    <LegalLayout
      title={sq ? "Politika e Privatësisë" : "Privacy Policy"}
      eyebrow={sq ? "Ligjore" : "Legal"}
      updatedLabel={sq ? "Përditësuar më Tetor 2026" : "Last updated October 2026"}
    >
      {sq ? <PrivacySq /> : <PrivacyEn />}
    </LegalLayout>
  );
}

function PrivacyEn() {
  return (
    <>
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
          <strong>The Brand &amp; Growth Audit.</strong> If you request your
          full audit results, we collect your email address and, if you choose
          to give them, your first name, business name, website, type of
          business and main challenge, together with your answers, scores and
          how you arrived at the audit (for example, a link from Instagram). You
          can see your score without giving us any details. Your answers are
          kept in your own browser while you complete the audit, so you can
          resume; no contact details are stored there.
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
          To create and send the audit report you request, and keep a record of
          your results so we can discuss them with you if you get in touch.
        </li>
        <li>
          To send occasional marketing emails, only if you tick the optional box
          on the audit form. You can unsubscribe at any time using the link in
          every marketing email, or by emailing us. Getting your report never
          depends on agreeing to marketing.
        </li>
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
        contact us or request your audit report; on your{" "}
        <strong>consent</strong> for marketing emails; and on our legitimate
        interest in keeping the site secure and functioning for essential
        cookies.
      </P>

      <H2>Who we share it with</H2>
      <P>
        We do not sell your data. We use a small number of trusted processors who
        act on our instructions:
      </P>
      <UL>
        <li>
          <strong>Formspree</strong> — delivers contact-form and audit
          submissions to us.
        </li>
        <li>
          <strong>Brevo</strong> — stores audit contacts and results, records
          marketing consent and sends marketing emails to those who agreed.
        </li>
        <li>
          <strong>Resend</strong> — sends the audit results email you request.
        </li>
        <li>
          <strong>Google Analytics &amp; Google Tag Manager, Microsoft
          Clarity</strong> — website analytics, loaded only with your analytics
          consent. Audit events never include your name, email or business.
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
        request and for a reasonable period afterwards. Audit details and
        results are kept for 12 months and then deleted, unless you have agreed
        to marketing emails, in which case we keep them until you unsubscribe.
        Your private results link stops working after 12 months. Analytics and marketing
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
    </>
  );
}

function PrivacySq() {
  return (
    <>
      <P>
        Kjo politikë shpjegon si noova (&ldquo;ne&rdquo;) mbledh, përdor dhe
        mbron të dhënat tuaja personale, si dhe të drejtat që keni. Ne jemi
        kontrolluesi i të dhënave për informacionin e përshkruar këtu. Ajo është
        hartuar në përputhje me GDPR-në e Mbretërisë së Bashkuar dhe GDPR-në e
        BE-së.
      </P>

      <H2>Kush jemi ne</H2>
      <P>
        noova është një studio brandingu, uebsajtesh dhe marketingu me bazë në
        Londër, Mbretëria e Bashkuar, me një studio në Tiranë, Shqipëri. Për çdo
        pyetje mbi privatësinë, ose për të ushtruar të drejtat tuaja, na
        kontaktoni në{" "}
        <a
          href="mailto:hello@noovadata.com"
          className="text-oxblood underline underline-offset-2 hover:opacity-70"
        >
          hello@noovadata.com
        </a>
        .
      </P>

      <H2>Çfarë mbledhim</H2>
      <UL>
        <li>
          <strong>Informacioni që na jepni.</strong> Kur përdorni formularin tonë
          të kontaktit, mbledhim emrin, adresën tuaj të email-it, kompaninë dhe
          detajet e kërkesës suaj.
        </li>
        <li>
          <strong>Informacioni i mbledhur automatikisht.</strong> Me pëlqimin
          tuaj, përdorim cookie analitike dhe të marketingut që mbledhin të dhëna
          përdorimi, si faqet e shikuara, vendndodhjen e përafërt, pajisjen dhe
          shfletuesin. Shihni{" "}
          <a
            href="/sq/cookies"
            className="text-oxblood underline underline-offset-2 hover:opacity-70"
          >
            Politikën tonë të Cookie-ve
          </a>
          .
        </li>
      </UL>

      <H2>Si i përdorim të dhënat tuaja</H2>
      <UL>
        <li>
          Për t&rsquo;iu përgjigjur kërkesës suaj dhe për të ofruar shërbimet që
          kërkoni.
        </li>
        <li>
          Për të kuptuar dhe përmirësuar mënyrën si përdoret uebsajti (vetëm me
          pëlqimin tuaj).
        </li>
        <li>
          Për të matur dhe, kur është e rëndësishme, për të realizuar marketing
          (vetëm me pëlqimin tuaj).
        </li>
      </UL>

      <H2>Bazat ligjore</H2>
      <P>
        Ne mbështetemi te <strong>pëlqimi</strong> juaj për cookie-t analitike
        dhe të marketingut; te domosdoshmëria për të ndërmarrë hapa me kërkesën
        tuaj dhe te <strong>interesi ynë legjitim</strong> për t&rsquo;iu
        përgjigjur kërkesave kur na kontaktoni; dhe te interesi ynë legjitim për
        ta mbajtur faqen të sigurt dhe funksionale për cookie-t thelbësore.
      </P>

      <H2>Me kë i ndajmë</H2>
      <P>
        Ne nuk i shesim të dhënat tuaja. Përdorim një numër të vogël përpunuesish
        të besuar, që veprojnë sipas udhëzimeve tona:
      </P>
      <UL>
        <li>
          <strong>Formspree</strong> — na dorëzon dërgesat e formularit të
          kontaktit dhe të vlerësimit (Brand &amp; Growth Audit).
        </li>
        <li>
          <strong>Brevo</strong> — ruan kontaktet dhe rezultatet e vlerësimit,
          regjistron pëlqimin për marketing dhe dërgon email-e marketingu vetëm
          te ata që kanë dhënë pëlqimin.
        </li>
        <li>
          <strong>Resend</strong> — dërgon email-in me rezultatet e vlerësimit që
          kërkoni.
        </li>
        <li>
          <strong>Google Analytics &amp; Google Tag Manager, Microsoft
          Clarity</strong> — analitikë e uebsajtit, e ngarkuar vetëm me pëlqimin
          tuaj analitik.
        </li>
        <li>
          <strong>Meta Pixel, LinkedIn Insight Tag</strong> — matje marketingu, e
          ngarkuar vetëm me pëlqimin tuaj për marketing.
        </li>
      </UL>

      <H2>Transferimet ndërkombëtare</H2>
      <P>
        Disa nga këta ofrues janë të vendosur jashtë Mbretërisë së Bashkuar/ZEE-së.
        Kur të dhënat transferohen ndërkombëtarisht, ato mbrohen me masa të
        përshtatshme mbrojtëse, si Marrëveshja Ndërkombëtare e Transferimit të të
        Dhënave e Mbretërisë së Bashkuar ose Klauzolat Standarde Kontraktuale të
        BE-së.
      </P>

      <H2>Sa kohë i mbajmë</H2>
      <P>
        Korrespondenca e kërkesave mbahet vetëm aq kohë sa nevojitet për të
        trajtuar kërkesën tuaj dhe për një periudhë të arsyeshme më pas. Të dhënat
        dhe rezultatet e vlerësimit ruhen për 12 muaj dhe më pas fshihen, përveç
        nëse keni pranuar email-e marketingu; në atë rast i ruajmë derisa të
        çregjistroheni. Të dhënat
        analitike dhe të marketingut ruhen sipas cilësimeve të secilit ofrues dhe
        pëlqimit tuaj.
      </P>

      <H2>Të drejtat tuaja</H2>
      <P>
        Ju keni të drejtën të aksesoni, korrigjoni, fshini, kufizoni ose
        kundërshtoni përpunimin e të dhënave tuaja, të drejtën e transportueshmërisë
        së të dhënave dhe të tërhiqni pëlqimin në çdo kohë (përfshirë përmes
        lidhjes &ldquo;Cilësimet e Cookie-ve&rdquo; në fund të faqes). Për të
        ushtruar ndonjë prej tyre, dërgoni email te{" "}
        <a
          href="mailto:hello@noovadata.com"
          className="text-oxblood underline underline-offset-2 hover:opacity-70"
        >
          hello@noovadata.com
        </a>
        . Gjithashtu mund të ankoheni pranë Zyrës së Komisionerit për Informacion
        të Mbretërisë së Bashkuar (ico.org.uk) ose autoritetit tuaj vendor
        mbikëqyrës.
      </P>

      <H2>Ndryshimet</H2>
      <P>
        Ne mund ta përditësojmë këtë politikë herë pas here. Data më sipër tregon
        kur është rishikuar për herë të fundit.
      </P>
    </>
  );
}
