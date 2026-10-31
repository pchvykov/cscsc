# CLAUDE.md - complexitycontemplation.org

Astro static site (pinned `astro` in package.json). `npm install`, then `npm run dev` / `npm run build` (output in `dist/`).

## Where things live
- `src/content/<collection>/*.md` - all content. One file per event, post, video, person, publication, resource row. Schemas in `src/content.config.ts`; the build fails on a malformed entry.
- `src/content/pages/**.md` - free-standing pages; `path:` in frontmatter is the URL. `_hub.md` files hold the intro text of index pages that are built by templates.
- `src/pages/` - templates and index pages. `src/data/site.ts` - nav, footer and external links (one place).
- `src/styles/global.css` - all tokens and shared components; `home.css` only for the home page.
- `public/` - files served as-is: the vision animation (`/vision/`), CCS26 QR pages (`/ccs26/`), page images (`/media/`), home/card images (`/assets/`).

## Writing content: the building blocks
Markdown for text. For anything more, use these few HTML wrappers (leave a blank line inside each so Markdown still works) - nothing else, so every page looks like the same site:
- `<div class="standfirst">` - the opening line of a page, set large.
- `<section class="panel">` starting with a `##` heading - a titled section.
- `<aside class="note">` - a short aside to the main text.
- `<div class="columns" style="--cols:1fr 1fr">` with `<div class="col">` children - side by side; put `<div class="card-box">` in each col for a grid of parallel items.
- `<details class="toggle"><summary>Title</summary><div class="body">...</div></details>` - an accordion row (HTML only inside `<summary>`).
- `<a class="page-link" href="...">Title</a>` - a link to another page, as an index row; `<a class="more-link" href="...">See more ...</a>` - a button-style link.
- `<dl class="terms">` with `<div><dt>Term</dt><dd>Definition</dd></div>` - term/definition lists (glossary).
- Research themes: add `data-theme-id="relational|agency|imaginaries|practice|epistemology"` to a `<section class="panel">` and it takes that theme's number, colour and glyph (defined once in `src/data/themes.ts`, glyphs in `public/assets/glyphs/`). Colour is used only for themes.
- Applied automatically to every page by `src/lib/enhance.ts` (don't hand-write these): sections are numbered; a page with 3+ sections (or 4+ main headings) gets a section map under its opening line; a reference (heading, summary, optional italic author line, link line) becomes a compact entry; a toggle holding several references shows the count.
- No emoji as icons, no colour classes. Headings start at `##` (the page title is the h1) and don't skip levels.

## Design review
After a design change or a new kind of block, run the `design-critic` agent (`.claude/agents/design-critic.md`) on desktop (1280 px) and phone (390 px) screenshots of the affected page types. It checks for both failure modes - the wall of undifferentiated text and the Notion-style patchwork of colours and boxes - and returns site-wide fixes.

## Rules
- Text migrated from Notion stays verbatim. New copy follows the voice guide (prose-style) and gets Pavel's review.
- No personal email addresses or other PII in this public repo. Contact email is obfuscated (`a.mail` with data-u / data-d).
- Images: webp, under ~600 KB, in `public/media/` or `public/assets/`.

## Commit Rule: Every Step
```bash
git add -A && git commit -m "Prefix: description" && git pull --rebase && git push
```
Prefixes: `Add:` / `Update:` / `Complete:` / `Fix:` / `Archive:`
