"use client";

import Script from "next/script";
import { useConsent } from "./ConsentProvider";

/**
 * Conditionally loads third-party tracking — and only ever after the visitor has
 * consented to the matching category. Each vendor is also gated on an env var, so
 * nothing loads until you add the relevant ID. This is the single place to wire up
 * analytics/marketing tools; the consent gating is handled for you.
 *
 * Add any of these to .env.local to switch a tool on (they are inlined at build
 * time, hence the NEXT_PUBLIC_ prefix):
 *   Analytics category:
 *     NEXT_PUBLIC_GA_ID           e.g. G-XXXXXXXXXX      (Google Analytics 4)
 *     NEXT_PUBLIC_GTM_ID          e.g. GTM-XXXXXXX       (Google Tag Manager)
 *     NEXT_PUBLIC_CLARITY_ID      e.g. xxxxxxxxxx        (Microsoft Clarity)
 *   Marketing category:
 *     NEXT_PUBLIC_META_PIXEL_ID   e.g. 000000000000000   (Meta / Facebook Pixel)
 *     NEXT_PUBLIC_LINKEDIN_ID     e.g. 0000000           (LinkedIn Insight Tag)
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const LINKEDIN_ID = process.env.NEXT_PUBLIC_LINKEDIN_ID;

export default function ConsentScripts() {
  const { consent } = useConsent();
  const analytics = consent?.analytics === true;
  const marketing = consent?.marketing === true;

  return (
    <>
      {/* ---------- Analytics ---------- */}
      {analytics && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}

      {analytics && GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {analytics && CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}

      {/* ---------- Marketing ---------- */}
      {marketing && META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}

      {marketing && LINKEDIN_ID && (
        <Script id="linkedin-insight-init" strategy="afterInteractive">
          {`_linkedin_partner_id="${LINKEDIN_ID}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`}
        </Script>
      )}
    </>
  );
}
