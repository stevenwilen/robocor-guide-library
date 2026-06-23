# Robocor Guide Library

A polished, course-style web guide library for Robocor, starting with the
**Morpheus Drive** course. Static frontend — no backend, accounts, or database.

## Stack
- Vite + React + TypeScript
- Tailwind CSS
- React Router
- Progress stored in the browser (`localStorage`) only

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

## Project structure

```
src/
  data/
    types.ts       # content model (Course, Lesson, LessonSection)
    courses.ts     # ALL course + lesson content lives here (edit this to add content)
  hooks/
    useProgress.ts # localStorage-backed lesson completion (the only source of user progress)
  components/      # Sidebar, Layout, cards, lesson nav, section renderers
  pages/           # DirectoryPage, CourseOverviewPage, LessonPage
```

## Editing content
Open [`src/data/courses.ts`](src/data/courses.ts). To add a course, push another
object onto the `courses` array. To add or change a lesson, edit its `sections`.

Two separate concepts, intentionally never mixed:
- **`contentStatus`** (`"available"` | `"pending"`) — whether the lesson content
  exists yet. Pending lessons render a structured pending state.
- **User completion** — stored only in `localStorage`, keyed by lesson id. It is
  set when a user clicks "Mark lesson complete" and persists across refresh.

## Deployment
The app is a static SPA suitable for Vercel. `vercel.json` rewrites all routes to
`index.html` so deep links work. Build output is `dist/`.

## Current scope
- Course directory / home
- Morpheus Drive course overview
- Lesson 1 (Hardware Setup) — fully built
- Lessons 2 & 3 — intentional pending modules (updated app workflow)
- Local progress, responsive layout

Not included by design: auth, accounts, database, admin/editor, enrollments,
quizzes, certificates, reporting.
