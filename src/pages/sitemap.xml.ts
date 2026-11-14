// A plain sitemap of every built page, for search engines.
import type { APIContext } from "astro";

export async function GET({ site }: APIContext) {
  const { getCollection } = await import("astro:content");
  const urls = new Set<string>(["/", "/vision/", "/join/", "/videos/", "/blog/", "/gatherings/", "/gatherings/calls/", "/resources/", "/resources/tools/", "/about/people/"]);
  for (const p of await getCollection("pages", (p) => !p.data.draft && !p.id.startsWith("_") && !p.id.includes("_hub"))) urls.add(p.data.path);
  for (const e of await getCollection("events")) urls.add(`/gatherings/${e.id}/`);
  for (const p of await getCollection("posts", (p) => !p.data.draft)) urls.add(`/blog/${p.id}/`);
  for (const kind of ["centers", "funding", "outlets"] as const) {
    urls.add(`/resources/${kind}/`);
    for (const r of await getCollection(kind)) urls.add(`/resources/${kind}/${r.id}/`);
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].map((u) => `<url><loc>${new URL(u, site).href}</loc></url>`).join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
