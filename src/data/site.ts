// Site-wide links and navigation. Everything that appears in the header,
// footer or "join" blocks is defined here once.

export const links = {
  emailSignup: "https://www.notion.so/286d8cae0cfe8031833ac1a301824aa0",
  forum: "https://www.hylo.com/groups/cscsc/join/FfOYDYCOfG",
  youtube: "https://www.youtube.com/@cscs.conference/videos",
  calendar: "https://www.hylo.com/groups/cscsc/events", // Hylo events; members only
  workAlivePractice: "https://workalive.lovable.app/",
  workAliveApp: "https://www.workalive.space/",
  vision: "/vision/",
};

export const email = { user: "cscs.conference", domain: "gmail.com" };

export type NavItem = { label: string; href: string; note?: string };
export type NavSection = { label: string; base: string; items: NavItem[] };

export const nav: NavSection[] = [
  {
    label: "Research", base: "/research",
    items: [
      { label: "Research programs", href: "/research/" },
      { label: "Core questions", href: "/research/questions/", note: "What we are asking" },
      { label: "Publications", href: "/research/publications/", note: "Proceedings, reports and essays" },
    ],
  },
  {
    label: "Gatherings", base: "/gatherings",
    items: [
      { label: "Upcoming and past", href: "/gatherings/" },
      // featured gatherings are inserted here from the events collection (lib/nav.ts)
      { label: "Calls and reading groups", href: "/gatherings/calls/" },
    ],
  },
  {
    label: "Learn", base: "/learn",
    items: [
      { label: "Learning center", href: "/learn/" },
      { label: "New to complexity?", href: "/learn/new-to-complexity/" },
      { label: "Why contemplation?", href: "/learn/why-contemplation/" },
      { label: "Already in the conversation", href: "/learn/already-in-the-conversation/" },
      { label: "Our language", href: "/learn/glossary/", note: "A shared glossary" },
      { label: "Practice menu", href: "/learn/practices/", note: "10-minute practices across traditions" },
    ],
  },
  {
    label: "Watch & read", base: "/watch",
    items: [
      { label: "Blog", href: "/blog/", note: "Essays, reflections and call write-ups" },
      { label: "Videos", href: "/videos/", note: "Talks, films and recordings" },
      { label: "The vision", href: "/vision/", note: "An animated introduction" },
    ],
  },
  {
    label: "Resources", base: "/resources",
    items: [
      { label: "Overview", href: "/resources/" },
      { label: "Research centers", href: "/resources/centers/" },
      { label: "Funding", href: "/resources/funding/" },
      { label: "Publication outlets", href: "/resources/outlets/" },
      { label: "Tools", href: "/resources/tools/", note: "Work Alive, the episteme questionnaire" },
    ],
  },
  {
    label: "About", base: "/about",
    items: [
      { label: "About us", href: "/about/" },
      { label: "People", href: "/about/people/", note: "Organizers, advisors, speakers" },
      { label: "Join", href: "/join/" },
    ],
  },
];

// Which top-level section a path belongs to (for the "you are here" mark).
export function sectionOf(path: string): string | undefined {
  const p = path.endsWith("/") ? path : path + "/";
  if (p.startsWith("/blog/") || p.startsWith("/videos/") || p.startsWith("/vision/")) return "Watch & read";
  return nav.find((s) => p.startsWith(s.base + "/"))?.label;
}

export const episteme = "https://docs.google.com/forms/d/e/1FAIpQLSe8AJZI5L1pYQMsgnN19smBsMw11G3uc_Ap_U9uRkjdEQoBbw/viewform";
