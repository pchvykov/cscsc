// Shared content for the home-page prototypes. In the Astro build these come
// from the events / blog / outputs collections; here they are hand-copied
// from Notion (2026-10-28) so all three prototypes show the same real items.
// URLs mirror PROJECTS/cscsc-community/LINKS.md.
window.CSCSC = {
  links: {
    join: "https://www.notion.so/286d8cae0cfe8031833ac1a301824aa0",
    hylo: "https://www.hylo.com/groups/cscsc/join/FfOYDYCOfG",
    youtube: "https://www.youtube.com/@cscs.conference/videos",
    vision: "/",
    email: "mailto:cscs.conference@gmail.com",
    calendar: "https://cscsc.notion.site/30cd8cae0cfe8035b132f5ba0d4ddc55?v=30cd8cae0cfe80a29eba000c185bc0a6",
    workalive: "https://workalive.lovable.app/",
  },
  // Dated items, newest first. kind: event | output | video
  now: [
    { date: "2026-10-30", kind: "event", label: "Community call",
      title: "October community call: what we brought back from New York",
      blurb: "Open space on a review paper and a platform for independent researchers.", href: "#" },
    { date: "2026-10-15", kind: "event", label: "Conference satellite",
      title: "Complex Systems & Contemplative Studies at CCS26, Binghamton NY",
      blurb: "About twenty people, keynotes by Michael Levin and Alan Rodrigues, and an afternoon of open space. Talks are going up on YouTube.", href: "#" },
    { date: "2026-09-27", kind: "event", label: "Retreat",
      title: "Work Alive retreat, French Pyrenees",
      blurb: "A week of working as practice, and the first sessions with the Work Alive app.", href: "#" },
    { date: "2026-09-20", kind: "output", label: "Workshop",
      title: "Honest Science workshop, French Pyrenees",
      blurb: "Nine talks, a map of the room's research questions, and a ritual arc the group wrote together. Proceedings are on the way.", href: "#" },
  ],
  posts: [
    { date: "2026-08-18", cat: "Contemplations", title: "What could science actually offer the spiritual path?",
      excerpt: "A few quick ideas on what science and spirituality might offer each other.", author: "Matthew McCarthy" },
    { date: "2026-08-07", cat: "Contemplations", title: "From systems thinking to systems sensing",
      excerpt: "Reflecting on July's community call.", author: "Matthew McCarthy" },
    { date: "2026-07-30", cat: "Resource shares", title: "What changes when the body is made part of the inquiry?",
      excerpt: "Some recent research on how to engage the body more within scientific inquiry.", author: "Matthew McCarthy" },
  ],
  // The five questions from the Honest Science research-mapping board.
  questions: [
    "What kind of world are we in?",
    "What kind of beings are we?",
    "How can things become knowable?",
    "Whose ways of knowing count?",
    "What does knowledge do?",
  ],
};

window.CSCSC.fmt = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
