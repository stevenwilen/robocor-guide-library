---
name: publish-course-draft
description: Use this skill when the user provides a JSON file or pasted JSON with `_type: "robocor_course_draft"` (produced by the Course Builder). It reviews an unpublished course draft and integrates it into the Robocor Guide Library safely.
---

# Publish Course Draft

Use this skill when the user provides a JSON object with `_type: "robocor_course_draft"`.

These drafts come from the in-app **Course Builder** (`/builder`). The draft is a
structured starting point, not a finished course. Steven and Claude turn drafts
into polished published courses.

## Goal

Review an unpublished course draft JSON and integrate it into the Robocor Guide
Library safely, producing a real, typed course that matches the existing app.

## Rules (do not violate)

- Do **not** push directly to `main`. Work on a branch and open a PR.
- Do **not** invent technical content. If a step, value, or wiring detail is not
  in the draft, leave it out and flag it for client confirmation.
- Do **not** turn pending lessons into available lessons unless real content
  blocks are provided in the draft.
- Keep all visible company names as **"Robocor."**
- Preserve the existing learner-facing app (Morpheus Drive and all current
  routes must keep working).
- Do **not** add backend, accounts, users, enrollments, reports, analytics, or
  admin tracking. This is a static frontend guide library.
- Do **not** assume missing image files exist. An asset with `needsUpload: true`
  has not been provided.
- Run `npm run build` before finishing.

## Data model reference

The published content model lives in `src/data/types.ts`:

- `Course` — `id`, `title`, `subtitle`, `level`, `durationLabel`, `image?`,
  `heroEyebrow?`, `description`, `about: string[]`, `helpsWith?`, `quizId?`,
  `lessons: Lesson[]`.
- `Lesson` — `id`, `number`, `title`, `summary`, `contentStatus`
  (`"available" | "pending"`), `pendingNote?`, `contentNeeded?`, `sections?`.
- `LessonSection` (content blocks) — `paragraph`, `heading`, `video`, `keyNotes`,
  `steps`, `callout`, `image`, `gallery`, `divider`, `pendingNote`. The Builder's
  block types map 1:1 except **checklist → `steps`** (each item becomes
  `{ title }`).

Courses are registered in `src/data/courses.ts` (the `courses` array). Quizzes
live in `src/data/quiz.ts` (the `quizzes` array, linked via `course.quizId`).
Certificates live in `src/data/certificates.ts` (the `certificates` array).

Note: the Builder intentionally omits `level` and `durationLabel`. Add sensible
values (or confirm with the client) when publishing — do not fabricate specifics.

## Process

1. **Read the JSON file** the user provided.
2. **Confirm `_type`** is exactly `"robocor_course_draft"`. If not, stop and say so.
3. **Confirm `submissionStatus`** is `"pending_approval"`.
4. **Validate required fields**: course `title`, `description`, `goal`; at least
   one lesson; each lesson has a `title` and `contentStatus`; pending lessons
   have a `pendingNote`; available lessons have at least one section. If anything
   is missing, list it and ask the client rather than guessing.
5. **Normalize ids** for the course and every lesson into kebab-case (the draft
   already kebab-cases them; re-check and resolve any collisions with existing
   course/lesson ids).
6. **Check for missing or unclear content** — read `notesForPublisher` and the
   `assets` array. Note anything that needs client confirmation.
7. **Add the course** to `src/data/courses.ts` using the existing typed `Course`
   structure. Map draft fields: `course.description` → `description`/`subtitle`,
   `course.goal` → `about`. Add `level` and `durationLabel` (confirm if unsure).
8. **Keep pending lessons pending** — carry over `pendingNote` and, if present,
   `contentNeeded`. Do not write content for them.
9. **Add available lessons only if content blocks are provided.** Convert each
   draft block to its `LessonSection` shape (checklist → `steps`).
10. **Add quiz data only if quiz data exists** in the draft. Otherwise leave
    `quizId` unset — do not fabricate questions. Register any quiz in
    `src/data/quiz.ts` and link via `course.quizId`.
11. **Add certificate data only if** it exists or can be safely generated from
    provided completion rules. Scope certificates to completed available lessons
    only — never depend on pending lessons. Register in
    `src/data/certificates.ts`.
12. **Add or link image assets only if** real files or safe image URLs are
    provided. For `needsUpload: true` assets, place the supplied file at the
    `intendedPath` (e.g. under `public/images/`) and reference it. If no file was
    supplied, leave the block referencing the intended path and flag it.
13. **Do not assume missing image files exist.** Flag every unresolved asset.
14. **Confirm the course appears on the Courses page** (`/courses`,
    `src/pages/DirectoryPage.tsx`, driven by the `courses` array).
15. **Confirm the course overview and lesson routes work**
    (`/course/<id>` and `/course/<id>/lesson/<lessonId>`).
16. **Run `npm run build`** and fix any type errors.
17. **Summarize** for the client:
    - what was added
    - what was left pending
    - what assets are missing
    - what needs client confirmation
    - whether the build passed
