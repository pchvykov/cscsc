// The five research themes. Each has a number, a colour and a glyph that
// always travel together, wherever the theme appears on the site. A section
// joins a theme with data-theme="<id>" on its wrapper.
export type Theme = { id: string; n: string; name: string; light: string; dark: string };

export const themes: Theme[] = [
  { id: "relational", n: "01", name: "Relational Ontology & the Construction of Reality", light: "#8d6421", dark: "#d9a54f" },
  { id: "agency", n: "02", name: "Agency & Intelligence as Causes", light: "#4f6f47", dark: "#9dbb8f" },
  { id: "imaginaries", n: "03", name: "Social Reality as Collective Imaginaries", light: "#40607c", dark: "#8fb0cc" },
  { id: "practice", n: "04", name: "Complexity Understanding of Contemplative Practices", light: "#9a4b33", dark: "#e08d6f" },
  { id: "epistemology", n: "05", name: "Alternative Epistemologies & Methodologies", light: "#734a78", dark: "#c39ac6" },
];

export const themeCss = themes.map((t) => `[data-theme-id="${t.id}"]{--t:${t.light};--glyph:url(/assets/glyphs/${t.id}.svg)}:root[data-theme="dark"] [data-theme-id="${t.id}"]{--t:${t.dark}}`).join("");
