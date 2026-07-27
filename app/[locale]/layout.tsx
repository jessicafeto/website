import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { cormorant, lato } from "../fonts";
import { routing, type Locale } from "@/i18n/routing";
import CookieConsent from "@/components/consent/CookieConsent";
import "../globals.css";

/** Pre-render a page for each locale at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Language-specific metadata, plus hreflang alternates for every locale. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  // hreflang alternates derived from the active locale list (auto-updates
  // when a language is added or removed in i18n/routing.ts).
  const languages: Record<string, string> = { "x-default": "/" };
  for (const l of routing.locales) {
    languages[l] = l === routing.defaultLocale ? "/" : `/${l}`;
  }

  return {
    metadataBase: new URL("https://noova.studio"),
    title: { default: t("title"), template: "%s · noova" },
    description: t("description"),
    alternates: { languages },
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      type: "website",
      locale: locale === "sq" ? "sq_AL" : "en_GB",
      siteName: "noova",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Reject unknown locales, and enable static rendering for known ones.
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${cormorant.variable} ${lato.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <CookieConsent>{children}</CookieConsent>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
