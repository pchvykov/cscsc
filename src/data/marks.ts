// Ink marks: small hand-drawn icons in the same style as the research-theme glyphs,
// but in muted ink (colour stays reserved for the themes). They help the eye find
// sections; they never carry meaning on their own (always aria-hidden).
// Drawings live in public/assets/marks/<name>.svg.
//
// Each topic has its own mark. A heading takes the mark of the first rule it matches;
// a mark is shared across the site only by headings on the same subject (e.g. every
// "people" heading), and never repeats on one page: enhance() moves a repeat on to the
// next rule the heading matches, then to an unused spare. Override with
// data-mark="<name>" on the <section class="panel">.
// The six top-level site sections own their marks (sectionMark below); headings
// never use those, so the label above a page title never repeats a section's mark.
export const markRules: [string, RegExp][] = [
  ["candle", /spiritual/i],
  ["trefoil", /trinity/i],
  ["stones", /practice|meditat/i],
  ["fern", /living question/i],
  ["leaf", /living|ecolog|organism/i],
  ["bird", /\bmind\b|computation/i],
  ["frame", /framing/i],
  ["scales", /tension|polarit/i],
  ["mountain", /frontier/i],
  ["branch", /scaling/i],
  ["bridge", /common ground|bridg/i],
  ["lens", /context/i],
  ["seed", /mission|purpose|\baim\b/i],
  ["helix", /\bdna\b/i],
  ["roots", /assumption|foundation|worldview/i],
  ["door", /\bjoin\b|resonate|welcome/i],
  ["figures", /people|organiz|personal connection/i],
  ["footprints", /start here/i],
  ["board", /keynote|\btalks?\b|speaker|lecture/i],
  ["quote", /from the room|testimon/i],
  ["voices", /discussion|breakout|\bcalls?\b|conversation/i],
  ["lantern", /advis|mentor/i],
  ["screen", /presentation|cscsc25|online|virtual/i],
  ["phases", /regular|monthly/i],
  ["tent", /gathering|conference|retreat|workshop|ccs26/i],
  ["moon", /upcoming|latest|\bpast\b/i],
  ["net", /platform|forum|network/i],
  ["envelope", /stay engaged|newsletter|email|updates/i],
  ["compass", /next step|direction/i],
  ["path", /approach|what we do|method/i],
  ["constellation", /theme|topic/i],
  ["weave", /identity|commitment|community/i],
  ["spark", /idea|principle|value|insight/i],
];
// Spares for headings no rule fits (or whose marks are already on the page).
const spares = ["ripple", "spark", "weave", "lens", "compass", "bird"];

export function markFor(title: string, used?: Set<string>): string {
  const hits = markRules.filter(([, re]) => re.test(title)).map(([m]) => m);
  const pick = [...hits, ...spares].find((m) => !used?.has(m)) ?? "ripple";
  used?.add(pick);
  return pick;
}

// The top-level site sections (header nav labels) each own a mark,
// shown beside the section name above a page title.
export const sectionMark: Record<string, string> = {
  Research: "spiral", Gatherings: "flame", Learn: "book", "Watch & read": "play", Resources: "key", About: "circle",
};

export const markUrl = (name: string) => `url(/assets/marks/${name}.svg)`;
