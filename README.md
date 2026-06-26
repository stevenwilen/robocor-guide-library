# Robocor Guide Library

A polished, guide-style reference library for Robocor, starting with the
**Morpheus Drive** guide. It is a static frontend: no backend, no accounts, no
database, no live publishing, and no admin tools. Everything a visitor does
(progress, quiz scores, completion cards, Builder drafts) is stored in the
browser via `localStorage` only.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- React Router
- Browser `localStorage` for all local state

## Getting started

```bash
npm install
npm run dev      # start the dev server (prints a local URL)
```

Production build and local preview:

```bash
npm run build    # type-check + build to dist/
npm run preview  # serve the production build locally
```

## What's in the app

- **Dashboard** (`/`): a quick, honest overview of the current state on this
  device. No tracking, no accounts.
- **Guides** (`/courses`): the directory of published guides plus clearly
  labeled planned guides. Morpheus Drive is the active guide today.
- **Guide overview + sections** (`/course/:id`, `/course/:id/lesson/:sectionId`):
  the reading experience, including YouTube embeds and structured pending
  sections for content that is not finalized yet.
- **Creator Tools** (`/creator`): a secondary, passcode-gated area for creators
  (see below). It is not in the main learner navigation and is not a learner page.
- **Knowledge Checks** (`/quizzes`): short, optional quizzes per guide. The
  latest score is saved per guide in `localStorage`.
- **Completion Cards** (`/certificates`): lightweight local completion cards,
  unlocked by finishing the required section(s) and the guide's knowledge check.
  Saved on this device only; not a secure or account-verified credential.
- **Settings** (`/settings`): text size, theme (light/dark/system), reduced
  motion, and high contrast. Applied immediately and stored locally.

## Creator Tools and the JSON handoff

Creator Tools is a secondary area for creators to draft content and request
changes. It does **not** publish anything and never edits a live guide. A
lightweight 4-digit passcode gate (`VITE_CREATOR_PASSCODE`, local fallback
`2468`) keeps learners out; the unlocked flag is stored in `localStorage`. This
is a gate, not authentication. There are two tools:

**New Guide Draft** - draft a whole new guide locally:
**Guide Basics** (title, description, intended reader, optional banner),
**Sections and Blocks** (sections that are "Ready to include" or "Needs more
info", each with ordered content blocks), then **Review and Submit**. Drafts are
saved on the device and auto-load on return. Export with **Copy JSON** /
**Download JSON** and send it (with any local image files) to Steven. Claude
integrates it with the `publish-guide-draft` skill.

```json
{
  "_type": "robocor_guide_draft",
  "schemaVersion": "2.0",
  "submissionStatus": "pending_approval",
  "intendedAction": "review_and_publish_to_guide_library",
  "claudeSkill": "publish-guide-draft",
  "guide": { "title": "...", "sections": [ ... ] }
}
```

**Update Existing Guide** - request a small change (replace a paragraph, swap an
image, update a checklist, mark a section as needing more info, etc.) to an
already-published guide. It produces a separate request JSON, applied by Claude
with the `publish-guide-update` skill:

```json
{
  "_type": "robocor_guide_update_request",
  "schemaVersion": "1.0",
  "submissionStatus": "pending_approval",
  "intendedAction": "review_and_apply_update_to_guide_library",
  "claudeSkill": "publish-guide-update",
  "guideId": "...",
  "sectionId": "...",
  "changeType": "...",
  "changeSummary": "..."
}
```

Both JSON types are self-identifying so they can be handed to Claude with no
context. There is no automatic submit: the creator uses **Copy JSON** or
**Download JSON** and emails it (with any image files) to Steven, who reviews
and publishes it. Nothing goes live automatically.

Images: a public URL or `/images/...` path is treated as a provided reference. A
locally picked file is previewed in the browser only. It is never uploaded and
never stored as base64. The JSON records its metadata and flags it as needing the
file sent separately.

**Publishing is a design pass, not a copy-paste.** Creator Tools collect
structured draft content only; the submitted JSON is not the final design. When
Steven publishes, Claude reviews the draft, applies a design/layout pass (the
`publish-guide-draft` skill, using the optional presentation metadata in
`src/data/types.ts`), integrates it into the guide library, and runs the build.
Published guides may use that layout metadata (`presentationVariant`,
`layoutVariant`, `displayVariant`) for a more intentional presentation than raw
stacked cards. The "Using AI for Repeated Staff Work" guide is a worked example.

## Project structure

```
src/
  data/
    types.ts         # content model (Course, Lesson, LessonSection)
    courses.ts       # ALL published guide + section content lives here
    quiz.ts          # knowledge-check questions, keyed per guide
    certificates.ts  # completion-card definitions, keyed per guide
    storageKeys.ts   # localStorage key helpers
  builder/           # New Guide Draft: draft model, validation, export, UI
  creator/           # Creator Tools: passcode gate + New Guide Draft + Update
                     # Existing Guide (update request model, export, UI)
  hooks/             # localStorage-backed progress and settings
  components/        # Sidebar, Layout, cards, section renderers
  pages/             # Dashboard, Directory, overview, lesson, Creator Tools,
                     # quizzes, certificates, settings
```

## Editing published content

Open [`src/data/courses.ts`](src/data/courses.ts). To add a guide, push another
object onto the `courses` array. To add or change a section, edit its `sections`
(the content blocks).

Two separate concepts, intentionally never mixed:

- **`contentStatus`** (`"available"` | `"pending"`): whether the section content
  exists yet. Pending sections render a structured pending state.
- **User completion**: stored only in `localStorage`, keyed by section id. Set
  when a user marks a section complete; persists across refresh.

## Deployment

The app is a static SPA suitable for Vercel. `vercel.json` rewrites all routes to
`index.html` so deep links work. Build output is `dist/`.

## Not included, by design

No backend, accounts, authentication, database, enrollments, reporting,
analytics, admin tools, or live publishing. The Builder produces drafts for
manual review; it does not push anything to the live library.
