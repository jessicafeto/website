/**
 * The three noova engagements, per locale.
 *
 * English content carries UK (GBP) pricing; Albanian carries Albanian-market
 * (EUR) pricing. Service names in "What's inside" mirror the homepage. Look up
 * an offer with getOffer(locale, slug). Change prices or copy here — nothing
 * else needs to change.
 */

export type Phase = { n: string; title: string; body: string };
export type Group = { label: string; items: string[] };
export type Faq = { q: string; a: string };

export type Tier = {
  name: string;
  price: string;
  summary: string;
  builds?: string;
  scope: string[];
  featured?: boolean;
};

export type Offer = {
  slug: "branding" | "websites" | "marketing";
  eyebrow: string;
  name: string;
  heroImage: string;
  heroAlt: string;
  headline: string;
  offer: string;
  cadence: string;
  booking: string;
  shift: { heading: string; body: string };
  tiers: Tier[];
  includes: Group[];
  process: Phase[];
  faqs: Faq[];
};

export const OFFER_ORDER: Offer["slug"][] = [
  "branding",
  "websites",
  "marketing",
];

const OFFERS_EN: Record<Offer["slug"], Offer> = {
  branding: {
    slug: "branding",
    eyebrow: "Engagement 01",
    name: "Branding",
    heroImage: "/hero/branding.jpg",
    heroAlt:
      "Brand guidelines, paper stocks and typography samples laid across a studio table.",
    headline: "A brand that finally matches the business behind it.",
    offer:
      "A six-to-eight-week, end-to-end brand build — complete strategy, creative direction, and a visual identity system — designed to launch your brand with clarity, confidence, and a luxury presence.",
    cadence: "6–8 weeks",
    booking: "Limited monthly availability",
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
    faqs: [
      {
        q: "Can I customise or mix the packages?",
        a: "Yes. The tiers are starting points — we shape the exact scope together in our first conversation, so you only pay for what your brand genuinely needs.",
      },
      {
        q: "How does payment work?",
        a: "A 50% deposit secures your start date; the balance is due before launch. For larger projects we can split it further.",
      },
      {
        q: "How long does it take?",
        a: "A full Signature build usually runs six to eight weeks, depending on scope and how quickly feedback comes back.",
      },
      {
        q: "What do you need from me to begin?",
        a: "An introduction to your business, your goals, and any existing materials. We guide every step from there.",
      },
      {
        q: "What happens after launch?",
        a: "You receive every file and the brand guidelines, plus a walkthrough. Bespoke adds ongoing post-launch support.",
      },
    ],
  },

  websites: {
    slug: "websites",
    eyebrow: "Engagement 02",
    name: "Websites",
    heroImage: "/hero/websites.jpg",
    heroAlt:
      "A wall of pinned editorial layouts and case-study pages in the noova studio.",
    headline: "A website as considered as the brand behind it.",
    offer:
      "A refined four-to-eight-week digital build that transforms your brand into an elevated, seamless website — crafted with intentional design, strategic structure, and a world-class user experience.",
    cadence: "4–8 weeks",
    booking: "Limited monthly availability",
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
    faqs: [
      {
        q: "Which platform do you build on?",
        a: "Primarily Webflow — fast, reliable, and easy for you to edit. Other platforms are available on request.",
      },
      {
        q: "Can I update the site myself afterwards?",
        a: "Yes. Signature and above include a CMS and a walkthrough, so you can add posts and edit content without a developer.",
      },
      {
        q: "How does payment work?",
        a: "A 50% deposit books your slot; the balance is due before launch.",
      },
      {
        q: "How long does a website take?",
        a: "Between four and eight weeks, depending on the tier and how ready your content is.",
      },
      {
        q: "Do you offer ongoing support?",
        a: "One to two weeks of aftercare is included, and an optional maintenance retainer is available.",
      },
    ],
  },

  marketing: {
    slug: "marketing",
    eyebrow: "Engagement 03",
    name: "Marketing & Growth",
    heroImage: "/hero/marketing.jpg",
    heroAlt:
      "Overhead view of noova journal pages being laid out and edited across a desk.",
    headline: "A presence worth returning to.",
    offer:
      "An ongoing marketing partnership that turns your brand into a living publication — uniting editorial content, considered campaigns, and intelligent systems into one coherent presence, designed to reach the right people, build lasting trust, and grow with intention rather than noise.",
    cadence: "Ongoing partnership",
    booking: "Rolling monthly start",
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
    faqs: [
      {
        q: "Is there a minimum commitment?",
        a: "We ask for an initial three months, so the work has room to compound rather than being judged on a single post.",
      },
      {
        q: "How does billing work?",
        a: "A simple monthly retainer, billed at the start of each month. You can move up or down a tier with a month's notice.",
      },
      {
        q: "Is ad spend included?",
        a: "No — media budget is separate and paid directly to the platforms. We manage the campaigns; you keep control of the spend.",
      },
      {
        q: "Which channels do you cover?",
        a: "Whatever fits your audience — most often Instagram and LinkedIn, plus email and your journal. We focus rather than spread thin.",
      },
      {
        q: "What do you need from me?",
        a: "Access to your channels and a short monthly check-in. We handle strategy, creation, and reporting.",
      },
    ],
  },
};

const OFFERS_SQ: Record<Offer["slug"], Offer> = {
  branding: {
    slug: "branding",
    eyebrow: "Angazhimi 01",
    name: "Branding",
    heroImage: "/hero/branding.jpg",
    heroAlt:
      "Udhëzues brendi, mostra letrash dhe shembuj tipografie të shtrira mbi një tavolinë studioje.",
    headline: "Një markë që më në fund përputhet me biznesin që qëndron pas saj.",
    offer:
      "Një ndërtim i plotë brendi gjashtë deri në tetë javë — strategji e plotë, drejtim kreativ dhe një sistem identiteti vizual — i dizajnuar për ta lançuar markën tuaj me qartësi, besim dhe një prani luksi.",
    cadence: "6–8 javë",
    booking: "Disponueshmëri e kufizuar mujore",
    shift: {
      heading: "Ndryshimi",
      body: "Bizneset me cilësi të vërtetë rrallë janë të prishura — janë të shpërndara, me punën e tyre më të mirë të ndarë nëpër pjesë që kurrë nuk u menduan të funksiononin bashkë. Ne nuk zbukurojmë; ne sqarojmë. Nisim nga thelbi — çfarë është biznesi juaj, çfarë beson dhe pse ka rëndësi — dhe lëmë çdo gjë të dukshme të rritet prej andej. Largoheni me një sistem të vetëm koherent në vend të pjesëve të shkëputura, dhe me besimin për të mos kërkuar më falje për pamjen tuaj.",
    },
    tiers: [
      {
        name: "Essential",
        price: "Nga €700",
        summary: "Një bazë e qartë dhe e sigurt për një biznes që po gjen veten.",
        scope: [
          "Strategji brendi — misioni, vlerat, audienca",
          "Pozicionim",
          "Identitet vizual — logoja parësore & sistemi bazë",
          "Udhëzues brendi (PDF i shkurtër)",
          "Të gjitha skedarët e logos & aseteve",
        ],
      },
      {
        name: "Signature",
        price: "Nga €1,400",
        summary: "Ndërtimi i plotë i brendit — nga strategjia te identiteti.",
        builds: "Essential",
        scope: [
          "Emërtim & mesazhe",
          "Ton zëri",
          "Drejtim kreativ",
          "Identitet vizual i plotë — grup logosh, ngjyra & tipografi",
          "Udhëzues brendi gjithëpërfshirës",
          "Kit brendi për rrjete sociale",
          "Plan lançimi & shpërndarjeje",
        ],
        featured: true,
      },
      {
        name: "Bespoke",
        price: "Nga €2,800",
        summary: "Një markë e paharrueshme, e krijuar pa kufij.",
        builds: "Signature",
        scope: [
          "Fotografi & drejtim artistik",
          "Ilustrim i personalizuar ose identitet në lëvizje",
          "Paketim ose materiale të shtypura",
          "Libër brendi i zgjeruar, i shtypur",
          "Mbështetje brendi pas lançimit",
        ],
      },
    ],
    includes: [
      {
        label: "Brand & Identity",
        items: [
          "Strategji brendi",
          "Pozicionim",
          "Emërtim & mesazhe",
          "Identitet vizual",
          "Udhëzues brendi",
          "Ton zëri",
          "Drejtim kreativ",
        ],
      },
    ],
    process: [
      {
        n: "01",
        title: "Zhytja",
        body: "Nisim nën sipërfaqe — duke kuptuar biznesin, audiencën e tij dhe të vërtetën mbi të cilën është ndërtuar. Strategji para çdo gjëje të dukshme.",
      },
      {
        n: "02",
        title: "Strategjia",
        body: "Vendoset themeli: pozicionimi, mesazhet dhe zëri — mendimi nga i cili rrjedh çdo vendim i dukshëm.",
      },
      {
        n: "03",
        title: "Drejtimi kreativ",
        body: "Bota merr formë. Drejtim artistik dhe gjuhë vizuale, të eksploruara e të rëna dakord para se të finalizohet çdo aset.",
      },
      {
        n: "04",
        title: "Sistemi i identitetit",
        body: "Sistemi i plotë — grup logosh, tipografi, ngjyra dhe udhëzuesit që e mbajnë atë koherent kudo që shfaqet.",
      },
      {
        n: "05",
        title: "Lançimi",
        body: "Një plan i menduar shpërndarjeje dhe një dorëzim i plotë, që marka të mbërrijë me qëllim e jo me zhurmë.",
      },
    ],
    faqs: [
      {
        q: "A mund t'i personalizoj ose kombinoj paketat?",
        a: "Po. Nivelet janë pika nisjeje — fushën e saktë e formësojmë së bashku në bisedën e parë, që të paguani vetëm për atë që i duhet vërtet markës suaj.",
      },
      {
        q: "Si funksionon pagesa?",
        a: "Një depozitë prej 50% e siguron datën e nisjes; pjesa tjetër paguhet para lançimit. Për projekte më të mëdha mund ta ndajmë më tej.",
      },
      {
        q: "Sa zgjat?",
        a: "Një ndërtim i plotë Signature zakonisht zgjat gjashtë deri në tetë javë, në varësi të fushës dhe shpejtësisë së reagimeve.",
      },
      {
        q: "Çfarë ju nevojitet nga unë për të nisur?",
        a: "Një prezantim i biznesit tuaj, qëllimet tuaja dhe çdo material ekzistues. Ne ju udhëheqim në çdo hap.",
      },
      {
        q: "Çfarë ndodh pas lançimit?",
        a: "Merrni të gjitha skedarët dhe udhëzuesit e brendit, plus një udhëzim. Bespoke shton mbështetje pas lançimit.",
      },
    ],
  },

  websites: {
    slug: "websites",
    eyebrow: "Angazhimi 02",
    name: "Websites",
    heroImage: "/hero/websites.jpg",
    heroAlt:
      "Një mur me faqe editoriale dhe raste studimore të fiksuara në studion e noova.",
    headline: "Një uebsajt po aq i menduar sa marka pas tij.",
    offer:
      "Një ndërtim dixhital i rafinuar katër deri në tetë javë që e shndërron markën tuaj në një uebsajt elegant e të qetë — i punuar me dizajn të qëllimshëm, strukturë strategjike dhe një përvojë përdoruesi të klasit botëror.",
    cadence: "4–8 javë",
    booking: "Disponueshmëri e kufizuar mujore",
    shift: {
      heading: "Ndryshimi",
      body: "Shumica e uebsajteve në heshtje e nënvlerësojnë biznesin pas tyre — të ngarkuar aty ku duhet të jenë të qartë, dekorativë aty ku duhet të jenë strukturorë. Ne dizajnojmë të kundërtën: një përvojë të qetë e editoriale që i udhëheq njerëzit e duhur nëpër një histori të vetme e të qëllimshme. E shpejtë, e menduar dhe pa dyshim e juaja — një shtëpi që më në fund e mban markën në vend që ta zvogëlojë.",
    },
    tiers: [
      {
        name: "Essential",
        price: "Nga €500",
        summary: "Një sajt i rafinuar e kompakt që lexohet bukur.",
        scope: [
          "Strategji uebsajti",
          "Dizajn uebsajti — editorial",
          "Faqe uljeje — deri në 3 faqe",
          "Baza SEO",
          "Lançim + 1 javë mbështetje",
        ],
      },
      {
        name: "Signature",
        price: "Nga €1,100",
        summary: "Uebsajti i plotë editorial, i ndërtuar për të performuar.",
        builds: "Essential",
        scope: [
          "UX & arkitekturë informacioni",
          "Zhvillim në Webflow",
          "Deri në ~6 faqe të personalizuara",
          "CMS — blog / ditar",
          "Integrime & analitikë",
          "Optimizim i performancës",
          "2 javë mbështetje + udhëzim",
        ],
        featured: true,
      },
      {
        name: "Bespoke",
        price: "Nga €2,000",
        summary: "Një ndërtim më i madh e i personalizuar, me hapësirë për t'u rritur.",
        builds: "Signature",
        scope: [
          "Sistem e-commerce ose rezervimesh",
          "Ndërveprime & lëvizje të avancuara",
          "Koleksione CMS të personalizuara",
          "Gati për shumë gjuhë",
          "Integrime CRM & automatizim marketingu",
          "Kontratë mirëmbajtjeje opsionale",
        ],
      },
    ],
    includes: [
      {
        label: "Websites",
        items: [
          "Strategji uebsajti",
          "UX & arkitekturë informacioni",
          "Dizajn uebsajti",
          "Zhvillim në Webflow",
          "Faqe uljeje",
          "Baza SEO",
          "Optimizim i performancës",
        ],
      },
    ],
    process: [
      {
        n: "01",
        title: "Zbulimi",
        body: "Së pari kuptohen qëllimet, audienca dhe përmbajtja. Biem dakord çfarë duhet të arrijë uebsajti para se të dizajnojmë një ekran të vetëm.",
      },
      {
        n: "02",
        title: "Strategji & strukturë",
        body: "Harta e faqes, arkitektura e informacionit dhe hierarkia e përmbajtjes — skeleti i qetë që e bën gjithë përvojën të duket pa mund.",
      },
      {
        n: "03",
        title: "Dizajni",
        body: "Dizajn faqesh editorial, në linjë me markën. Një ide udhëheq çdo ekran, kurrë disa që konkurrojnë për syrin.",
      },
      {
        n: "04",
        title: "Ndërtimi",
        body: "Zhvillim, integrime, baza SEO dhe performancë — të projektuara për të qenë të shpejta, të aksesueshme dhe të lehta për t'u përdorur.",
      },
      {
        n: "05",
        title: "Lançim & mbështetje",
        body: "Testim i kujdesshëm, një lançim i qetë dhe kujdes pas tij — plus një udhëzim që të mos mbeteni kurrë në pikëpyetje se si funksionon.",
      },
    ],
    faqs: [
      {
        q: "Në cilën platformë ndërtoni?",
        a: "Kryesisht Webflow — i shpejtë, i besueshëm dhe i lehtë për ta redaktuar. Platforma të tjera me kërkesë.",
      },
      {
        q: "A mund ta përditësoj vetë sajtin më pas?",
        a: "Po. Signature e lart përfshin një CMS dhe një udhëzim, që të shtoni postime e të redaktoni përmbajtjen pa një programues.",
      },
      {
        q: "Si funksionon pagesa?",
        a: "Një depozitë prej 50% e rezervon vendin tuaj; pjesa tjetër paguhet para lançimit.",
      },
      {
        q: "Sa zgjat një uebsajt?",
        a: "Nga katër deri në tetë javë, në varësi të nivelit dhe sa gati është përmbajtja juaj.",
      },
      {
        q: "A ofroni mbështetje të vazhdueshme?",
        a: "Përfshihet një deri në dy javë kujdes pas lançimit, dhe ofrohet një kontratë mirëmbajtjeje opsionale.",
      },
    ],
  },

  marketing: {
    slug: "marketing",
    eyebrow: "Angazhimi 03",
    name: "Marketing & Growth",
    heroImage: "/hero/marketing.jpg",
    heroAlt:
      "Pamje nga lart e faqeve të ditarit noova duke u shtruar e redaktuar mbi një tavolinë.",
    headline: "Një prani te e cila ia vlen të kthehesh.",
    offer:
      "Një partneritet i vazhdueshëm marketingu që e kthen markën tuaj në një botim të gjallë — duke bashkuar përmbajtjen editoriale, fushatat e menduara dhe sistemet inteligjente në një prani të vetme koherente, të projektuar për të arritur njerëzit e duhur, për të ndërtuar besim afatgjatë dhe për t'u rritur me qëllim e jo me zhurmë.",
    cadence: "Partneritet i vazhdueshëm",
    booking: "Nisje mujore e vazhdueshme",
    shift: {
      heading: "Ndryshimi",
      body: "Shumica e marketingut bëhet për të mbushur një kalendar — më i zhurmshëm, më i shpejtë, i harruar deri në mëngjes. Ne ndërtojmë të kundërtën: një trup pune te i cili ia vlen të kthehesh. Çdo kanal bëhet një botim i të njëjtit publikim, që mban një zë e një nivel kujdesi. Prani mbi shpeshtësi, kuptim mbi vëllim — një markë që flet kur ka diçka që ia vlen të thuhet, dhe rritet për shkak të kësaj.",
    },
    tiers: [
      {
        name: "Essential",
        price: "Nga €300 / muaj",
        summary: "Një prani e qëndrueshme e e menduar në një kanal.",
        scope: [
          "Strategji përmbajtjeje",
          "Strategji për rrjete sociale — një kanal",
          "Kalendarë përmbajtjeje",
          "Shkrim tekstesh",
          "8–10 postime / muaj",
          "Analitikë marketingu — raport mujor",
        ],
      },
      {
        name: "Signature",
        price: "Nga €600 / muaj",
        summary: "Publikimi, plus fushata që lënë gjurmë.",
        builds: "Essential",
        scope: [
          "Planifikim editorial",
          "Drejtim fotografie",
          "Koncepte fushatash & planifikim lançimi",
          "Marketing me email",
          "12–16 postime / muaj + storie — dy kanale",
          "Panel GA4 & Looker Studio",
        ],
        featured: true,
      },
      {
        name: "Bespoke",
        price: "Nga €1,200 / muaj",
        summary: "Një partneritet i plotë rritjeje me sisteme pas tij.",
        builds: "Signature",
        scope: [
          "Prodhim përmbajtjeje me ndihmën e AI",
          "Partneritete me influencues & bashkëpunime me krijues",
          "Automatizim marketingu & zbatim CRM",
          "Sisteme për gjenerimin e kontakteve",
          "Optimizim konvertimesh",
          "Plane rritjeje",
        ],
      },
    ],
    includes: [
      {
        label: "Content",
        items: [
          "Strategji përmbajtjeje",
          "Planifikim editorial",
          "Strategji për rrjete sociale",
          "Kalendarë përmbajtjeje",
          "Shkrim tekstesh",
          "Drejtim fotografie",
          "Prodhim përmbajtjeje me ndihmën e AI",
        ],
      },
      {
        label: "Campaigns",
        items: [
          "Strategji marketingu",
          "Planifikim lançimi",
          "Koncepte fushatash",
          "Partneritete me influencues",
          "Bashkëpunime me krijues",
          "Aktivizime brendi",
          "Ndërtim komuniteti",
        ],
      },
      {
        label: "Growth",
        items: [
          "Analitikë marketingu",
          "GA4 & Looker Studio",
          "Strategji CRM",
          "Marketing me email",
          "Optimizim konvertimesh",
          "Panele raportimi",
          "Plane rritjeje",
        ],
      },
      {
        label: "AI & Systems",
        items: [
          "Rrjedha pune me AI",
          "Automatizim marketingu",
          "Zbatim CRM",
          "Sisteme biznesi",
          "Rrugëtimi i klientit",
          "Sisteme për gjenerimin e kontakteve",
          "Optimizim procesesh",
        ],
      },
    ],
    process: [
      {
        n: "01",
        title: "Themeli",
        body: "Vlerësojmë ku ndodheni — zëri, kanalet dhe matja — dhe përcaktojmë temat te të cilat puna do të kthehet vazhdimisht.",
      },
      {
        n: "02",
        title: "Publikimi",
        body: "Një strategji përmbajtjeje dhe kalendar editorial që noova mund ta mbajë për vite, jo javë — i njëjti zë në çdo kanal.",
      },
      {
        n: "03",
        title: "Fushatat",
        body: "Lançime, koncepte dhe bashkëpunime të menduara — momente qëllimi në vend të një rrjedhe të vazhdueshme e ankthioze.",
      },
      {
        n: "04",
        title: "Sistemet",
        body: "Shtresa inteligjente nën gjithçka — automatizim, CRM dhe analitikë që e kthejnë vëmendjen në marrëdhënie.",
      },
      {
        n: "05",
        title: "Ritmi",
        body: "Një partneritet i vazhdueshëm: botim, rishikim dhe përsosje — duke rritur praninë dhe besimin me kalimin e kohës.",
      },
    ],
    faqs: [
      {
        q: "A ka një angazhim minimal?",
        a: "Kërkojmë tre muaj fillestarë, që puna të ketë hapësirë të shtohet e të mos gjykohet nga një postim i vetëm.",
      },
      {
        q: "Si funksionon faturimi?",
        a: "Një tarifë e thjeshtë mujore, e faturuar në fillim të çdo muaji. Mund të lëvizni lart ose poshtë një nivel me një muaj paralajmërim.",
      },
      {
        q: "A përfshihet buxheti i reklamave?",
        a: "Jo — buxheti i medias është i ndarë dhe paguhet drejtpërdrejt te platformat. Ne menaxhojmë fushatat; ju mbani kontrollin e shpenzimit.",
      },
      {
        q: "Cilat kanale mbuloni?",
        a: "Ato që i përshtaten audiencës suaj — më së shpeshti Instagram dhe LinkedIn, plus email dhe ditari juaj. Ne fokusohemi, në vend që të shpërndahemi.",
      },
      {
        q: "Çfarë ju nevojitet nga unë?",
        a: "Qasje te kanalet tuaja dhe një takim i shkurtër mujor. Ne kujdesemi për strategjinë, krijimin dhe raportimin.",
      },
    ],
  },
};

const BY_LOCALE: Record<string, Record<Offer["slug"], Offer>> = {
  en: OFFERS_EN,
  sq: OFFERS_SQ,
};

/** Get an engagement's content for the active locale (falls back to English). */
export function getOffer(locale: string, slug: Offer["slug"]): Offer {
  return (BY_LOCALE[locale] ?? OFFERS_EN)[slug];
}
