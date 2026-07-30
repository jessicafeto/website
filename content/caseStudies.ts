/**
 * Case studies — one immersive, image-led project page per portfolio piece
 * (/work/[slug]). Editorial "design-book" layout: full-screen hero, concise
 * overview, a minimal snapshot, then a rhythm of mixed image blocks.
 *
 * Locale-keyed (EN + SQ), same spirit as content/offers.ts. Image blocks carry
 * their real pixel width/height so every image renders at natural aspect and is
 * never cropped. To add frames to a project, drop files in /public/img and add
 * blocks here — nothing in the component changes.
 *
 * intellimation.ai is a REAL engagement (factual copy). The others are concept /
 * spec brand pieces — their single mockup carries the page until more frames
 * exist; add blocks as imagery lands.
 */

export type Img = { src: string; w: number; h: number };

export type Block =
  | { kind: "full"; src: string; w: number; h: number }
  | { kind: "portrait"; src: string; w: number; h: number }
  | { kind: "duo"; items: [Img, Img] }
  | { kind: "caption"; label: string; note: string };

export type Snapshot = {
  industry: string;
  services: string[];
  timeline: string;
  deliverables: string[];
};

export type CaseStudy = {
  slug: string;
  name: string;
  category: string;
  heroImage: string;
  overviewHeading: string;
  overview: string;
  snapshot: Snapshot;
  blocks: Block[];
  finalImage?: Img;
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
    category: "Brand Identity & Marketing System",
    heroImage: "/img/iai 1.png",
    overviewHeading:
      "Building a modern enterprise identity for the future of Vertical AI.",
    overview:
      "intellimation.ai builds proprietary, vertical AI for banking and financial services — automation purpose-built for an industry that runs on trust. The company needed a brand that could stand next to institutions like Barclays, Citi and Nomura without inheriting their stiffness: credible, modern, and clear about a complex product. We built the identity, the message system and a full suite of collateral — website, brochures, presentation decks and a live exhibition presence. The result is one coherent enterprise identity that makes advanced AI feel considered, legible and ready for the room it is selling into.",
    snapshot: {
      industry: "Technology / AI",
      services: [
        "Brand Strategy",
        "Visual Identity",
        "Marketing",
        "Website",
        "Print Design",
        "Events",
      ],
      timeline: "Ongoing",
      deliverables: [
        "Logo",
        "Identity",
        "Brochures",
        "Website",
        "Presentation Deck",
        "Exhibition Booth",
        "Print Collateral",
        "Event Assets",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "Print & Collateral",
        note: "A full system of brochures and one-pagers that make a complex product easy to hand over.",
      },
      { kind: "full", src: "/img/iai 8.png", w: 1536, h: 1024 },
      { kind: "portrait", src: "/img/iai 6.png", w: 1086, h: 1448 },
      { kind: "full", src: "/img/iai 7.png", w: 1536, h: 1024 },
      {
        kind: "caption",
        label: "Identity & Stationery",
        note: "Considered details — the folder, the deck, the print in a client's hands.",
      },
      {
        kind: "duo",
        items: [
          { src: "/img/iai 2.png", w: 1254, h: 1254 },
          { src: "/img/iai 3.png", w: 1254, h: 1254 },
        ],
      },
      {
        kind: "caption",
        label: "Merch & Extras",
        note: "Details that travel — business cards, a conference badge and a branded polo.",
      },
      { kind: "full", src: "/img/iai-card.jpg", w: 1072, h: 852 },
      {
        kind: "duo",
        items: [
          { src: "/img/iai-badge.jpg", w: 1402, h: 1122 },
          { src: "/img/iai-polo.jpg", w: 1402, h: 1122 },
        ],
      },
    ],
    finalImage: { src: "/img/iai 4.png", w: 1448, h: 1086 },
  },

  seereen: {
    slug: "seereen",
    name: "Seereen",
    category: "Brand Identity & Print",
    heroImage: "/img/seereen 1.png",
    overviewHeading:
      "A calm, confident identity for a modern hair & aesthetics studio.",
    overview:
      "Seereen is a hair and aesthetics studio built on care and craft. It needed an identity that felt premium without turning cold — somewhere you would trust with how you look and enjoy walking into. We created the wordmark, a warm and sunlit visual system, and print collateral that leads with real faces and real results. From salon signage to price cards to social, every touchpoint now carries the same quiet welcome — approachable, feminine and unmistakably its own.",
    snapshot: {
      industry: "Beauty & Wellness",
      services: ["Brand Strategy", "Visual Identity", "Print Design", "Social"],
      timeline: "4 weeks",
      deliverables: [
        "Logo",
        "Wordmark",
        "Colour & Type",
        "Print Collateral",
        "Promotional Flyers",
        "Social Templates",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "Visual Identity",
        note: "A warm, lowercase wordmark and a sunlit palette set the tone.",
      },
      {
        kind: "duo",
        items: [
          { src: "/img/seereen 2.png", w: 1122, h: 1402 },
          { src: "/img/seereen 3.png", w: 1024, h: 1536 },
        ],
      },
      { kind: "portrait", src: "/img/seereen 4.png", w: 1024, h: 1536 },
    ],
    finalImage: { src: "/img/seereen-5.png", w: 1536, h: 1024 },
  },

  "opa-taverne": {
    slug: "opa-taverne",
    name: "Opa Taverne",
    category: "Hospitality Branding",
    heroImage: "/img/work-2.jpg",
    overviewHeading: "Bottling the warmth of a Mediterranean table into a brand.",
    overview:
      "Opa Taverne is a Mediterranean taverna where food, family and long evenings are the whole point. The brand had to carry that warmth off the plate and onto every menu, sign and post — inviting, generous, never touristy. We built a hand-made, hospitable identity in earthy tones and tactile materials, designed to be touched and kept. From the door to the table to Instagram, it now feels like the same welcome you get the moment you walk in.",
    snapshot: {
      industry: "Hospitality",
      services: [
        "Brand Strategy",
        "Visual Identity",
        "Menus",
        "Signage",
        "Social",
      ],
      timeline: "5 weeks",
      deliverables: [
        "Logo",
        "Wordmark",
        "Menu System",
        "Signage",
        "Print Collateral",
        "Social Identity",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "The Identity",
        note: "Warm, tactile and hospitable — a brand designed to be touched and kept.",
      },
      { kind: "portrait", src: "/img/work-2.jpg", w: 900, h: 1600 },
    ],
  },

  ame: {
    slug: "ame",
    name: "AMË",
    category: "Fashion & Art Direction",
    heroImage: "/img/work-3.jpg",
    overviewHeading:
      "Heritage, worn forward — an Albanian identity for the street.",
    overview:
      "AMË is a heritage streetwear label that carries Albanian identity onto the streets of London and beyond. It had to feel proud without being nostalgic — rooted in origin, but cut for now. We anchored the brand in a single idea, origin as identity, and expressed it through the eagle motif, a confident wordmark and a muted, editorial palette. Photography set on rain-slick streets gives it the attitude: understated, self-assured, unmistakably its own — heritage you want to wear.",
    snapshot: {
      industry: "Fashion",
      services: [
        "Brand Strategy",
        "Visual Identity",
        "Art Direction",
        "Web",
      ],
      timeline: "6 weeks",
      deliverables: [
        "Identity",
        "Eagle Motif",
        "Art Direction",
        "Lookbook",
        "Web Direction",
        "Apparel Graphics",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "Art Direction",
        note: "Rain-slick streets and a muted palette give the label its quiet confidence.",
      },
      { kind: "full", src: "/img/work-3.jpg", w: 2400, h: 1500 },
    ],
  },

  "355": {
    slug: "355",
    name: "355",
    category: "Community & Identity",
    heroImage: "/img/work-1.jpg",
    overviewHeading:
      "A quiet, confident identity for an invitation-only community.",
    overview:
      "355 is a members' community built on curated gatherings and genuine connection. The brand had to feel exclusive without being cold — a quiet confidence that rewards the people already inside. We treated the number itself as the icon: spare, memorable, a little mysterious. A dark, tactile palette and refined type run from membership cards to invitations to the web, so every touchpoint feels like part of the same room — earned, considered, and unmistakably for members.",
    snapshot: {
      industry: "Community",
      services: ["Brand Strategy", "Visual Identity", "Print", "Web"],
      timeline: "5 weeks",
      deliverables: [
        "Brand Mark",
        "Identity",
        "Membership Cards",
        "Invitations",
        "Print Collateral",
        "Web Direction",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "The System",
        note: "Dark, tactile and refined — a brand that signals belonging, not status.",
      },
      { kind: "full", src: "/img/work-1.jpg", w: 1402, h: 1122 },
    ],
  },

  "her-club": {
    slug: "her-club",
    name: "HER CLUB",
    category: "Community & Membership",
    heroImage: "/img/problem.jpg",
    overviewHeading:
      "Where ambition meets sisterhood — a warm, elevated identity.",
    overview:
      "HER Club is a community where ambitious women connect and grow together. The brand needed to feel both aspirational and intimate — polished enough to trust, warm enough to join. We built it around warmth and quiet confidence: soft golds, refined type and a crest that signals belonging without exclusion. From welcome cards to membership collateral to the web, every piece feels personal — a hand extended, not a gate kept. The result reads as elevated and generous at once.",
    snapshot: {
      industry: "Community",
      services: ["Brand Strategy", "Visual Identity", "Print", "Web"],
      timeline: "5 weeks",
      deliverables: [
        "Brand Crest",
        "Identity",
        "Welcome Collateral",
        "Stationery",
        "Membership Cards",
        "Web Direction",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "The Identity",
        note: "Soft golds and a refined crest — belonging, without a gate.",
      },
      { kind: "full", src: "/img/problem.jpg", w: 1402, h: 1122 },
    ],
  },
};

const CASES_SQ: Record<string, CaseStudy> = {
  intellimation: {
    slug: "intellimation",
    name: "intellimation.ai",
    category: "Identitet Brandi & Sistem Marketingu",
    heroImage: "/img/iai 1.png",
    overviewHeading:
      "Ndërtimi i një identiteti modern enterprise për të ardhmen e Vertical AI.",
    overview:
      "intellimation.ai ndërton AI vertikale të pronësisë për shërbimet bankare dhe financiare — automatizim i krijuar posaçërisht për një industri që mbahet mbi besimin. Kompania kishte nevojë për një brand që të qëndronte pranë institucioneve si Barclays, Citi dhe Nomura pa trashëguar ngurtësinë e tyre: i besueshëm, modern dhe i qartë për një produkt kompleks. Ndërtuam identitetin, sistemin e mesazheve dhe një gamë të plotë materialesh — website, broshura, prezantime dhe një prani të drejtpërdrejtë në ekspozita. Rezultati është një identitet i njësuar enterprise që e bën AI-në e avancuar të ndihet e menduar, e lexueshme dhe gati për sallën ku po shitet.",
    snapshot: {
      industry: "Teknologji / AI",
      services: [
        "Strategji Brandi",
        "Identitet Vizual",
        "Marketing",
        "Website",
        "Dizajn Printi",
        "Evente",
      ],
      timeline: "Në vazhdim",
      deliverables: [
        "Logo",
        "Identitet",
        "Broshura",
        "Website",
        "Prezantim",
        "Stendë Ekspozite",
        "Materiale Printi",
        "Materiale Eventi",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "Print & Materiale",
        note: "Një sistem i plotë broshurash e fletushkash që e bëjnë të lehtë dorëzimin e një produkti kompleks.",
      },
      { kind: "full", src: "/img/iai 8.png", w: 1536, h: 1024 },
      { kind: "portrait", src: "/img/iai 6.png", w: 1086, h: 1448 },
      { kind: "full", src: "/img/iai 7.png", w: 1536, h: 1024 },
      {
        kind: "caption",
        label: "Identitet & Letra",
        note: "Detaje të menduara — dosja, prezantimi, printi në duart e klientit.",
      },
      {
        kind: "duo",
        items: [
          { src: "/img/iai 2.png", w: 1254, h: 1254 },
          { src: "/img/iai 3.png", w: 1254, h: 1254 },
        ],
      },
      {
        kind: "caption",
        label: "Veshje & Ekstra",
        note: "Detaje që udhëtojnë — karta biznesi, një kartë konference dhe një polo e brenduar.",
      },
      { kind: "full", src: "/img/iai-card.jpg", w: 1072, h: 852 },
      {
        kind: "duo",
        items: [
          { src: "/img/iai-badge.jpg", w: 1402, h: 1122 },
          { src: "/img/iai-polo.jpg", w: 1402, h: 1122 },
        ],
      },
    ],
    finalImage: { src: "/img/iai 4.png", w: 1448, h: 1086 },
  },

  seereen: {
    slug: "seereen",
    name: "Seereen",
    category: "Identitet Brandi & Print",
    heroImage: "/img/seereen 1.png",
    overviewHeading:
      "Një identitet i qetë e i sigurt për një studio moderne flokësh dhe estetike.",
    overview:
      "Seereen është një studio flokësh dhe estetike e ndërtuar mbi kujdesin dhe mjeshtërinë. I duhej një identitet që të ndihej premium pa u bërë i ftohtë — një vend që i beson pamjen tënde dhe të pëlqen të hysh brenda. Krijuam wordmark-un, një sistem vizual të ngrohtë e me dritë, dhe materiale printi që nisin nga fytyra reale dhe rezultate reale. Nga tabela e sallonit te kartat e çmimeve e deri te rrjetet sociale, çdo pikëkontakt tani mbart të njëjtën mirëseardhje të qetë — të afrueshme, feminine dhe padyshim të vetën.",
    snapshot: {
      industry: "Bukuri & Mirëqenie",
      services: [
        "Strategji Brandi",
        "Identitet Vizual",
        "Dizajn Printi",
        "Rrjete Sociale",
      ],
      timeline: "4 javë",
      deliverables: [
        "Logo",
        "Wordmark",
        "Ngjyra & Tipografi",
        "Materiale Printi",
        "Fletushka Promocionale",
        "Shabllone Sociale",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "Identitet Vizual",
        note: "Një wordmark i ngrohtë me shkronja të vogla dhe një paletë me dritë e japin tonin.",
      },
      {
        kind: "duo",
        items: [
          { src: "/img/seereen 2.png", w: 1122, h: 1402 },
          { src: "/img/seereen 3.png", w: 1024, h: 1536 },
        ],
      },
      { kind: "portrait", src: "/img/seereen 4.png", w: 1024, h: 1536 },
    ],
    finalImage: { src: "/img/seereen-5.png", w: 1536, h: 1024 },
  },

  "opa-taverne": {
    slug: "opa-taverne",
    name: "Opa Taverne",
    category: "Branding Mikpritjeje",
    heroImage: "/img/work-2.jpg",
    overviewHeading:
      "Ngrohtësia e një tryeze mesdhetare, e mbyllur në një brand.",
    overview:
      "Opa Taverne është një tavernë mesdhetare ku ushqimi, familja dhe mbrëmjet e gjata janë thelbi. Brandi duhej ta mbante atë ngrohtësi jashtë pjatës — në çdo meny, tabelë dhe postim — ftues, bujar, kurrë turistik. Ndërtuam një identitet të punuar me dorë e mikpritës, në tone tokësore dhe materiale të prekshme, të krijuara për t'u prekur e mbajtur. Nga dera te tryeza e deri te Instagrami, tani ndihet si e njëjta mirëseardhje që merr në çastin që hyn.",
    snapshot: {
      industry: "Mikpritje",
      services: [
        "Strategji Brandi",
        "Identitet Vizual",
        "Menu",
        "Tabela",
        "Rrjete Sociale",
      ],
      timeline: "5 javë",
      deliverables: [
        "Logo",
        "Wordmark",
        "Sistem Menyje",
        "Tabela",
        "Materiale Printi",
        "Identitet Social",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "Identiteti",
        note: "I ngrohtë, i prekshëm dhe mikpritës — një brand i krijuar për t'u prekur e mbajtur.",
      },
      { kind: "portrait", src: "/img/work-2.jpg", w: 900, h: 1600 },
    ],
  },

  ame: {
    slug: "ame",
    name: "AMË",
    category: "Modë & Drejtim Artistik",
    heroImage: "/img/work-3.jpg",
    overviewHeading:
      "Trashëgimia, e veshur përpara — një identitet shqiptar për rrugën.",
    overview:
      "AMË është një markë streetwear me trashëgimi që e mbart identitetin shqiptar në rrugët e Londrës e më tej. Duhej të ndihej krenare pa qenë nostalgjike — e rrënjosur në origjinë, por e prerë për sot. E ankoruam brandin te një ide e vetme, origjina si identitet, dhe e shprehëm përmes motivit të shqiponjës, një wordmark-u të sigurt dhe një palete të heshtur, editoriale. Fotografia në rrugë të lagura i jep qëndrimin: e përmbajtur, e sigurt në vetvete, padyshim e vetja — trashëgimi që do ta veshësh.",
    snapshot: {
      industry: "Modë",
      services: [
        "Strategji Brandi",
        "Identitet Vizual",
        "Drejtim Artistik",
        "Web",
      ],
      timeline: "6 javë",
      deliverables: [
        "Identitet",
        "Motivi i Shqiponjës",
        "Drejtim Artistik",
        "Lookbook",
        "Drejtim Web",
        "Grafika Veshjesh",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "Drejtim Artistik",
        note: "Rrugë të lagura dhe një paletë e heshtur i japin markës sigurinë e saj të qetë.",
      },
      { kind: "full", src: "/img/work-3.jpg", w: 2400, h: 1500 },
    ],
  },

  "355": {
    slug: "355",
    name: "355",
    category: "Komunitet & Identitet",
    heroImage: "/img/work-1.jpg",
    overviewHeading:
      "Një identitet i qetë e i sigurt për një komunitet vetëm-me-ftesë.",
    overview:
      "355 është një komunitet anëtarësh i ndërtuar mbi takime të kuruara dhe lidhje të vërteta. Brandi duhej të ndihej ekskluziv pa qenë i ftohtë — një siguri e qetë që shpërblen ata që janë tashmë brenda. E trajtuam vetë numrin si ikonë: të kursyer, të paharrueshëm, paksa misterioz. Një paletë e errët e e prekshme dhe tipografi e rafinuar kalojnë nga kartat e anëtarësisë te ftesat e deri te web-i, që çdo pikëkontakt të ndihet pjesë e së njëjtës dhomë — e fituar, e menduar dhe padyshim për anëtarët.",
    snapshot: {
      industry: "Komunitet",
      services: ["Strategji Brandi", "Identitet Vizual", "Print", "Web"],
      timeline: "5 javë",
      deliverables: [
        "Shenjë Brandi",
        "Identitet",
        "Karta Anëtarësie",
        "Ftesa",
        "Materiale Printi",
        "Drejtim Web",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "Sistemi",
        note: "I errët, i prekshëm dhe i rafinuar — një brand që sinjalizon përkatësi, jo status.",
      },
      { kind: "full", src: "/img/work-1.jpg", w: 1402, h: 1122 },
    ],
  },

  "her-club": {
    slug: "her-club",
    name: "HER CLUB",
    category: "Komunitet & Anëtarësi",
    heroImage: "/img/problem.jpg",
    overviewHeading:
      "Aty ku ambicia takon motërzinë — një identitet i ngrohtë dhe i ngritur.",
    overview:
      "HER Club është një komunitet ku gratë ambicioze lidhen dhe rriten së bashku. Brandi duhej të ndihej njëkohësisht frymëzues dhe intim — mjaftueshëm i rafinuar për t'i besuar, mjaftueshëm i ngrohtë për t'iu bashkuar. E ndërtuam rreth ngrohtësisë dhe një sigurie të qetë: ari të butë, tipografi të rafinuar dhe një stemë që sinjalizon përkatësi pa përjashtim. Nga kartat e mirëseardhjes te materialet e anëtarësisë e deri te web-i, çdo pjesë ndihet personale — një dorë e zgjatur, jo një portë e ruajtur. Rezultati lexohet i ngritur dhe bujar njëkohësisht.",
    snapshot: {
      industry: "Komunitet",
      services: ["Strategji Brandi", "Identitet Vizual", "Print", "Web"],
      timeline: "5 javë",
      deliverables: [
        "Stemë Brandi",
        "Identitet",
        "Materiale Mirëseardhjeje",
        "Letra Zyrtare",
        "Karta Anëtarësie",
        "Drejtim Web",
      ],
    },
    blocks: [
      {
        kind: "caption",
        label: "Identiteti",
        note: "Ari të butë dhe një stemë e rafinuar — përkatësi, pa një portë.",
      },
      { kind: "full", src: "/img/problem.jpg", w: 1402, h: 1122 },
    ],
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

/** The next project in CASE_ORDER, wrapping around to the first. */
export function getNextCaseStudy(locale: string, slug: string): CaseStudy {
  const set = BY_LOCALE[locale] ?? CASES_EN;
  const i = CASE_ORDER.indexOf(slug);
  const next = CASE_ORDER[(i + 1) % CASE_ORDER.length];
  return set[next];
}
