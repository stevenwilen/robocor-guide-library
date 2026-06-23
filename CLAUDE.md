# CLAUDE.md

## Project identity
This project is a client guide-library build for Robocore. It should feel like a polished course/reference system, not a generic website and not a full LMS.

## Build rule
Build the smallest real system that validates the approved mockup:
- course directory
- Morpheus Drive course
- complete Lesson 1
- placeholder Lessons 2 and 3
- reusable data-driven course/lesson structure
- local progress

Do not add backend features unless explicitly asked.

## Scope boundaries
Do not build:
- auth
- account creation
- database
- admin dashboard
- course editor
- enrollment logic
- quizzes
- certificates
- reporting

If a screenshot shows those features, treat them as visual atmosphere only, not requirements.

## Technical preference
Use a simple static frontend suitable for Vercel deployment. Prefer Vite + React + TypeScript + Tailwind unless the existing project setup requires something else.

Store course and lesson content in clean data files so future courses can be added without redesigning the app.

Use localStorage for completion/progress only. Do not pretend this is secure user tracking.

## Design direction
Use the reference screenshots in `/reference`.

Aim for:
- premium technical guide
- calm dark sidebar
- light content canvas
- precise cards and panels
- clear lesson navigation
- practical instructional hierarchy
- not generic SaaS
- not playful classroom UI

The design should feel like robotics training/reference material for interns or technical students.

## Copy tone
Use plain instructional language. Avoid hype. Avoid abstract language. Label pending modules honestly.

Use wording like:
- Pending updated app workflow
- Reserved for the updated CoreOS app connection process
- This lesson can be completed after the new app flow is confirmed

Do not use wording like:
- Coming soon!!!
- Unlock later
- Premium content
- Under construction

## Acceptance criteria
Before calling the build done, verify:
- app installs and runs locally
- production build succeeds
- desktop layout matches reference quality
- mobile layout is usable
- Lesson 1 has real content sections
- Lessons 2 and 3 are intentional placeholders, not empty pages
- local progress works and persists after refresh
- no backend/auth/admin features were added
