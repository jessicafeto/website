/**
 * The three noova engagements, presented as outcomes rather than a menu.
 *
 * This is the single source of truth for the offer pages (/branding,
 * /websites, /marketing). The service names here mirror the "What We Build"
 * section (see messages/en.json → services), so the homepage and the offer
 * pages describe the same offering in the same words.
 * To change a price, a headline, or what's included, edit it here — nothing
 * else needs to change.
 */

export type Phase = { n: string; title: string; body: string };
export type Group = { label: string; items: string[] };

/**
 * A pricing tier. Prices are all "from" figures — change them here and they
 * update on the page automatically. `featured` highlights the recommended one.
 */
export type Tier = {
  name: string;
  price: string;
  /** One line on who it's for. */
  summary: string;
  /**
   * The name of the tier this one builds on. When set, the page shows
   * "Everything in {builds}, plus" above the scope, so higher tiers stay
   * complete without repeating every lower-tier line.
   */
  builds?: string;
  /** Everything this package includes (for a `builds` tier, the additions). */
  scope: string[];
  featured?: boolean;
};

export type Offer = {
  slug: "branding" | "websites" | "marketing";
  /** Small label above the title. */
  eyebrow: string;
  /** The pillar name, as used in navigation and cross-links. */
  name: string;
  /** The outcome headline — serif italic, the promise, not the deliverable. */
  headline: string;
  /** The one-paragraph offer summary. */
  offer: string;
  /** Duration / cadence, shown beside the entry price in the hero. */
  cadence: string;
  /** The transformation — before → after, in noova's voice. */
  shift: { heading: string; body: string };
  /** Three packages — Essential, Signature (featured), Bespoke. */
  tiers: Tier[];
  /** What's inside — mirrors the "What We Build" categories for this pillar. */
  includes: Group[];
  /** How the work unfolds. */
  process: Phase[];
};

export const OFFERS: Record<Offer["slug"], Offer> = {
  branding: {
    slug: "branding",
    eyebrow: "Engagement 01",
    name: "Branding",
    headline: "A brand that finally matches the business behind it.",
    offer:
      "A six-to-eight-week, end-to-end brand build — complete strategy, creative direction, and a visual identity system — designed to launch your brand with clarity, confidence, and a luxury presence.",
    cadence: "6–8 weeks",
    shift: {
      heading: "The shift",
      body: "Businesses of real quality are rarely broken — they're scattered, their best work spread across parts that were never designed to work together. We don't decorate; we clarify. We begin at the core — what your business is, what it believes, and why it matters — and let everything visible grow from there. You leave with one coherent system instead of disconnected parts, and the confidence to stop apologising for how you look.",
    },
    tiers: [
      {
        name: "Essential",
        price: "From £1,800",
        summary: "A clear, confident core for a business finding its feet.",
        scope: [
          "Brand strategy — mission, values, audience",
          "Positioning",
          "Visual identity — primary logo & core system",
          "Brand guidelines (mini PDF)",
          "All logo & asset files",
        ],
      },
      {
        name: "Signature",
        price: "From £3,200",
        summary: "The full end-to-end brand build — strategy to identity.",
        builds: "Essential",
        scope: [
          "Naming & messaging",
          "Tone of voice",
          "Creative direction",
          "Full visual identity — logo suite, colour & type",
          "Comprehensive brand guidelines",
          "Social media brand kit",
          "Launch & rollout plan",
        ],
        featured: true,
      },
      {
        name: "Bespoke",
        price: "From £6,000",
        summary: "A landmark brand, crafted without limits.",
        builds: "Signature",
        scope: [
          "Photography & art direction",
          "Custom illustration or motion identity",
          "Packaging or print collateral",
          "Extended, printed brand book",
          "Post-launch brand support",
        ],
      },
    ],
    includes: [
      {
        label: "Brand & Identity",
        items: [
          "Brand strategy",
          "Positioning",
          "Naming & messaging",
          "Visual identity",
          "Brand guidelines",
          "Tone of voice",
          "Creative direction",
        ],
      },
    ],
    process: [
      {
        n: "01",
        title: "Immersion",
        body: "We start beneath the surface — understanding the business, its audience, and the truth it's built on. Strategy before anything visible.",
      },
      {
        n: "02",
        title: "Strategy",
        body: "The foundation is set: positioning, messaging, and voice — the thinking every visible decision will grow from.",
      },
      {
        n: "03",
        title: "Creative direction",
        body: "The world takes shape. Art direction and visual language, explored and agreed before a single asset is finalised.",
      },
      {
        n: "04",
        title: "Identity system",
        body: "The complete system — logo suite, typography, colour, and the guidelines that keep it coherent everywhere it appears.",
      },
      {
        n: "05",
        title: "Launch",
        body: "A considered rollout plan and a full handover, so the brand arrives with intention rather than noise.",
      },
    ],
  },

  websites: {
    slug: "websites",
    eyebrow: "Engagement 02",
    name: "Websites",
    headline: "A website as considered as the brand behind it.",
    offer:
      "A refined four-to-eight-week digital build that transforms your brand into an elevated, seamless website — crafted with intentional design, strategic structure, and a world-class user experience.",
    cadence: "4–8 weeks",
    shift: {
      heading: "The shift",
      body: "Most websites quietly undersell the business behind them — busy where they should be clear, decorative where they should be structural. We design the opposite: a calm, editorial experience that guides the right people through a single, deliberate story. Fast, considered, and unmistakably yours — a home that finally carries the brand instead of diminishing it.",
    },
    tiers: [
      {
        name: "Essential",
        price: "From £1,500",
        summary: "A refined, compact site that reads beautifully.",
        scope: [
          "Website strategy",
          "Website design — editorial",
          "Landing pages — up to 3 pages",
          "SEO foundations",
          "Launch + 1 week of support",
        ],
      },
      {
        name: "Signature",
        price: "From £2,800",
        summary: "The full editorial website, built to perform.",
        builds: "Essential",
        scope: [
          "UX & information architecture",
          "Webflow development",
          "Up to ~6 custom pages",
          "CMS — blog / journal",
          "Integrations & analytics",
          "Performance optimisation",
          "2 weeks of support + walkthrough",
        ],
        featured: true,
      },
      {
        name: "Bespoke",
        price: "From £5,000",
        summary: "A larger, tailored build with room to grow.",
        builds: "Signature",
        scope: [
          "E-commerce or booking system",
          "Advanced interactions & motion",
          "Custom CMS collections",
          "Multi-language ready",
          "CRM & marketing-automation integrations",
          "Optional maintenance retainer",
        ],
      },
    ],
    includes: [
      {
        label: "Websites",
        items: [
          "Website strategy",
          "UX & information architecture",
          "Website design",
          "Webflow development",
          "Landing pages",
          "SEO foundations",
          "Performance optimisation",
        ],
      },
    ],
    process: [
      {
        n: "01",
        title: "Discovery",
        body: "Goals, audience, and content, understood first. We agree what the website has to achieve before we design a single screen.",
      },
      {
        n: "02",
        title: "Strategy & structure",
        body: "Sitemap, information architecture, and content hierarchy — the quiet skeleton that makes the whole experience feel effortless.",
      },
      {
        n: "03",
        title: "Design",
        body: "Editorial, brand-aligned page design. One idea leads each screen, never several competing for the eye.",
      },
      {
        n: "04",
        title: "Build",
        body: "Development, integrations, SEO foundations, and performance — engineered to be fast, accessible, and easy to run.",
      },
      {
        n: "05",
        title: "Launch & support",
        body: "Careful QA, a smooth launch, and aftercare — plus a walkthrough so you're never left guessing how it works.",
      },
    ],
  },

  marketing: {
    slug: "marketing",
    eyebrow: "Engagement 03",
    name: "Marketing & Growth",
    headline: "A presence worth returning to.",
    offer:
      "An ongoing marketing partnership that turns your brand into a living publication — uniting editorial content, considered campaigns, and intelligent systems into one coherent presence, designed to reach the right people, build lasting trust, and grow with intention rather than noise.",
    cadence: "Ongoing partnership",
    shift: {
      heading: "The shift",
      body: "Most marketing is made to fill a schedule — louder, faster, forgotten by morning. We build the opposite: a body of work worth returning to. Every channel becomes one edition of the same publication, carrying a single voice and level of care. Presence over frequency, meaning over volume — a brand that speaks when it has something worth saying, and grows because of it.",
    },
    tiers: [
      {
        name: "Essential",
        price: "From £900 / month",
        summary: "A steady, considered presence on one channel.",
        scope: [
          "Content strategy",
          "Social media strategy — one channel",
          "Content calendars",
          "Copywriting",
          "8–10 posts / month",
          "Marketing analytics — monthly report",
        ],
      },
      {
        name: "Signature",
        price: "From £1,500 / month",
        summary: "The publication, plus campaigns that land.",
        builds: "Essential",
        scope: [
          "Editorial planning",
          "Photography direction",
          "Campaign concepts & launch planning",
          "Email marketing",
          "12–16 posts / month + stories — two channels",
          "GA4 & Looker Studio dashboard",
        ],
        featured: true,
      },
      {
        name: "Bespoke",
        price: "From £2,800 / month",
        summary: "A full growth partnership with systems behind it.",
        builds: "Signature",
        scope: [
          "AI-assisted content production",
          "Influencer partnerships & creator collaborations",
          "Marketing automation & CRM implementation",
          "Lead generation systems",
          "Conversion optimisation",
          "Growth roadmaps",
        ],
      },
    ],
    includes: [
      {
        label: "Content",
        items: [
          "Content strategy",
          "Editorial planning",
          "Social media strategy",
          "Content calendars",
          "Copywriting",
          "Photography direction",
          "AI-assisted content production",
        ],
      },
      {
        label: "Campaigns",
        items: [
          "Marketing strategy",
          "Launch planning",
          "Campaign concepts",
          "Influencer partnerships",
          "Creator collaborations",
          "Brand activations",
          "Community building",
        ],
      },
      {
        label: "Growth",
        items: [
          "Marketing analytics",
          "GA4 & Looker Studio",
          "CRM strategy",
          "Email marketing",
          "Conversion optimisation",
          "Reporting dashboards",
          "Growth roadmaps",
        ],
      },
      {
        label: "AI & Systems",
        items: [
          "AI workflows",
          "Marketing automation",
          "CRM implementation",
          "Business systems",
          "Customer journeys",
          "Lead generation systems",
          "Process optimisation",
        ],
      },
    ],
    process: [
      {
        n: "01",
        title: "Foundation",
        body: "We audit where you stand — voice, channels, and measurement — and define the themes the work will keep returning to.",
      },
      {
        n: "02",
        title: "The publication",
        body: "A content strategy and editorial calendar noova can hold for years, not weeks — the same voice across every channel.",
      },
      {
        n: "03",
        title: "Campaigns",
        body: "Considered launches, concepts, and collaborations — moments of intent rather than a constant, anxious stream.",
      },
      {
        n: "04",
        title: "Systems",
        body: "The intelligent layer beneath it all — automation, CRM, and analytics that turn attention into relationships.",
      },
      {
        n: "05",
        title: "Rhythm",
        body: "An ongoing partnership: publishing, reviewing, and refining — compounding presence and trust over time.",
      },
    ],
  },
};

/** Ordered list, for the home-page block and cross-links. */
export const OFFER_ORDER: Offer["slug"][] = [
  "branding",
  "websites",
  "marketing",
];
