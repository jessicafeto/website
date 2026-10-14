/**
 * "AI, Creativity & Human Judgement" — DRAFT.
 *
 * Every line marked `confirm: true` describes a practice or commitment that
 * Jessica has not yet confirmed. Edit or delete those lines until each one is
 * true of how noova actually works, then set AI_PAGE_PUBLISHED to true.
 *
 * Until then the page renders in local preview only (with "To confirm" tags)
 * and returns 404 in production, and nothing links to it on the live site.
 * English first; the Albanian version follows once the wording is approved.
 */
export const AI_PAGE_PUBLISHED = false;

export const aiPageVisible = () =>
  AI_PAGE_PUBLISHED || process.env.NODE_ENV !== "production";

export type Line = { text: string; confirm?: boolean };
export type Stage = { stage: string; ai: Line; human: Line };
export type Section = { n: string; title: string; body: Line[] };

export const aiApproach = {
  metaTitle: "AI, Creativity & Human Judgement",
  metaDesc:
    "How noova uses AI in research, prototyping and production — and why strategy, creative direction and the final decision stay with people.",
  eyebrow: "Our approach to AI",
  title: "AI, creativity & human judgement.",
  intro:
    "AI is part of how a modern studio works. We'd rather say plainly where it helps, where it doesn't, and who is responsible for the work either way.",

  stagesLabel: "Where it fits",
  stages: [
    {
      stage: "Research & ideation",
      ai: { text: "Summarising research, widening the range of early directions, pressure-testing ideas.", confirm: true },
      human: { text: "Defining the question, choosing what matters, setting the strategy." },
    },
    {
      stage: "Prototyping",
      ai: { text: "Drafting layouts, copy options and code prototypes quickly enough to compare them.", confirm: true },
      human: { text: "Deciding what the brief actually needs, and what gets cut." },
    },
    {
      stage: "Visual exploration",
      ai: { text: "Mood studies, compositional tests and image variations during exploration.", confirm: true },
      human: { text: "Creative direction, art direction and the final selection." },
    },
    {
      stage: "Production",
      ai: { text: "Repetitive production tasks — resizing, formatting, first-draft translation.", confirm: true },
      human: { text: "Editing, quality control and sign-off before anything is delivered." },
    },
  ] as Stage[],

  sections: [
    {
      n: "01",
      title: "A tool doesn't make the decision.",
      body: [
        { text: "Using AI doesn't move responsibility anywhere. A person chooses the direction, edits the output and decides whether it's good enough — and that person is accountable for it." },
        { text: "Every piece of work that leaves the studio is reviewed and approved by someone at noova.", confirm: true },
      ],
    },
    {
      n: "02",
      title: "Original to the brief, not to a reference.",
      body: [
        { text: "Tools make it easy to produce something that looks like work you admire. That's exactly why we start from the brief — the business, its audience, its context — rather than from someone else's image." },
        { text: "References can inform taste. They don't get recreated: we don't prompt for, or publish, work that reproduces another creator's distinctive composition, styling or identity.", confirm: true },
        { text: "Using AI doesn't make work original, and editing an output doesn't remove the need to check it." },
      ],
    },
    {
      n: "03",
      title: "How AI imagery is checked before it's published.",
      body: [
        { text: "Does it answer this brief, for this client, rather than a generic one?", confirm: true },
        { text: "Does it resemble an existing creator's distinctive work closely enough to be confused with it? If so, it doesn't go out.", confirm: true },
        { text: "Does it depict real people, places, products or brands — and do we have permission to?", confirm: true },
        { text: "Is it technically sound — no warped hands, false text or artefacts?", confirm: true },
        { text: "Should it be labelled? We tell clients when a deliverable includes AI-generated elements.", confirm: true },
      ],
    },
    {
      n: "04",
      title: "Confidentiality, permissions & third-party rights.",
      body: [
        { text: "Client material that is confidential isn't put into AI tools without the client's agreement.", confirm: true },
        { text: "Where a tool offers settings that keep inputs out of model training, we use them.", confirm: true },
        { text: "We don't generate likenesses of real people without their permission.", confirm: true },
        { text: "AI output can still raise intellectual-property questions. Where it matters to a project, we'll discuss it with you — and recommend specialist legal advice where that's the right call." },
      ],
    },
    {
      n: "05",
      title: "What you see on this site.",
      body: [
        { text: "The portraits of our founder on this site are photographs of Jessica." },
        { text: "Where studio or campaign imagery on this site has been created or extended with AI, we'll say so.", confirm: true },
      ],
    },
  ] as Section[],

  ctaHeading: "Questions about AI on your project?",
  ctaBody: "Ask us how we'd approach your brief — including where we would, and wouldn't, use AI.",
  ctaPrimary: "Ask us →",
  ctaSecondary: "About the studio →",
};
