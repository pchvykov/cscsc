// One build step every content page passes through, so structure is presented
// the same way everywhere. It only adds wrappers and labels around the HTML that
// Markdown produced; the words are untouched.
//
//  1. Sections (<section class="panel">) are numbered 01, 02 ... and, when they
//     belong to a research theme (data-theme-id), carry its glyph and colour.
//  2. A page with three or more sections gets a section map under its opening line.
//  3. A reference - heading, summary, optional author line, link line - becomes
//     one compact entry (.ref) with the author and link on a meta line.
//  4. A toggle that holds several references shows how many in its title.
import { themes } from "../data/themes";

const themeName = new Map(themes.map((t) => [t.id, t]));
const strip = (h: string) => h.replace(/<[^>]+>/g, "").trim();

export function enhance(html: string, opts: { mapHeadings?: boolean } = {}): { html: string; hasMap: boolean } {
  // 3. references
  html = html.replace(
    /<h([34]) id="([^"]+)">([\s\S]*?)<\/h\1>\n((?:<p>(?!<em>[^<]*<\/em><\/p>)(?!<a )(?:(?!<\/?p>)[\s\S])*?<\/p>\n){1,2})(?:<p><em>([^<]+)<\/em><\/p>\n)?<p>((?:<a (?![^>]*class="page-link")[^>]+>(?:(?!<\/?p>)[\s\S])*?<\/a>(?:\s*(?:·|\||and|,)\s*)?)+)<\/p>/g,
    (_m, lvl, id, title, summary, who, links) =>
      `<article class="ref"><h${lvl} id="${id}">${title}</h${lvl}>\n${summary}<p class="ref-meta">${who ? `<span class="who">${who}</span>` : ""}<span class="links">${links}</span></p></article>`,
  );

  // 4. toggles that hold several references
  html = html.replace(/<details class="toggle">\n<summary>([\s\S]*?)<\/summary>\n<div class="body">([\s\S]*?)<\/div>\n<\/details>/g, (m, sum, body) => {
    const n = (body.match(/class="ref"/g) || []).length;
    return n >= 2 ? m.replace(`<summary>${sum}</summary>`, `<summary>${sum} <span class="count">${n}</span></summary>`) : m;
  });

  // 1. numbered (and themed) sections
  const sections: { id: string; title: string; theme?: string; n: string }[] = [];
  let k = 0;
  html = html.replace(/<section class="panel"( data-theme-id="([\w-]+)")?>\n<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g, (_m, _a, theme, id, title) => {
    const t = theme && themeName.get(theme);
    const n = t ? t.n : String(++k).padStart(2, "0");
    sections.push({ id, title: strip(title), theme, n });
    return `<section class="panel"${theme ? ` data-theme-id="${theme}"` : ""}>\n<p class="sec-mark" aria-hidden="true">${theme ? `<span class="glyph"></span>` : ""}<span class="num">${n}</span></p>\n<h2 id="${id}">${title}</h2>`;
  });

  // 2. section map. Pages without section blocks can map their main headings instead.
  if (!sections.length && opts.mapHeadings) {
    const top = [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)];
    if (top.length >= 4) top.forEach((m) => sections.push({ id: m[1], title: strip(m[2]), n: "" }));
  }
  let hasMap = false;
  if (sections.length >= 3) {
    hasMap = true;
    const map = `<nav class="section-map" aria-label="Sections on this page">${sections
      .map((s) => `<a href="#${s.id}"${s.theme ? ` data-theme-id="${s.theme}"` : ""}>${s.theme ? `<span class="glyph" aria-hidden="true"></span>` : ""}${s.n ? `<span class="num">${s.n}</span>` : ""}<span class="t">${s.title}</span></a>`)
      .join("")}</nav>`;
    const sf = html.match(/^\s*<div class="standfirst">[\s\S]*?<\/div>\n?/);
    html = sf ? html.replace(sf[0], sf[0] + map + "\n") : map + "\n" + html;
  }
  return { html, hasMap };
}
