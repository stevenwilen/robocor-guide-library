---
name: publish-guide-draft
description: Use this skill when the user provides a new-guide commission from Creator Tools — a "ROBOCOR GUIDE BRIEF" submission (title/audience/goal/topics/materials, usually emailed with file attachments via the form service), or older guide-creation JSON (`_type: "robocor_guide_brief"` / `"robocor_guide_draft"` / `"robocor_course_draft"`). It scopes, designs, and integrates a new guide into the Robocor Guide Library safely.
---

# Publish Guide Draft

Use this skill when the user provides a submitted guide brief, even with no other
context.

## Accepted formats

- **Primary (a brief submission)** — from **Creator Tools > New Guide**. The
  creator sends a structured **"ROBOCOR GUIDE BRIEF"** message (via the form
  service, usually as an email) with `Title`, `For` (audience), `Goal`, a
  `Topics to cover` list, and `Materials` split into **Links** (URLs you fetch)
  and **Files** (attached to the email). It does NOT contain finished sections
  or blocks — **you scope it, section it, and design it from the materials.**
  See "Building from a brief" below. There is no JSON file by design.
- **Older JSON brief: `_type: "robocor_guide_brief"`** — same idea in JSON
  (`guide` + `materials` + `scope`). Handle it the same way.
- **Structured draft: `_type: "robocor_guide_draft"`** — an older export where
  the creator pre-structured `guide` + `sections` + content blocks. Redesign it
  with the Design Pass.
- **Legacy: `_type: "robocor_course_draft"`** (`claudeSkill: "publish-course-draft"`)
  — oldest, uses `course`/`lessons`/`contentStatus`. Map it the same way.

A brief is a starting point, not a finished guide. Steven and Claude turn it
into a polished published guide.

**Do not confuse a new guide with an update request.** Small changes to an
already-published guide come from **Creator Tools > Update Existing Guide** with
`_type: "robocor_guide_update_request"`; those use the `publish-guide-update`
skill, not this one.

## Building from a brief

The brief is raw intent + materials, deliberately not pre-structured. Build it
like a commission:

1. **Read the brief**: `Goal` (what it must help the reader do), `For`
   (audience), `Topics to cover` (the requested scope), the Links/Files, and any
   feel/notes.
2. **Ingest the materials.** Fetch each **Link** URL (webpage, doc, or video)
   and read/watch it. For each **File**, use the attachment the creator emailed
   — **do not assume a file exists if it was not provided**; flag it instead.
3. **Assess scope FIRST, before building.** Propose a section breakdown from the
   topics and what the materials actually support. List any topic with no
   supporting material, and anything thin or missing. Surface this so the scope
   (and price) can be confirmed.
4. **Design each section** with the Design Pass below — show, don't tell: lead
   with a `flow` diagram or a real `example`, use `compare`/`labeledList`, cut
   obvious caveats. Ground every claim in the materials; do not invent.
5. A video material can become a published `video` (YouTube) block; other
   materials are sources to author from, not hosted assets.

## Goal

Review an unpublished guide draft JSON and integrate it into the Robocor Guide
Library safely, producing a real, typed guide that matches the existing app.

## Rules (do not violate)

- Do **not** push directly to `main`. Work on a branch and open a PR.
- Do **not** invent technical content. If a step, value, or detail is not in the
  draft, leave it out and flag it for client confirmation.
- Keep sections that **need more info** as planned/pending - do not write content
  for them unless real content blocks are provided.
- Keep all visible company names as **"Robocor."**
- Preserve the existing learner-facing app (Morpheus Drive and all current
  routes must keep working).
- Do **not** add backend, accounts, users, enrollments, reports, analytics, or
  admin tracking. This is a static frontend guide library.
- Do **not** assume missing image files exist. An asset with `needsUpload: true`
  has not been provided.
- Run `npm run build` before finishing.

## Draft shape

`robocor_guide_draft` (schemaVersion `2.0`) envelope:

- `guide` - `id`, `title`, `description`, `subtitle`, `intendedReader`, `image?`,
  `sections[]`.
- `guide.sections[]` - `id`, `number`, `title`, `summary`, `state`
  (`"ready" | "needs_info"`), and either `blocks[]` (when ready) or `infoNeeded`
  (a string, when it needs more info). `contentStatus` (`"available" | "pending"`)
  is also included for convenience.
- Content blocks in `blocks[]` are already in published `LessonSection` shape
  (`paragraph`, `video`, `image`, `gallery`, `steps`, `keyNotes`, `callout`).
- `assets[]` - image files still needed (`blockId`, `fileName`, `intendedPath`,
  `needsUpload: true`).
- `notesForPublisher[]` - plain notes to read first.

Older `robocor_course_draft` drafts use `course` instead of `guide`, `lessons`
instead of `sections`, and `contentStatus` instead of `state`. Map them the same
way.

## Published data model reference

The published model lives in `src/data/types.ts`:

- `Course` - `id`, `title`, `subtitle`, `audience`, `durationLabel`, `image?`,
  `heroEyebrow?`, `description`, `about: string[]`, `helpsWith?`, `quizId?`,
  `lessons: Lesson[]`.
- `Lesson` - `id`, `number`, `title`, `summary`, `contentStatus`
  (`"available" | "pending"`), `pendingNote?`, `contentNeeded?`, `sections?`.
- `LessonSection` content blocks: `paragraph`, `heading`, `video`, `keyNotes`,
  `steps`, `callout`, `image`, `gallery`, `divider`, `pendingNote`.

Guides register in `src/data/courses.ts` (the `courses` array). Knowledge checks
live in `src/data/quiz.ts` (the `quizzes` array, linked via `course.quizId`).
Completion cards live in `src/data/certificates.ts` (the `certificates` array).

The Builder intentionally omits duration. Add a sensible value (or confirm with
the client) when publishing - do not fabricate specifics.

## Design Pass (required)

The submitted JSON is **raw structured content, not the final design.** A draft
copied straight into the default renderer comes out as generic stacked cards.
Before publishing you MUST redesign each lesson so it teaches by **showing**.

### Show, don't tell (the core principle)

The published "Using AI for Repeated Staff Work" guide is the reference for how
lessons should read. Follow it:

- **Lead with a diagram or a real example, not prose.** One line of framing, then
  *show* it. A worked before/after teaches more than three paragraphs.
- **Cut the obvious.** Delete filler and lecture-y caveats ("remember to review
  the output", "don't use AI for anything important"). Respect the reader.
- **Keep lessons short and visual.** Prefer a `flow` diagram, an `example`, a
  `labeledList` breakdown, or a `compare` over walls of text and long bullet
  lists. Images are optional — diagrams and examples usually carry the lesson.
- Keep the content accurate; do not invent unsupported details. (This applies to
  general-knowledge guides too — enrich, but stay correct.)
- Do **not** make every block a full-width card; keep it responsive (stacks on
  mobile); run `npm run build`.

### Creative blocks (use these to show instead of tell)

These live in `src/data/types.ts` and render in `LessonSections.tsx`. They are
**design-pass blocks** — the Builder does not collect them; you add them when
publishing:

- **`flow`** — a small, lightly-animated diagram of a process: labeled nodes
  joined by arrows. Use for "how it works" instead of describing steps in prose.
- **`example`** — a real worked before/after: an `input` (what you'd actually do)
  next to the `output` (the result). The single most effective teaching block.
- **`labeledList`** — a labeled breakdown / "anatomy of X": each item is a named
  part with a short, concrete explanation (often with a tiny quoted example).
- **`compare`** — side-by-side columns with `good`/`bad`/`neutral` tone
  (vague vs clear, before vs after, do vs don't).

Plus the base blocks: `paragraph` (use `displayVariant: "plain"` for flowing
intro lines), `heading`, `video`, `image`, `gallery`, `steps`, `keyNotes`,
`callout`, `divider`, `pendingNote`.

### Presentation metadata (all optional; set ONLY here, never in the Builder)

- `Course.presentationVariant`: `"standard" | "compact" | "visual" | "training" | "reference"`.
- `Lesson.layoutVariant`: `"stacked" | "split" | "feature-checklist" | "steps-grid" | "media-right" | "media-left" | "compact-cards"`. `media-right`/`media-left` place image/gallery blocks beside the text (drop them if a lesson has no media).
- block `displayVariant`: `"card" | "plain" | "compact" | "grid" | "numbered" | "side-by-side" | "highlight"`.

If you need a block or layout the renderer does not support yet, **add it to
`LessonSections.tsx`** rather than forcing content into the wrong shape — that is
how the toolkit grows.

## Process

1. **Read the JSON** the user provided.
2. **Confirm `_type`** is `"robocor_guide_draft"` or `"robocor_course_draft"`.
   If neither, stop and say so.
3. **Confirm `submissionStatus`** is `"pending_approval"`.
4. **Validate required fields**: guide `title`, `description`; at least one
   section; each section has a `title` and a state; sections that need more info
   have `infoNeeded`; ready sections have at least one block. List anything
   missing and ask the client rather than guessing.
5. **Normalize ids** for the guide and every section into kebab-case, resolving
   any collisions with existing course/lesson ids.
6. **Read `notesForPublisher` and `assets`.** Note anything that needs client
   confirmation.
7. **Add the guide** to `src/data/courses.ts` as a `Course`. Map: guide
   `description` → `description`/`subtitle`; `intendedReader` → `audience`
   (the reader pill, e.g. "Interns" / "Students" / "Staff"); add `durationLabel`
   (confirm if unsure). There is no difficulty/level field.
8. **Map sections → lessons.** A `ready` / `available` section becomes a lesson
   with `contentStatus: "available"` and its `blocks` as `sections`. A
   `needs_info` / `pending` section becomes `contentStatus: "pending"` with
   `pendingNote` (from `infoNeeded`) - do not write its content.
9. **Add knowledge-check data only if it exists** in the draft. Otherwise leave
   `quizId` unset - do not fabricate questions.
10. **Add completion-card data only if** it exists or can be safely generated
    from provided completion rules. Scope it to completed available sections
    only - never depend on sections that need more info.
11. **Add or link image assets only if** real files or safe image URLs are
    provided. For `needsUpload: true` assets, place the supplied file at the
    `intendedPath` (e.g. under `public/images/`) and reference it. If no file was
    supplied, leave the block referencing the intended path and flag it.
12. **Do not assume missing image files exist.** Flag every unresolved asset.
13. **Generate alt text for every image.** The Builder no longer collects alt
    text, so draft image blocks usually have it blank or omitted. For each image
    (`image` and `gallery` blocks), write concise, simple, descriptive alt text
    using the image caption, file name, the surrounding section title, and the
    nearby block content. Keep it short and plain. Do NOT invent technical
    details the draft does not support; if the image content is unclear, use
    neutral alt text derived from the caption or file name. Set this as the
    block's `alt` field - the live renderer uses it.
14. **Do the Design Pass (required).** Apply layout/presentation metadata (see
    the "Design Pass" section) so the guide is laid out intentionally, not as
    generic stacked cards.
15. **Confirm the guide appears** on the Guides page (`/courses`,
    `src/pages/DirectoryPage.tsx`).
16. **Confirm the guide overview and section routes work**
    (`/course/<id>` and `/course/<id>/lesson/<sectionId>`).
17. **Run `npm run build`** and fix any type errors.
18. **Summarize** for the client:
    - what was added
    - what was left pending (sections that need more info)
    - what assets are missing
    - what needs client confirmation
    - whether the build passed
