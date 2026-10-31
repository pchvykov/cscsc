// Content collections: one folder per kind of thing on the site. Adding a file
// to a folder is all it takes for it to appear on the right index pages.
// The schemas make the build fail on a malformed entry instead of shipping it.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const md = (dir: string) => glob({ base: `./src/content/${dir}`, pattern: "**/[^_]*.md" });
const notion = {
  notion_id: z.string().optional(),
  notion_edited: z.string().optional(),
  icon: z.string().optional(),
  cover: z.string().optional(),
};
const list = z.array(z.string()).default([]);

// Free-standing pages; `path` is the URL they are served at.
const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
    ...notion,
  }),
});

const events = defineCollection({
  loader: md("events"),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    end_date: z.coerce.date().optional(),
    tags: list, // call | retreat | conference | external | reading-group | working-group
    place: z.string().optional(),
    summary: z.string().optional(), // one line for lists
    image: z.string().optional(), // card image
    featured: z.boolean().default(false), // big gathering with its own card
    ...notion,
  }),
});

const posts = defineCollection({
  loader: md("posts"),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string().nullable().optional(),
    tags: list,
    excerpt: z.string().optional(),
    reading_time: z.string().optional(),
    authors: list, // ids in the people collection
    draft: z.boolean().default(false),
    notion_loose_page: z.boolean().optional(),
    ...notion,
  }),
});

const people = defineCollection({
  loader: md("people"),
  schema: z.object({
    name: z.string(),
    roles: z.array(z.enum(["organizer", "advisor", "speaker", "author"])),
    affiliation: z.string().optional(),
    field: z.string().optional(),
    photo: z.string().optional(),
    photo_ok: z.boolean().default(false), // consent to show the photo
    website: z.string().url().optional(),
    order: z.number().default(100),
    events: list,
  }),
});

const videos = defineCollection({
  loader: md("videos"),
  schema: z.object({
    title: z.string(),
    youtube: z.string().optional(), // video id
    url: z.string().optional(), // for videos hosted elsewhere
    date: z.coerce.date(),
    duration: z.string().optional(),
    kind: z.enum(["film", "talk", "recording", "animation"]).default("talk"),
    event: z.string().optional(), // id in the events collection
    speakers: list,
    featured: z.boolean().default(false),
  }),
});

const publications = defineCollection({
  loader: md("publications"),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kind: z.enum(["proceedings", "report", "paper", "preprint", "essay"]),
    authors: z.string().optional(),
    href: z.string(), // where to read it (site path or external link)
    event: z.string().optional(),
    summary: z.string().optional(),
  }),
});

// The three resource databases carried over from Notion. Field names follow
// the Notion columns; most are optional because Notion rows are uneven.
const str = z.string().optional();
const num = z.number().optional();
const centers = defineCollection({
  loader: md("centers"),
  schema: z.object({
    title: z.string(), website: str, city: str, country: list, year_founded: num,
    cscsc_relevance: num, cscsc_relevance_explanation: str, academic_rigor: num, academic_rigor_explanation: str,
    primary_emphasis_tags: list, institution_type_tags: list, activity_tags: str, scope_tags: str, size_tags: list,
    research_focus: str, key_programs: str, notable_leaders: str, academic_affiliations: str,
    career_tags: list, employment_tags: list, collaboration_tags: list, publication_tags: list, funding_tags: list,
    ...notion,
  }),
});
const funding = defineCollection({
  loader: md("funding"),
  schema: z.object({
    title: z.string(), website: str, status: str, status_details: str,
    relevance_tag: list, relevance_explanation: str, funding_purpose: list, funding_purpose_details: str,
    grant_size_tag: list, grant_size_range: str, geographic_focus: list, deadline_type: str, deadline_details: str,
    competitiveness: list, competition_details: str, application_process: str, time_commitment: str, time_commitment_details: str,
    multi_year_funding: list, multi_year_details: str, values_priorities: str,
    ...notion,
  }),
});
const outlets = defineCollection({
  loader: md("outlets"),
  schema: z.object({
    title: z.string(), website: str, publisher: str, type: list, relevance_score: num, relevance_reasoning: str,
    content_tags: list, content_topics: str, values_tags: list, values_emphasis: str, open_access: list, publication_fee: str,
    competitiveness: list, impact_factor: str, other_metrics: str, submission_process: str, deadline_type: str, additional_info: str,
    ...notion,
  }),
});

export const collections = { pages, events, posts, people, videos, publications, centers, funding, outlets };
