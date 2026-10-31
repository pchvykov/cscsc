import { getCollection } from "astro:content";
import type { APIContext } from "astro";

const x = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export async function GET({ site }: APIContext) {
  const posts = (await getCollection("posts", (p) => !p.data.draft)).sort((a, b) => +b.data.date - +a.data.date);
  const items = posts.map((p) => {
    const url = new URL(`/writing/${p.id}/`, site).href;
    return `<item><title>${x(p.data.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${p.data.date.toUTCString()}</pubDate>${p.data.excerpt ? `<description>${x(p.data.excerpt)}</description>` : ""}</item>`;
  }).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Complexity &amp; Contemplation · Writing</title><link>${new URL("/writing/", site).href}</link><description>Writing from the Complexity Science &amp; Contemplative Studies Consortium</description>${items}</channel></rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
