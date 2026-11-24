// schema.org structured data (JSON-LD) for search engines. Rendered by Base.astro via the jsonLd prop.
import { links } from "../data/site";

const SITE = "https://complexitycontemplation.org";
const abs = (path: string) => new URL(path, SITE).href;

export const org = {
  "@type": "Organization",
  "@id": `${SITE}/#org`,
  name: "Complexity Science & Contemplative Studies Consortium",
  alternateName: ["Complexity & Contemplation", "CSCSC"],
  url: `${SITE}/`,
  logo: abs("/favicon-512.png"),
  image: abs("/og-image.jpg"),
  description: "Complexity science and contemplative practice, from meditation and mindfulness research to prayer: how complex systems self-organize, from cells to societies.",
  knowsAbout: ["Complexity science", "Complex systems", "Contemplative science", "Contemplative traditions", "Meditation research", "Mindfulness research", "Contemplative prayer"],
  // The old Notion site is listed so search engines tie its reputation to this one.
  sameAs: [links.youtube.replace(/\/videos$/, ""), "https://www.hylo.com/groups/cscsc", "https://cscsc.notion.site/CSCSC-286d8cae0cfe813290abf9eb6acd731c"],
};

export function homeLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [org, { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: org.name, alternateName: org.alternateName, publisher: { "@id": org["@id"] } }],
  };
}

export function postLd(p: { title: string; date: Date; description?: string; image?: string; authors: string[]; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    datePublished: p.date.toISOString().slice(0, 10),
    ...(p.description && { description: p.description }),
    image: abs(p.image ?? "/og-image.jpg"),
    author: p.authors.length ? p.authors.map((name) => ({ "@type": "Person", name })) : { "@id": org["@id"] },
    publisher: { "@type": "Organization", "@id": org["@id"], name: org.name, logo: org.logo },
    mainEntityOfPage: abs(p.path),
  };
}

export function eventLd(e: { title: string; date: Date; end_date?: Date; place?: string; tags: string[]; description?: string; image?: string; path: string }) {
  // Calls and groups meet online; anything else needs a stated place, or it gets no markup (search engines require a location).
  const online = /online/i.test(e.place ?? "") || (!e.place && e.tags.some((t) => ["call", "reading-group", "working-group"].includes(t)));
  if (!online && !e.place) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.date.toISOString().slice(0, 10),
    ...(e.end_date && { endDate: e.end_date.toISOString().slice(0, 10) }),
    eventAttendanceMode: `https://schema.org/${online ? "Online" : "Offline"}EventAttendanceMode`,
    eventStatus: "https://schema.org/EventScheduled",
    location: online ? { "@type": "VirtualLocation", url: abs(e.path) } : { "@type": "Place", name: e.place, address: e.place },
    ...(e.description && { description: e.description }),
    image: abs(e.image ?? "/og-image.jpg"),
    url: abs(e.path),
    // Events hosted by others (tag "external") are listed, not organized, by us.
    ...(!e.tags.includes("external") && { organizer: { "@type": "Organization", "@id": org["@id"], name: org.name, url: org.url } }),
  };
}
