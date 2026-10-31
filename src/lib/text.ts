// Notion page titles were sometimes typed in capitals as visual headings
// ("ABOUT CSCSC"); on this site the heading style does that job.
export function titleCase(s: string) {
  if (s !== s.toUpperCase()) return s;
  const keep = new Set(["CSCSC", "CSCSC25", "CCS26", "AI", "&"]);
  return s.split(" ").map((w, i) => keep.has(w) ? w : i === 0 ? w[0] + w.slice(1).toLowerCase() : w.toLowerCase()).join(" ");
}

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) =>
  d.toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
