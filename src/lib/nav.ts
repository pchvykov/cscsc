// The site menu: the fixed sections in data/site.ts, with the Gatherings menu
// listing every event marked `featured: true` (newest first), so a new main
// gathering appears in the menu as soon as its event file exists.
import { getCollection } from "astro:content";
import { nav, type NavSection } from "../data/site";

export async function siteNav(): Promise<NavSection[]> {
  const featured = (await getCollection("events", (e) => e.data.featured)).sort((a, b) => +b.data.date - +a.data.date);
  const items = featured.map((e) => ({
    label: e.data.short ?? e.data.title,
    href: `/gatherings/${e.id}/`,
    note: [e.data.place, e.data.date.getUTCFullYear()].filter(Boolean).join(", "),
  }));
  return nav.map((s) => (s.label === "Gatherings" ? { ...s, items: [s.items[0], ...items, ...s.items.slice(1)] } : s));
}
