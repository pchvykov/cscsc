// Notion page titles were sometimes typed in capitals as visual headings
// ("ABOUT CSCSC"); on this site the heading style does that job.
export function titleCase(s: string) {
  if (s !== s.toUpperCase()) return s;
  const keep = new Set(["CSCSC", "CSCSC25", "CCS26", "AI", "&"]);
  return s.split(" ").map((w, i) => keep.has(w) ? w : i === 0 ? w[0] + w.slice(1).toLowerCase() : w.toLowerCase()).join(" ");
}

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) =>
  d.toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });

// A plain-text summary of a Markdown body, for <meta name="description"> and
// link previews when an entry has no excerpt of its own.
export function summarize(body = "", max = 160) {
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line || /^(#|<|---|\||!|\[.*\]\(.*\)$)/.test(line)) continue;
    const text = line.replace(/<[^>]+>/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`~>]/g, "").replace(/\\(.)/g, "$1").replace(/\s+/g, " ").trim();
    if (text.length < 40) continue;
    return text.length > max ? text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…" : text;
  }
  return undefined;
}
