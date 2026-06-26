---
name: publish-guide-draft
description: Use this skill when the user provides JSON with `_type: "robocor_guide_draft"` (or the older `_type: "robocor_course_draft"`), produced by the Guide Builder. It reviews an unpublished guide draft and integrates it into the Robocor Guide Library safely.
---

# Publish Guide Draft

Use this skill when the user provides a submitted guide draft JSON, even with
no other context.

## Accepted formats

- **Primary:** `_type: "robocor_guide_draft"` (`claudeSkill: "publish-guide-draft"`).
- **Legacy:** `_type: "robocor_course_draft"` (`claudeSkill: "publish-course-draft"`),
  an older export of the same idea. Still fully supported; map it the same way
  (it uses `course`/`lessons`/`contentStatus` instead of `guide`/`sections`/`state`).

Both come from **Creator Tools > New Guide Draft** (`/creator`). A draft is a
structured starting point, not a finished guide. Steven and Claude turn drafts
into polished published guides.

**Do not confuse a full guide draft with an update request.** Small changes to
an already-published guide come from **Creator Tools > Update Existing Guide**
with `_type: "robocor_guide_update_request"`; those use the `publish-guide-update`
skill, not this one.

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
that is copied straight into the default renderer comes out as generic stacked
cards. Before publishing you MUST do a design pass so the guide feels
intentionally laid out around its content.

Rules:

- Do **not** simply paste JSON blocks into the default renderer.
- Treat submitted JSON as raw structured content; keep the content accurate and
  do not invent unsupported details.
- Choose a layout that fits the content, then set the optional presentation
  metadata (below) to express it.
- Do **not** overcomplicate short guides; a 1-2 section guide can stay simple.
- Do **not** make every block a full-width card.
- Do **not** render checklists as giant repeated full-width rows unless that
  truly is the best layout; prefer a compact grid for lists of short items.
- Use images as part of the layout (beside related content via a media layout),
  not just dropped below the text.
- Keep it responsive; everything stacks cleanly on mobile.
- Run `npm run build`.

Presentation metadata (all optional, in `src/data/types.ts`; set ONLY here, never
in the Builder):

- `Course.presentationVariant`: `"standard" | "compact" | "visual" | "training" | "reference"`.
- `Lesson.layoutVariant` (a guide section): `"stacked" | "split" | "feature-checklist" | "steps-grid" | "media-right" | "media-left" | "compact-cards"`. `media-right`/`media-left` place image/gallery blocks beside the text.
- block `displayVariant`: `"card" | "plain" | "compact" | "grid" | "numbered" | "side-by-side" | "highlight"`. Useful examples: `paragraph` → `plain`; `steps`/checklist → `grid` or `compact`; `keyNotes` → `compact`; `callout` → `highlight` (reads as a reusable template).

The renderer (`src/components/sections/LessonSections.tsx`) reads these. If you
need a layout it does not support yet, add it there rather than forcing content
into the wrong shape. The "Using AI for Repeated Staff Work" guide in
`courses.ts` is a worked example of a design pass.

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
