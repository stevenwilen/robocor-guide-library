---
description: Use when building or revising the Robocore/Morpheus Drive guide library. Keeps the project scoped to a static course-style web guide, not a full LMS.
---

# Morpheus Guide Build Skill

When working on this project, follow these rules:

1. Build a guide library, not a full LMS.
2. Use screenshots in `/reference` as visual references, not feature requirements.
3. Implement only these product areas:
   - course directory
   - Morpheus Drive course overview
   - lesson view
   - reference/diagram cards
   - local lesson completion progress
4. Keep content data-driven so adding future courses means editing course data, not rebuilding the UI.
5. Store progress in localStorage. Do not add a database or auth.
6. Lesson 1 should be complete. Lessons 2 and 3 should be structured pending modules because the app has changed.
7. Avoid fake admin UI that suggests working features not included in the build.
8. Before coding major changes, summarize the planned file changes and wait for approval if the user is in plan mode.
9. After implementation, run install/build checks and report any failures plainly.
