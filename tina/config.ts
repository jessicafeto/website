import { defineConfig } from "tinacms";

// A short helper set so the (large) translation schema stays readable.
type F = Record<string, unknown>;
const s = (name: string, label?: string): F => ({
  type: "string",
  name,
  label: label ?? name,
});
const ml = (name: string, label?: string): F => ({
  type: "string",
  name,
  label: label ?? name,
  ui: { component: "textarea" },
});
const grp = (name: string, label: string, fields: F[]): F => ({
  type: "object",
  name,
  label,
  fields,
});

/**
 * Every key in messages/en.json and messages/sq.json, so the whole schema is
 * covered (Tina only writes fields it knows about). Both language files share
 * this shape, so one field list drives both documents.
 */
const messageFields: F[] = [
  grp("meta", "Meta / SEO", [s("title"), ml("description"), ml("ogDescription")]),
  grp("nav", "Navigation", [s("aboutStudio"), s("portfolio"), s("services"), s("contact")]),
  grp("hero", "Hero", [s("service1"), s("service2"), s("service3"), ml("tagline"), s("scroll")]),
  grp("welcome", "Welcome", [s("label"), ml("heading"), ml("intro"), ml("brandDesc"), ml("websitesDesc"), ml("growthDesc")]),
  grp("founder", "Founder", [s("label"), s("headingA"), s("headingB"), ml("p1"), ml("p2"), ml("p3"), s("cta")]),
  grp("services", "Services", [
    s("label"),
    {
      type: "object",
      name: "categories",
      label: "Categories",
      list: true,
      fields: [s("t", "Name"), { type: "string", name: "d", label: "Items", list: true }],
    },
  ]),
  grp("work", "Work", [s("label"), s("viewAll"), s("meta01"), s("meta02"), s("meta03"), s("meta04"), s("meta05"), s("meta06")]),
  grp("contact", "Contact", [ml("heading"), ml("intro"), s("fieldName"), s("fieldEmail"), s("fieldCompany"), s("fieldProject"), s("submit"), s("sending"), ml("sent"), ml("error"), s("location")]),
  grp("footer", "Footer", [ml("tagline"), ml("description"), s("navHeading"), s("home"), s("services"), s("portfolio"), s("journal"), s("contact"), s("connectHeading"), s("londonHeading"), s("tiranaHeading"), s("privacy"), s("cookiePolicy"), s("cookieSettings"), s("rights"), s("studioLabel")]),
  grp("cookieBanner", "Cookie banner", [s("title"), ml("body"), s("acceptAll"), s("reject"), s("preferences")]),
  grp("cookieModal", "Cookie modal", [s("title"), ml("intro"), s("close"), s("closeAria"), s("essentialName"), ml("essentialDesc"), s("essentialAria"), s("analyticsName"), ml("analyticsDesc"), s("analyticsAria"), s("marketingName"), ml("marketingDesc"), s("marketingAria"), s("acceptAll"), s("save")]),
  grp("clients", "Clients", [s("label")]),
  grp("offer", "Offer pages (labels)", [
    s("startProject"), s("whatIs"), s("timeline"), s("booking"), s("investment"),
    s("packages"), ml("packagesIntro"), s("mostChosen"), s("everythingIn"), s("enquireShort"),
    s("whatsInside"), s("howItUnfolds"), s("glimpseLabel"), s("viewProjects"), s("faqHeading"),
    s("begin"), s("enquireHeading"), ml("enquireIntro"), s("location"), s("otherEngagements"),
    grp("form", "Enquiry form", [s("name"), s("email"), s("business"), s("timeline"), s("budget"), s("submit"), s("sending"), ml("sent"), ml("error")]),
  ]),
  grp("studio", "Studio page", [s("metaTitle"), ml("metaDesc"), s("eyebrow"), ml("headline"), ml("intro"), s("h1"), ml("p1"), s("h2"), ml("p2"), s("h3"), ml("p3"), s("h4"), ml("p4"), s("storyCta"), s("contactCta")]),
];

export default defineConfig({
  branch: "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  token: process.env.TINA_TOKEN!,
  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "uploads", publicFolder: "public" } },
  schema: {
    collections: [
      {
        name: "translations",
        label: "Site text",
        path: "messages",
        format: "json",
        // en.json + sq.json show up as two documents ("English" / "Albanian").
        fields: messageFields,
        ui: { allowedActions: { create: false, delete: false } },
      },
    ],
  },
});
