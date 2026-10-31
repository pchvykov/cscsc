# CLAUDE.md - complexitycontemplation.org

Astro static site (pinned `astro` in package.json). `npm install`, then `npm run dev` / `npm run build` (output in `dist/`).

## Where things live
- `src/content/<collection>/*.md` - all content. One file per event, post, video, person, publication, resource row. Schemas in `src/content.config.ts`; the build fails on a malformed entry.
- `src/content/pages/**.md` - free-standing pages; `path:` in frontmatter is the URL. `_hub.md` files hold the intro text of index pages that are built by templates.
- `src/pages/` - templates and index pages. `src/data/site.ts` - nav, footer and external links (one place).
- `src/styles/global.css` - all tokens and shared components; `home.css` only for the home page.
- `public/` - files served as-is: the vision animation (`/vision/`), CCS26 QR pages (`/ccs26/`), page images (`/media/`), home/card images (`/assets/`).

## Rules
- Text migrated from Notion stays verbatim. New copy follows the voice guide (prose-style) and gets Pavel's review.
- No personal email addresses or other PII in this public repo. Contact email is obfuscated (`a.mail` with data-u / data-d).
- Images: webp, under ~600 KB, in `public/media/` or `public/assets/`.

## Commit Rule: Every Step
```bash
git add -A && git commit -m "Prefix: description" && git pull --rebase && git push
```
Prefixes: `Add:` / `Update:` / `Complete:` / `Fix:` / `Archive:`
