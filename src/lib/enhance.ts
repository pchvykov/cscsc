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
//  5. Shapes Notion left behind get a proper role:
//     - a page whose body opens with its only h2 (a repeated page title) gets that
//       line as its standfirst, and its h3/h4 sections move up a level;
//     - a page opening with a quote, or with a heading and an italic line, gets them as its standfirst;
//     - a short paragraph that is all bold is a label (.lead-in), or, right under a heading,
//       that heading's question (.dek); a heading that is a bold sentence plus more becomes a .dek too;
//     - a list whose items all open with a bold or linked name, and run long, is a
//       list of labelled items (.leads);
//     - a card whose first line is just a link or a bold name gets that line as its title (.ct).
import { themes } from "../data/themes";

const themeName = new Map(themes.map((t) => [t.id, t]));
const strip = (h: string) => h.replace(/<[^>]+>/g, "").trim();

export function enhance(html: string, opts: { mapHeadings?: boolean } = {}): { html: string; hasMap: boolean } {
  // 5. Notion shapes
  html = html.replace(/(<h[2-4][^>]*>)(?:\s|\u00a0|&nbsp;)+/g, "$1"); // stray leading spaces in headings
  const h2s = html.match(/<h2[ >]/g) || [];
  const lead = html.match(/^\s*<h2 id="[^"]+">([\s\S]*?)<\/h2>\n/);
  if (lead && h2s.length === 1 && /<h3[ >]/.test(html)) {
    html = html.replace(lead[0], `<div class="standfirst"><p>${lead[1]}</p></div>\n`)
      .replace(/<(\/?)h3([ >])/g, "<$1h2$2").replace(/<(\/?)h4([ >])/g, "<$1h3$2").replace(/<(\/?)h5([ >])/g, "<$1h4$2");
  }
  html = html.replace(/^\s*<blockquote>\n?([\s\S]*?)<\/blockquote>\n/, `<div class="standfirst">$1</div>\n`);
  html = html.replace(/^\s*<h2 id="[^"]+">([\s\S]*?)<\/h2>\n(<p><em>[\s\S]*?<\/em><\/p>)\n/, `<div class="standfirst"><p><strong>$1</strong></p>$2</div>\n`);
  // a card's title first, so a bold-only first line of a card stays its title
  html = html.replace(/(<div class="card-box">\n)<p>((?:<a [^>]+>(?:(?!<\/?a[ >])[\s\S])*<\/a>|<strong>[^<]*<\/strong>))<\/p>/g, '$1<p class="ct">$2</p>');
  // a short bold-only line is a label; right under a heading it is that heading's question (.dek)
  html = html.replace(/(<\/h[23]>\n|<\/p>\n|<\/ul>\n|<\/ol>\n|<div class="[\w-]+">\n|^)?<p><strong>((?:(?!<\/?(?:p|strong)>)[\s\S])+)<\/strong><\/p>/g, (m, before = "", text) =>
    /^<\/h[23]>/.test(before) ? (strip(text).length > 160 ? m : `${before}<p class="dek">${text}</p>`) : strip(text).length > 80 ? m : `${before}<p class="lead-in">${text}</p>`);
  // a heading that is really a sentence or two reads as the dek of the heading above it
  html = html.replace(/<h([34]) id="[^"]+">([\s\S]*?)<\/h\1>/g, (m, _l, inner) => (strip(inner).length > 90 && /^<strong>[^<]+<\/strong>\s*\S/.test(inner) ? `<p class="dek">${inner}</p>` : m));
  html = html.replace(/<ul>\n?((?:(?!<\/?ul>)[\s\S])*)<\/ul>/g, (m, inner) => {
    const items = inner.match(/<li>[\s\S]*?<\/li>/g) || [];
    if (items.length < 2 || !items.every((li: string) => /^<li>(?:<u>)?(?:<strong>|<a )/.test(li))) return m;
    const avg = items.reduce((n: number, li: string) => n + strip(li).length, 0) / items.length;
    // the name now stands on its own line, so a non-breaking space after it would indent the text
    return avg > 80 ? m.replace("<ul>", '<ul class="leads">').replace(/(<li>(?:<u>)?<strong>[^<]*<\/strong>(?:<\/u>)?)\u00a0/g, "$1 ") : m;
  });

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
