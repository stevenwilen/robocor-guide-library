---
name: publish-guide-draft
description: Use this skill when the user provides JSON with `_type: "robocor_guide_draft"` (or the older `_type: "robocor_course_draft"`), produced by the Guide Builder. It reviews an unpublished guide draft and integrates it into the Robocor Guide Library safely.
---

# Publish Guide Draft

Use this skill when the user provides a JSON object with
`_type: "robocor_guide_draft"` **or** the older
`_type: "robocor_course_draft"`. Both come from the in-app **Guide Builder**
(`/builder`); the older type is the same idea using earlier course/lesson
wording.

A draft is a structured starting point, not a finished guide. Steven and Claude
turn drafts into polished published guides.

## Goal

Review an unpublished guide draft JSON and integrate it into the Robocor Guide
Library safely, producing a real, typed guide that matches the existing app.

## Rules (do not violate)

- Do **not** push directly to `main`. Work on a branch and open a PR.
- Do **not** invent technical content. If a step, value, or detail is not in the
  draft, leave it out and flag it for client confirmation.
- Keep sections that **need more info** as planned/pending — do not write content
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

- `guide` — `id`, `title`, `description`, `subtitle`, `intendedReader`, `image?`,
  `sections[]`.
- `guide.sections[]` — `id`, `number`, `title`, `summary`, `state`
  (`"ready" | "needs_info"`), and either `blocks[]` (when ready) or `infoNeeded`
  (a string, when it needs more info). `contentStatus` (`"available" | "pending"`)
  is also included for convenience.
- Content blocks in `blocks[]` are already in published `LessonSection` shape
  (`paragraph`, `video`, `image`, `gallery`, `steps`, `keyNotes`, `callout`).
- `assets[]` — image files still needed (`blockId`, `fileName`, `intendedPath`,
  `needsUpload: true`).
- `notesForPublisher[]` — plain notes to read first.

Older `robocor_course_draft` drafts use `course` instead of `guide`, `lessons`
instead of `sections`, and `contentStatus` instead of `state`. Map them the same
way.

## Published data model reference

The published model lives in `src/data/types.ts`:

- `Course` — `id`, `title`, `subtitle`, `level`, `durationLabel`, `image?`,
  `heroEyebrow?`, `description`, `about: string[]`, `helpsWith?`, `quizId?`,
  `lessons: Lesson[]`.
- `Lesson` — `id`, `number`, `title`, `summary`, `contentStatus`
  (`"available" | "pending"`), `pendingNote?`, `contentNeeded?`, `sections?`.
- `LessonSection` content blocks: `paragraph`, `heading`, `video`, `keyNotes`,
  `steps`, `callout`, `image`, `gallery`, `divider`, `pendingNote`.

Guides register in `src/data/courses.ts` (the `courses` array). Knowledge checks
live in `src/data/quiz.ts` (the `quizzes` array, linked via `course.quizId`).
Completion cards live in `src/data/certificates.ts` (the `certificates` array).

The Builder intentionally omits reading level and duration. Add sensible values
(or confirm with the client) when publishing — do not fabricate specifics.

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
   `description` → `description`/`subtitle`; add `level` and `durationLabel`
   (confirm if unsure); `intendedReader` is context, not a published field.
8. **Map sections → lessons.** A `ready` / `available` section becomes a lesson
   with `contentStatus: "available"` and its `blocks` as `sections`. A
   `needs_info` / `pending` section becomes `contentStatus: "pending"` with
   `pendingNote` (from `infoNeeded`) — do not write its content.
9. **Add knowledge-check data only if it exists** in the draft. Otherwise leave
   `quizId` unset — do not fabricate questions.
10. **Add completion-card data only if** it exists or can be safely generated
    from provided completion rules. Scope it to completed available sections
    only — never depend on sections that need more info.
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
    block's `alt` field — the live renderer uses it.
14. **Confirm the guide appears** on the Guides page (`/courses`,
    `src/pages/DirectoryPage.tsx`).
15. **Confirm the guide overview and section routes work**
    (`/course/<id>` and `/course/<id>/lesson/<sectionId>`).
16. **Run `npm run build`** and fix any type errors.
17. **Summarize** for the client:
    - what was added
    - what was left pending (sections that need more info)
    - what assets are missing
    - what needs client confirmation
    - whether the build passed
