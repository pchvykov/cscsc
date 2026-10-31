import { getCollection, type CollectionEntry } from "astro:content";
import { fmtDate } from "./text";

export type Ev = CollectionEntry<"events">;
export const kindOf = (e: Ev) =>
  e.data.tags.includes("call") ? "Call" : e.data.tags.includes("retreat") ? "Retreat" : e.data.tags.includes("conference") ? "Conference" : e.data.tags.includes("external") ? "Elsewhere" : "Gathering";

export function when(e: Ev) {
  const a = e.data.date, b = e.data.end_date;
  if (!b) return fmtDate(a);
  const sameMonth = a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear();
  return sameMonth ? `${a.getUTCDate()}-${fmtDate(b)}` : `${fmtDate(a, { day: "numeric", month: "short" })} - ${fmtDate(b)}`;
}

export async function allEvents() {
  const evs = await getCollection("events");
  const today = new Date(new Date().toISOString().slice(0, 10)); // start of today, UTC
  const slack = new Date(today.getTime() - 2 * 864e5);
  const upcoming = evs.filter((e) => (e.data.end_date ?? e.data.date) >= slack).sort((a, b) => +a.data.date - +b.data.date);
  const past = evs.filter((e) => (e.data.end_date ?? e.data.date) < today).sort((a, b) => +b.data.date - +a.data.date);
  return { evs, upcoming, past };
}
