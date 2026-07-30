/**
 * Case studies — one project page per portfolio piece (/work/[slug]).
 *
 * Locale-keyed, same shape as content/offers.ts: edit copy or pricing here and
 * nothing in the components needs to change. Add a project by adding it to
 * CASES_EN + CASES_SQ and to CASE_ORDER, and (optionally) linking a tile in
 * components/home/SelectedWork.tsx.
 *
 * intellimation.ai is a REAL engagement — its copy stays factual (no invented
 * metrics or testimonials). The others are concept / spec brand pieces; their
 * results and quotes are illustrative placeholders meant to be edited.
 */

export type ApproachBlock = { title: string; body: string };
export type Meta = { role: string; year: string; services: string; sector: string };
export type Testimonial = { quote: string; name: string; role: string };

export type CaseStudy = {
  slug: string;
  name: string;
  eyebrow: string;
  heroImage: string;
  heroAlt: string;
  headline: string;
  intro: string;
  statement: string;
  overview: string;
  meta: Meta;
  approach: ApproachBlock[];
  gallery: string[];
  delivered: string[];
  results?: string[];
  testimonial?: Testimonial;
};

export const CASE_ORDER: string[] = [
  "intellimation",
  "seereen",
  "opa-taverne",
  "ame",
  "355",
  "her-club",
];

const CASES_EN: Record<string, CaseStudy> = {
  intellimation: {
    slug: "intellimation",
    name: "intellimation.ai",
    eyebrow: "AI & Technology",
    heroImage: "/img/iai 4.png",
    heroAlt: "intellimation.ai brand and website design by noova",
    headline: "Making an AI company feel as considered as the intelligence it builds.",
    intro:
      "A complete brand and digital foundation for an automation company — turning a fast-moving, technical product into something a business can understand and trust at a glance.",
    statement: "Intelligence, made legible.",
    overview:
      "intellimation.ai builds AI-driven automation for growing businesses. Our brief was to give a technical, fast-moving company a brand and web presence as deliberate as its engineering — credible to buyers, clear to newcomers, and calm in a category that too often shouts.",
    meta: {
      role: "Brand & Website",
      year: "2025",
      services: "Identity · Messaging · Website",
      sector: "AI / Automation",
    },
    approach: [
      {
        title: "The challenge",
        body: "AI is easy to over-explain and hard to make tangible. The brand had to communicate real capability without jargon, and feel human without losing technical credibility.",
      },
      {
        title: "The approach",
        body: "We built a restrained identity and a plain-spoken message architecture that leads with outcomes rather than features — so a first-time visitor immediately understands what changes for their business.",
      },
      {
        title: "The build",
        body: "An editorial, uncluttered website carries the story from problem to result, with a structure that leaves room for the product to grow into new services.",
      },
    ],
    gallery: [
      "/img/iai 1.png",
      "/img/iai 2.png",
      "/img/iai 3.png",
      "/img/iai 5.png",
      "/img/iai 6.png",
      "/img/iai 8.png",
    ],
    delivered: [
      "Brand identity system",
      "Messaging & positioning",
      "Full website design & build",
      "Content structure for future services",
    ],
  },

  seereen: {
    slug: "seereen",
    name: "Seereen",
    eyebrow: "Hair & Aesthetics",
    heroImage: "/img/seereen 1.png",
    heroAlt: "Seereen hair & aesthetics brand identity by noova",
    headline: "A neighbourhood salon, given the quiet polish of a destination.",
    intro:
      "Brand identity and print for a hair & aesthetics studio — warm, modern and unmistakably its own on a shelf full of sameness.",
    statement: "Beauty that feels calm, not clinical.",
    overview:
      "Seereen is a hair and aesthetics studio built on care and craft. The identity had to feel premium without feeling cold — the kind of place you trust with how you look, and enjoy walking into.",
    meta: {
      role: "Brand & Print",
      year: "2025",
      services: "Identity · Print · Social",
      sector: "Beauty & Wellness",
    },
    approach: [
      {
        title: "The idea",
        body: "A soft, sunlit palette and a clean lowercase wordmark set the tone: confident, feminine and understated. Nothing loud — just considered.",
      },
      {
        title: "The system",
        body: "We built a flexible identity that carries from salon signage to price cards to Instagram, so every touchpoint feels like the same welcome.",
      },
      {
        title: "In the wild",
        body: "Print collateral leads with the work and the warmth — real results, real faces, an offer that invites the first visit without discounting the brand.",
      },
    ],
    gallery: [
      "/img/seereen 2.png",
      "/img/seereen 3.png",
      "/img/seereen 4.png",
      "/img/seereen-5.png",
    ],
    delivered: [
      "Logo & wordmark",
      "Colour & type system",
      "Print & promotional collateral",
      "Social templates",
    ],
    results: [
      "A cohesive identity across salon, print and social",
      "A premium look that still feels approachable",
      "Templates the team can reuse without a designer",
    ],
    testimonial: {
      quote:
        "It finally looks like the place we always wanted to be. Clients notice — it feels considered before they've even sat down.",
      name: "Founder",
      role: "Seereen",
    },
  },

  "opa-taverne": {
    slug: "opa-taverne",
    name: "Opa Taverne",
    eyebrow: "Hospitality & Dining",
    heroImage: "/img/work-2.jpg",
    heroAlt: "Opa Taverne hospitality branding by noova",
    headline: "The warmth of a Mediterranean table, bottled into a brand.",
    intro:
      "A hospitality identity built for a taverna where the welcome matters as much as the menu — generous, sun-worn and full of life.",
    statement: "Come as guests, leave as regulars.",
    overview:
      "Opa Taverne is a Mediterranean taverna where food, family and long evenings are the point. The brand had to carry that warmth off the plate and onto every menu, sign and social post — inviting, never touristy.",
    meta: {
      role: "Brand & Collateral",
      year: "2025",
      services: "Identity · Menus · Signage",
      sector: "Hospitality",
    },
    approach: [
      {
        title: "The feeling",
        body: "We started with the emotion — the clatter and warmth of a full table — and built an identity that feels hand-made and hospitable rather than corporate.",
      },
      {
        title: "The system",
        body: "Earthy tones, tactile materials and a confident wordmark carry from exterior signage to the menu in a guest's hands.",
      },
      {
        title: "On the table",
        body: "Every printed piece is designed to be touched and kept — collateral that feels like part of the meal, not an afterthought.",
      },
    ],
    gallery: [],
    delivered: [
      "Logo & wordmark",
      "Menu & print system",
      "Signage direction",
      "Social identity",
    ],
    results: [
      "A warm, ownable identity across the venue",
      "Menus and signage that feel part of the experience",
      "A look that travels from door to Instagram",
    ],
    testimonial: {
      quote:
        "People feel it the second they walk in now. The brand says everything we're too busy cooking to explain.",
      name: "Owner",
      role: "Opa Taverne",
    },
  },

  ame: {
    slug: "ame",
    name: "AMË",
    eyebrow: "Fashion & Apparel",
    heroImage: "/img/work-3.jpg",
    heroAlt: "AMË heritage streetwear brand by noova",
    headline: "Heritage, worn forward.",
    intro:
      "A fashion brand built on Albanian identity — turning origin and belonging into a modern, wearable statement.",
    statement: "Origin. Essence. Forever.",
    overview:
      "AMË is a heritage streetwear label that carries Albanian identity onto the streets of London and beyond. The brand had to feel proud without being nostalgic — rooted in origin, but cut for now.",
    meta: {
      role: "Brand & Art Direction",
      year: "2026",
      services: "Identity · Art direction · Web",
      sector: "Fashion",
    },
    approach: [
      {
        title: "The story",
        body: "We anchored the brand in a single idea — origin as identity — and expressed it through the eagle motif, a confident wordmark and a muted, editorial palette.",
      },
      {
        title: "The look",
        body: "Photography set on rain-slick streets gives the label its attitude: understated, self-assured, unmistakably its own.",
      },
      {
        title: "The system",
        body: "From embroidery to lookbook to storefront, every element reinforces the same line — heritage, worn forward.",
      },
    ],
    gallery: [],
    delivered: [
      "Brand identity & motif",
      "Art direction & photography direction",
      "Lookbook & web direction",
      "Apparel graphics",
    ],
    results: [
      "A distinct identity in a crowded category",
      "A visual language that scales from garment to campaign",
      "A story customers want to wear",
    ],
    testimonial: {
      quote:
        "noova gave the label a soul, not just a logo. It looks like something people want to belong to.",
      name: "Founder",
      role: "AMË",
    },
  },

  "355": {
    slug: "355",
    name: "355",
    eyebrow: "Community & Events",
    heroImage: "/img/work-1.jpg",
    heroAlt: "355 members community brand by noova",
    headline: "An invitation to belong.",
    intro:
      "Brand and identity for an invitation-only community — curated experiences, real conversations, and a name that becomes a password.",
    statement: "Same vision. Different paths. One place.",
    overview:
      "355 is a members' community built on curated gatherings and genuine connection. The brand had to feel exclusive without being cold — a quiet confidence that rewards the people already inside.",
    meta: {
      role: "Brand & Identity",
      year: "2026",
      services: "Identity · Print · Web",
      sector: "Community",
    },
    approach: [
      {
        title: "The idea",
        body: "We treated the number itself as the icon — spare, memorable, a little mysterious — and let restraint do the signalling that loud luxury usually tries to.",
      },
      {
        title: "The system",
        body: "A dark, tactile palette and refined type run from membership cards to invitations to the web, so every touchpoint feels like part of the same room.",
      },
      {
        title: "The feeling",
        body: "Everything is designed to feel earned: quiet, considered, and unmistakably for members.",
      },
    ],
    gallery: [],
    delivered: [
      "Brand mark & identity",
      "Membership & print system",
      "Invitations & collateral",
      "Website direction",
    ],
    results: [
      "An identity that signals belonging, not status",
      "A system that scales across events and print",
      "A brand members are proud to carry",
    ],
    testimonial: {
      quote:
        "It feels like a secret worth keeping. People ask what 355 is before they even know — that's the whole point.",
      name: "Founder",
      role: "355",
    },
  },

  "her-club": {
    slug: "her-club",
    name: "HER CLUB",
    eyebrow: "Community & Membership",
    heroImage: "/img/problem.jpg",
    heroAlt: "HER Club women's community brand by noova",
    headline: "Where ambition meets sisterhood.",
    intro:
      "A brand for a women's community built on connection, growth and belonging — warm, elevated, and quietly powerful.",
    statement: "A community that empowers, supports and elevates.",
    overview:
      "HER Club is a community where ambitious women connect and grow together. The brand needed to feel both aspirational and intimate — polished enough to trust, warm enough to join.",
    meta: {
      role: "Brand & Identity",
      year: "2026",
      services: "Identity · Print · Web",
      sector: "Community",
    },
    approach: [
      {
        title: "The idea",
        body: "We built the identity around warmth and quiet confidence — soft golds, refined type and a crest that signals belonging without exclusion.",
      },
      {
        title: "The system",
        body: "From welcome cards to membership collateral to the web, every piece feels personal — a hand extended, not a gate kept.",
      },
      {
        title: "The feeling",
        body: "The result is a brand that reads as both elevated and generous — a room ambitious women want to be in.",
      },
    ],
    gallery: [],
    delivered: [
      "Brand crest & identity",
      "Membership & welcome collateral",
      "Print & stationery",
      "Website direction",
    ],
    results: [
      "An identity that balances aspiration and intimacy",
      "A cohesive system across print and web",
      "A brand that feels like an invitation",
    ],
    testimonial: {
      quote:
        "It captured exactly what we're building — ambition with warmth. Members feel it before we say a word.",
      name: "Founder",
      role: "HER Club",
    },
  },
};

const CASES_SQ: Record<string, CaseStudy> = {
  intellimation: {
    slug: "intellimation",
    name: "intellimation.ai",
    eyebrow: "AI & Teknologji",
    heroImage: "/img/iai 4.png",
    heroAlt: "Dizajn brandi dhe website për intellimation.ai nga noova",
    headline: "Të bësh një kompani AI të duket po aq e menduar sa inteligjenca që ndërton.",
    intro:
      "Një themel i plotë brandi dhe dixhital për një kompani automatizimi — duke e kthyer një produkt teknik dhe të shpejtë në diçka që një biznes e kupton dhe i beson që në shikim të parë.",
    statement: "Inteligjencë, e bërë e lexueshme.",
    overview:
      "intellimation.ai ndërton automatizim me AI për bizneset në rritje. Detyra jonë ishte t'i jepnim një kompanie teknike dhe të shpejtë një brand dhe prani në web po aq të menduar sa inxhinieria e saj — të besueshme për blerësit, të qartë për të sapoardhurit dhe të qetë në një kategori që shpesh bërtet.",
    meta: {
      role: "Brand & Website",
      year: "2025",
      services: "Identitet · Mesazhe · Website",
      sector: "AI / Automatizim",
    },
    approach: [
      {
        title: "Sfida",
        body: "AI-ja shpjegohet lehtë tepër dhe bëhet e prekshme me vështirësi. Brandi duhej të përcillte aftësi reale pa zhargon, dhe të ndihej njerëzor pa humbur besueshmërinë teknike.",
      },
      {
        title: "Qasja",
        body: "Ndërtuam një identitet të përmbajtur dhe një arkitekturë mesazhesh të thjeshtë që niset nga rezultatet, jo nga veçoritë — që një vizitor i parë ta kuptojë menjëherë çfarë ndryshon për biznesin e tij.",
      },
      {
        title: "Ndërtimi",
        body: "Një website editorial dhe i pastër e çon historinë nga problemi te rezultati, me një strukturë që lë hapësirë që produkti të rritet drejt shërbimeve të reja.",
      },
    ],
    gallery: [
      "/img/iai 1.png",
      "/img/iai 2.png",
      "/img/iai 3.png",
      "/img/iai 5.png",
      "/img/iai 6.png",
      "/img/iai 8.png",
    ],
    delivered: [
      "Sistem identiteti brandi",
      "Mesazhe & pozicionim",
      "Dizajn & ndërtim i plotë website-i",
      "Strukturë përmbajtjeje për shërbime të ardhshme",
    ],
  },

  seereen: {
    slug: "seereen",
    name: "Seereen",
    eyebrow: "Flokë & Estetikë",
    heroImage: "/img/seereen 1.png",
    heroAlt: "Identitet brandi për Seereen flokë & estetikë nga noova",
    headline: "Një sallon lagjeje, me shkëlqimin e qetë të një destinacioni.",
    intro:
      "Identitet brandi dhe print për një studio flokësh dhe estetike — i ngrohtë, modern dhe padyshim i vetja në një raft plot njëllojshmëri.",
    statement: "Bukuri që ndihet e qetë, jo klinike.",
    overview:
      "Seereen është një studio flokësh dhe estetike e ndërtuar mbi kujdesin dhe mjeshtërinë. Identiteti duhej të ndihej premium pa qenë i ftohtë — vendi që i beson pamjen tënde dhe të pëlqen të hysh brenda.",
    meta: {
      role: "Brand & Print",
      year: "2025",
      services: "Identitet · Print · Rrjete sociale",
      sector: "Bukuri & Mirëqenie",
    },
    approach: [
      {
        title: "Ideja",
        body: "Një paletë e butë dhe e ngrohtë dhe një wordmark i pastër me shkronja të vogla e japin tonin: i sigurt, feminin dhe i përmbajtur. Asgjë e zhurmshme — vetëm e menduar.",
      },
      {
        title: "Sistemi",
        body: "Ndërtuam një identitet fleksibël që kalon nga tabela e sallonit te kartat e çmimeve e deri te Instagrami, që çdo pikëkontakt të ndihet si e njëjta mirëseardhje.",
      },
      {
        title: "Në praktikë",
        body: "Materialet e printit nisin nga puna dhe ngrohtësia — rezultate reale, fytyra reale, një ofertë që fton vizitën e parë pa e ulur brandin.",
      },
    ],
    gallery: [
      "/img/seereen 2.png",
      "/img/seereen 3.png",
      "/img/seereen 4.png",
      "/img/seereen-5.png",
    ],
    delivered: [
      "Logo & wordmark",
      "Sistem ngjyrash & tipografie",
      "Materiale printi & promocionale",
      "Shabllone për rrjetet sociale",
    ],
    results: [
      "Një identitet i njësuar nëpër sallon, print dhe rrjete",
      "Një pamje premium që mbetet e afrueshme",
      "Shabllone që ekipi i ripërdor pa dizajner",
    ],
    testimonial: {
      quote:
        "Më në fund duket si vendi që kemi dashur gjithmonë të jemi. Klientët e vënë re — ndihet e menduar para se të ulen.",
      name: "Themeluesja",
      role: "Seereen",
    },
  },

  "opa-taverne": {
    slug: "opa-taverne",
    name: "Opa Taverne",
    eyebrow: "Mikpritje & Kuzhinë",
    heroImage: "/img/work-2.jpg",
    heroAlt: "Branding mikpritjeje për Opa Taverne nga noova",
    headline: "Ngrohtësia e një tryeze mesdhetare, e mbyllur në një brand.",
    intro:
      "Një identitet mikpritjeje i ndërtuar për një tavernë ku mirëseardhja ka po aq rëndësi sa menyja — bujar, i djegur nga dielli dhe plot jetë.",
    statement: "Eja si mysafir, ik si i rregullt.",
    overview:
      "Opa Taverne është një tavernë mesdhetare ku ushqimi, familja dhe mbrëmjet e gjata janë thelbi. Brandi duhej ta mbante atë ngrohtësi jashtë pjatës — në çdo meny, tabelë dhe postim — ftues, kurrë turistik.",
    meta: {
      role: "Brand & Materiale",
      year: "2025",
      services: "Identitet · Menu · Tabela",
      sector: "Mikpritje",
    },
    approach: [
      {
        title: "Ndjesia",
        body: "Nisëm nga emocioni — zhurma dhe ngrohtësia e një tryeze plot — dhe ndërtuam një identitet që ndihet i punuar me dorë dhe mikpritës, jo korporativ.",
      },
      {
        title: "Sistemi",
        body: "Tone tokësore, materiale të prekshme dhe një wordmark i sigurt kalojnë nga tabela e jashtme te menyja në duart e mysafirit.",
      },
      {
        title: "Në tryezë",
        body: "Çdo material printi është krijuar për t'u prekur e mbajtur — pjesë e vaktit, jo një shtesë.",
      },
    ],
    gallery: [],
    delivered: [
      "Logo & wordmark",
      "Sistem menyje & printi",
      "Drejtim tabelash",
      "Identitet për rrjetet sociale",
    ],
    results: [
      "Një identitet i ngrohtë e i vetja në të gjithë lokalin",
      "Menu e tabela që ndihen pjesë e përvojës",
      "Një pamje që udhëton nga dera te Instagrami",
    ],
    testimonial: {
      quote:
        "Njerëzit e ndiejnë që në çastin që hyjnë. Brandi thotë gjithçka që ne jemi tepër të zënë duke gatuar për ta shpjeguar.",
      name: "Pronari",
      role: "Opa Taverne",
    },
  },

  ame: {
    slug: "ame",
    name: "AMË",
    eyebrow: "Modë & Veshje",
    heroImage: "/img/work-3.jpg",
    heroAlt: "Brand streetwear me trashëgimi për AMË nga noova",
    headline: "Trashëgimia, e veshur përpara.",
    intro:
      "Një brand mode i ndërtuar mbi identitetin shqiptar — duke e kthyer origjinën dhe përkatësinë në një deklaratë moderne që vishet.",
    statement: "Origjina. Thelbi. Përgjithmonë.",
    overview:
      "AMË është një markë streetwear me trashëgimi që e mbart identitetin shqiptar në rrugët e Londrës e më tej. Brandi duhej të ndihej krenar pa qenë nostalgjik — i rrënjosur në origjinë, por i prerë për sot.",
    meta: {
      role: "Brand & Drejtim Artistik",
      year: "2026",
      services: "Identitet · Drejtim artistik · Web",
      sector: "Modë",
    },
    approach: [
      {
        title: "Historia",
        body: "E ankoruam brandin te një ide e vetme — origjina si identitet — dhe e shprehëm përmes motivit të shqiponjës, një wordmark-u të sigurt dhe një palete të heshtur, editoriale.",
      },
      {
        title: "Pamja",
        body: "Fotografia në rrugë të lagura i jep markës qëndrimin e saj: e përmbajtur, e sigurt në vetvete, padyshim e vetja.",
      },
      {
        title: "Sistemi",
        body: "Nga qëndisja te lookbook-u e deri te dyqani, çdo element përforcon të njëjtën linjë — trashëgimia, e veshur përpara.",
      },
    ],
    gallery: [],
    delivered: [
      "Identitet brandi & motiv",
      "Drejtim artistik & fotografie",
      "Lookbook & drejtim web",
      "Grafika për veshje",
    ],
    results: [
      "Një identitet i dallueshëm në një kategori të mbushur",
      "Një gjuhë vizuale që shkallëzohet nga rroba te fushata",
      "Një histori që klientët duan ta veshin",
    ],
    testimonial: {
      quote:
        "noova i dha markës një shpirt, jo thjesht një logo. Duket si diçka që njerëzit duan t'i përkasin.",
      name: "Themeluesi",
      role: "AMË",
    },
  },

  "355": {
    slug: "355",
    name: "355",
    eyebrow: "Komunitet & Evente",
    heroImage: "/img/work-1.jpg",
    heroAlt: "Brand komuniteti anëtarësh për 355 nga noova",
    headline: "Një ftesë për të përkatur.",
    intro:
      "Brand dhe identitet për një komunitet vetëm-me-ftesë — përvoja të kuruara, biseda të vërteta, dhe një emër që bëhet fjalëkalim.",
    statement: "I njëjti vizion. Rrugë të ndryshme. Një vend.",
    overview:
      "355 është një komunitet anëtarësh i ndërtuar mbi takime të kuruara dhe lidhje të vërteta. Brandi duhej të ndihej ekskluziv pa qenë i ftohtë — një siguri e qetë që shpërblen ata që janë tashmë brenda.",
    meta: {
      role: "Brand & Identitet",
      year: "2026",
      services: "Identitet · Print · Web",
      sector: "Komunitet",
    },
    approach: [
      {
        title: "Ideja",
        body: "E trajtuam vetë numrin si ikonë — të kursyer, të paharrueshëm, paksa misterioz — dhe e lamë përmbajtjen të bëjë sinjalizimin që luksi i zhurmshëm zakonisht përpiqet ta bëjë.",
      },
      {
        title: "Sistemi",
        body: "Një paletë e errët e e prekshme dhe tipografi e rafinuar kalojnë nga kartat e anëtarësisë te ftesat e deri te web-i, që çdo pikëkontakt të ndihet pjesë e së njëjtës dhomë.",
      },
      {
        title: "Ndjesia",
        body: "Gjithçka është krijuar të ndihet e fituar: e qetë, e menduar dhe padyshim për anëtarët.",
      },
    ],
    gallery: [],
    delivered: [
      "Shenjë brandi & identitet",
      "Sistem anëtarësie & printi",
      "Ftesa & materiale",
      "Drejtim website-i",
    ],
    results: [
      "Një identitet që sinjalizon përkatësi, jo status",
      "Një sistem që shkallëzohet nëpër evente e print",
      "Një brand që anëtarët janë krenarë ta mbajnë",
    ],
    testimonial: {
      quote:
        "Ndihet si një sekret që ia vlen të mbahet. Njerëzit pyesin çfarë është 355 para se ta dinë — ky është i gjithë qëllimi.",
      name: "Themeluesi",
      role: "355",
    },
  },

  "her-club": {
    slug: "her-club",
    name: "HER CLUB",
    eyebrow: "Komunitet & Anëtarësi",
    heroImage: "/img/problem.jpg",
    heroAlt: "Brand komuniteti grash për HER Club nga noova",
    headline: "Aty ku ambicia takon motërzinë.",
    intro:
      "Një brand për një komunitet grash i ndërtuar mbi lidhjen, rritjen dhe përkatësinë — i ngrohtë, i rafinuar dhe në heshtje i fuqishëm.",
    statement: "Një komunitet që fuqizon, mbështet dhe ngre lart.",
    overview:
      "HER Club është një komunitet ku gratë ambicioze lidhen dhe rriten së bashku. Brandi duhej të ndihej njëkohësisht frymëzues dhe intim — mjaftueshëm i rafinuar për t'i besuar, mjaftueshëm i ngrohtë për t'iu bashkuar.",
    meta: {
      role: "Brand & Identitet",
      year: "2026",
      services: "Identitet · Print · Web",
      sector: "Komunitet",
    },
    approach: [
      {
        title: "Ideja",
        body: "E ndërtuam identitetin rreth ngrohtësisë dhe një sigurie të qetë — ari të butë, tipografi të rafinuar dhe një stemë që sinjalizon përkatësi pa përjashtim.",
      },
      {
        title: "Sistemi",
        body: "Nga kartat e mirëseardhjes te materialet e anëtarësisë e deri te web-i, çdo pjesë ndihet personale — një dorë e zgjatur, jo një portë e ruajtur.",
      },
      {
        title: "Ndjesia",
        body: "Rezultati është një brand që lexohet njëkohësisht i ngritur dhe bujar — një dhomë ku gratë ambicioze duan të jenë.",
      },
    ],
    gallery: [],
    delivered: [
      "Stemë brandi & identitet",
      "Materiale anëtarësie & mirëseardhjeje",
      "Print & letra zyrtare",
      "Drejtim website-i",
    ],
    results: [
      "Një identitet që balancon frymëzimin dhe intimitetin",
      "Një sistem i njësuar nëpër print e web",
      "Një brand që ndihet si një ftesë",
    ],
    testimonial: {
      quote:
        "E kapi saktësisht atë që po ndërtojmë — ambicie me ngrohtësi. Anëtaret e ndiejnë para se të themi një fjalë.",
      name: "Themeluesja",
      role: "HER Club",
    },
  },
};

const BY_LOCALE: Record<string, Record<string, CaseStudy>> = {
  en: CASES_EN,
  sq: CASES_SQ,
};

export function getCaseStudy(locale: string, slug: string): CaseStudy | undefined {
  return (BY_LOCALE[locale] ?? CASES_EN)[slug];
}

export function getCaseStudies(locale: string): CaseStudy[] {
  const set = BY_LOCALE[locale] ?? CASES_EN;
  return CASE_ORDER.map((s) => set[s]);
}
