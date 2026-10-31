// The three resource databases: what each table shows, and how each detail
// page lays out the Notion columns.
import type { Col } from "../components/DataView.astro";

type Kind = "centers" | "funding" | "outlets";
export const RES: Record<Kind, {
  title: string; noun: string; dek: string; cols: Col[]; facet: { key: string; label: string };
  sort: string; blurb: string; fields: [string, string][];
  key: string[]; // short fields shown in the facts panel of a detail page
}> = {
  centers: {
    title: "Research centers", noun: "centers",
    dek: "Leading institutions bridging complexity, contemplation, and consciousness research worldwide.",
    cols: [
      { key: "country", label: "Country" },
      { key: "primary_emphasis_tags", label: "Emphasis" },
      { key: "institution_type_tags", label: "Type" },
      { key: "cscsc_relevance", label: "Relevance", num: true, max: 10 },
      { key: "academic_rigor", label: "Rigor", num: true, max: 10 },
      { key: "activity_tags", label: "Activity" },
    ],
    facet: { key: "primary_emphasis_tags", label: "emphasis" }, sort: "cscsc_relevance", blurb: "research_focus",
    key: ["country", "city", "year_founded", "institution_type_tags", "primary_emphasis_tags", "activity_tags", "cscsc_relevance", "academic_rigor"],
    fields: [
      ["research_focus", "Research focus"], ["key_programs", "Key programs"], ["notable_leaders", "Notable leaders"],
      ["city", "City"], ["country", "Country"], ["year_founded", "Founded"], ["academic_affiliations", "Academic affiliations"],
      ["primary_emphasis_tags", "Primary emphasis"], ["institution_type_tags", "Institution type"], ["activity_tags", "Activity"],
      ["scope_tags", "Scope"], ["size_tags", "Size"], ["funding_tags", "Funding"], ["career_tags", "Careers"],
      ["employment_tags", "Employment"], ["collaboration_tags", "Collaboration"], ["publication_tags", "Publication output"],
      ["cscsc_relevance", "CSCSC relevance (/10)"], ["cscsc_relevance_explanation", "Why it is relevant"],
      ["academic_rigor", "Academic rigor (/10)"], ["academic_rigor_explanation", "On its rigor"],
    ],
  },
  funding: {
    title: "Funding opportunities", noun: "funders",
    dek: "Major funding sources supporting contemplative science, consciousness research, and complex systems.",
    cols: [
      { key: "relevance_tag", label: "Relevance" },
      { key: "funding_purpose", label: "Funds" },
      { key: "grant_size_range", label: "Grant size", sort: false },
      { key: "deadline_type", label: "Deadlines" },
      { key: "geographic_focus", label: "Where" },
      { key: "status", label: "Status" },
    ],
    facet: { key: "relevance_tag", label: "relevance" }, sort: "", blurb: "relevance_explanation",
    key: ["status", "relevance_tag", "grant_size_range", "deadline_type", "geographic_focus", "competitiveness"],
    fields: [
      ["relevance_tag", "Relevance"], ["relevance_explanation", "Why it is relevant"], ["funding_purpose", "Funding purpose"],
      ["funding_purpose_details", "Purpose details"], ["values_priorities", "Values and priorities"], ["grant_size_tag", "Grant size"],
      ["grant_size_range", "Grant size range"], ["multi_year_funding", "Multi-year funding"], ["multi_year_details", "Multi-year details"],
      ["geographic_focus", "Geographic focus"], ["deadline_type", "Deadline type"], ["deadline_details", "Deadline details"],
      ["application_process", "Application process"], ["competitiveness", "Competitiveness"], ["competition_details", "Competition details"],
      ["time_commitment", "Time commitment"], ["time_commitment_details", "Time commitment details"], ["status", "Status"], ["status_details", "Status details"],
    ],
  },
  outlets: {
    title: "Publication outlets", noun: "outlets",
    dek: "High-quality venues for sharing research bridging complexity, contemplation, and consciousness.",
    cols: [
      { key: "type", label: "Type" },
      { key: "content_tags", label: "Topics" },
      { key: "relevance_score", label: "Relevance", num: true, max: 5 },
      { key: "open_access", label: "Open access" },
      { key: "publication_fee", label: "Fee", sort: false },
      { key: "deadline_type", label: "Deadlines" },
    ],
    facet: { key: "type", label: "type" }, sort: "relevance_score", blurb: "relevance_reasoning",
    key: ["publisher", "type", "relevance_score", "open_access", "publication_fee", "impact_factor", "competitiveness"],
    fields: [
      ["publisher", "Publisher"], ["type", "Type"], ["content_tags", "Topics"], ["content_topics", "Content"],
      ["relevance_score", "Relevance (/5)"], ["relevance_reasoning", "Why it is relevant"], ["values_tags", "Values"],
      ["values_emphasis", "Values emphasis"], ["open_access", "Open access"], ["publication_fee", "Publication fee"],
      ["impact_factor", "Impact factor"], ["other_metrics", "Other metrics"], ["competitiveness", "Competitiveness"],
      ["submission_process", "Submission process"], ["deadline_type", "Deadline type"], ["additional_info", "Additional info"],
    ],
  },
};
export const KINDS = Object.keys(RES) as Kind[];
