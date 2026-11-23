// Ink marks: small hand-drawn icons in the same style as the research-theme glyphs,
// but in muted ink (colour stays reserved for the themes). They help the eye find
// sections; they never carry meaning on their own (always aria-hidden).
// Drawings live in public/assets/marks/<name>.svg.
//
// A section's mark is picked from its heading by the first matching rule below,
// so new content gets one automatically. Override with data-mark="<name>" on the
// <section class="panel">.
export const markRules: [string, RegExp][] = [
  ["stones", /practice|contemplat|meditat|spiritual|silence/i],
  ["voices", /discussion|breakout|conversation|dialogue|from the room|speaker|voices/i],
  ["flame", /gathering|conference|keynote|presentation|retreat|workshop|session|program|registration|logistics|setting/i],
  ["moon", /upcoming|latest|past |schedule|when|calendar/i],
  ["seed", /mission|aim|purpose|next step|direction|start|vision|why /i],
  ["spiral", /question|tension|polarit|inquiry|problem|curio/i],
  ["leaf", /living|life|ecolog|nature|organism/i],
  ["circle", /community|join|people|organiz|advisor|together|connection|engaged|platform|identity|common ground|who /i],
  ["path", /approach|method|frontier|scaling|application|beyond|what we do|how /i],
  ["roots", /foundation|assumption|worldview|philosoph|context|ground/i],
  ["spark", /idea|dna|principle|value|commitment|insight/i],
  ["constellation", /theme|topic|map/i],
  ["book", /reading|reference|resource|publication|essay|further|book|learn/i],
  ["play", /video|talk|film|watch|recording/i],
];

export function markFor(title: string): string {
  return markRules.find(([, re]) => re.test(title))?.[0] ?? "ripple";
}

// The top-level site sections (header nav labels) each have a mark too,
// shown beside the section name above a page title.
export const sectionMark: Record<string, string> = {
  Research: "spiral", Gatherings: "flame", Learn: "seed", "Watch & read": "play", Resources: "book", About: "circle",
};

export const markUrl = (name: string) => `url(/assets/marks/${name}.svg)`;
