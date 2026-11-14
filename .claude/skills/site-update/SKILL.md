---
name: site-update
description: Add or update complexitycontemplation.org whenever CSCSC puts out something new and public - a video or call recording, a call or event, a blog post, a publication or proceedings, a new main gathering - and close out pages after an event. Use when someone says "add this to the website", "put the new video / call / post on the site", "update the site", or hands over a YouTube link, event details, a post, or a PDF for the site.
---

# Updating complexitycontemplation.org

The site is a static Astro site in **github.com/pchvykov/cscsc**. Every push to `main` builds and publishes it (GitHub Actions, about a minute). Content is one Markdown file per thing in `src/content/<collection>/`; lists, menus, "Latest", the RSS feed and the sitemap update themselves from those files. Read the repo's `CLAUDE.md` first (content building blocks and design rules).

You draft and verify; a person approves. Show the human what you will add (file contents) before pushing, unless they told you to go ahead.

## Ground rules
- **Only facts you can source.** Take titles, dates, names and numbers from the item itself (YouTube page, email, event doc, the author). Never fill gaps with plausible detail; ask, or leave the field out. A wrong summary on a public page is worse than a short one.
- **Copy stays plain and dated-proof.** No "coming soon", "going up", "next", "on the way" in summaries; name things by date or year. For something not yet out, say "in preparation".
- **Upcoming calls and events are announced by email.** The site may list an upcoming event, but never point people to a calendar as the source of dates.
- **Public repo:** no personal email addresses, phone numbers or other personal data. The contact address is obfuscated (`class="mail"`).
- **Typography:** no em dash (—); use " - ". New text follows the CSCSC voice (plain, concrete, no hype).
- Images: `.webp`, under ~600 KB, max 2000 px wide, in `public/media/`, with alt text.

## Setup
```bash
git clone https://github.com/pchvykov/cscsc.git   # or: git pull in an existing clone
cd cscsc && npm install                               # first time only
```
Work on `main`. (A `site-v2` branch exists from the migration; if it is checked out, push to both: `git push origin HEAD:site-v2 HEAD:main`.)

## What to do for each kind of content

### A video or call recording (YouTube)
1. Get the facts: `yt-dlp --skip-download --print "%(title)s|%(duration_string)s|%(upload_date)s" <url>` (in Pavel's vault: `venv/bin/yt-dlp`).
2. Add `src/content/videos/<yyyy-mm-dd>-<slug>.md`:
   ```yaml
   ---
   title: "Title as on YouTube"
   youtube: "<video id>"
   date: "YYYY-MM-DD"        # the day it was recorded or released
   duration: "mm:ss"
   kind: "recording"          # talk | recording | film | animation
   event: "<event id>"        # filename of the event in src/content/events/, if it belongs to one
   featured: false            # true only for a few "start here" videos
   ---
   ```
   It then appears on /videos/, on the event's page under Recordings, and (for calls) on /gatherings/calls/.
3. If the recording belongs to a call that has no event file yet, add the event too (next section).

### A call, reading-group session or other online meeting
Add `src/content/events/<yyyy-mm>-<slug>.md`:
```yaml
---
title: "October community call: <topic>"
date: "YYYY-MM-DD"
tags: ["call"]                 # call | reading-group | working-group | retreat | conference | external
summary: "One plain line on what it was about."
---
Optional body: the announcement text or a short description.
```
Before the date it shows as upcoming (Gatherings, Calls, home "Latest"); after the date it moves to past by itself, and a page with body text gets a note that it took place. An event without body text shows its summary under the title.

### A blog post
Use the `cscsc-blog-post` skill in the cscsc-community repo for writing it. To publish, add `src/content/posts/<slug>.md` with frontmatter `title, date, category, tags, excerpt, reading_time, authors` (copy an existing post; `authors` are ids from `src/content/people/`, add a people file for a new author). It appears on /blog/, home "Latest" and the RSS feed.

### A publication, proceedings or report
Add `src/content/publications/<yyyy>-<slug>.md`:
```yaml
---
title: "..."
date: "YYYY-MM-DD"
kind: "proceedings"      # proceedings | report | paper | preprint | essay
href: "<link or site path>"
event: "<event id>"      # optional
authors: "..."           # optional
summary: "One line."
---
```
It appears in the Outputs section at the bottom of /research/. If it replaces something "in preparation" (for example the Honest Science proceedings line in `src/pages/[...slug].astro`), remove that line.

### A new main gathering (retreat, conference, workshop)
1. Add its event file as above, with `featured: true`, `short: "<menu name>"`, `place`, `end_date`, and `image:` (card photo in `public/media/` or `public/assets/`).
2. It then gets a card on /gatherings/ and an entry in the Gatherings menu automatically.
3. Wrap anything that only matters before the event (prices, early-bird notes, sign-up and registration links, "can't make it?" forms) in
   `<div class="until-end">` ... `</div>` (blank lines inside), or `<span class="until-end">` inline. These hide themselves after `end_date`.

### After an event (close-out)
- Add its recordings (video files with `event:`), and its outputs (publication files).
- Check its `summary`: past tense, nothing promising future items unless they are truly in preparation.
- Consider whether the home page paragraph about what we do (`src/pages/index.astro`, `<p class="story">`) should mention it. That paragraph is hand-written: propose a wording to the human, don't change it alone. It must stay no taller than the photo beside it on desktop.

## Check, then publish
1. `npm run build` - must finish without errors (the schemas catch a wrong field or date).
2. Look at the pages you touched: `npx astro preview`, then open them (e.g. /videos/, the event page, /gatherings/).
3. Commit with a clear message (`Add: <what>`), push to `main`, and after ~1 minute check the live page loads.
4. Tell the human what changed, with the live links.

## Monthly stale check (when asked, or with the monthly email)
List, don't fix without asking:
- events past their date with no recording or output linked that should have one;
- summaries or pages containing "soon", "going up", "on the way", "next", "register", "sign up" for things already over;
- blocks with prices or registration on past events that are not wrapped in `until-end`;
- the home page names and paragraph, if a major gathering has happened since they were last edited.
