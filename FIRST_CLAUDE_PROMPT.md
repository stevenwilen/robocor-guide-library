I am starting a new client project. Read `PROJECT_BRIEF.md`, `CLAUDE.md`, and the screenshots in `/reference` before coding.

The goal is to build a polished web-based guide library for Robocore, starting with the Morpheus Drive course.

Important scope:
- This is not a full LMS.
- Do not build real logins, admin editing, databases, enrollments, quizzes, certificates, or reporting.
- Use the screenshots as visual references only.
- Build a static frontend that feels like a real course guide system.

Required build:
1. Create a Vite + React + TypeScript + Tailwind app if this folder does not already contain one.
2. Build a course directory/home page for the Robocore Guide Library.
3. Add one course card for “Morpheus Drive.”
4. Build the Morpheus Drive course overview page.
5. Build the lesson page layout.
6. Fully build Lesson 1 as “Morpheus Drive Hardware Setup.” Use realistic placeholder text where exact content is not provided yet, but keep it practical and technical.
7. Add Lesson 2 and Lesson 3 as planned modules with intentional pending states:
   - Lesson 2: Connecting Morpheus Drive to the App. Status: Pending updated app workflow.
   - Lesson 3: Navigating the App. Status: Pending updated app workflow.
8. Add local progress using localStorage so a user can mark Lesson 1 complete and see progress persist after refresh.
9. Make the UI responsive.
10. Run install/build checks and tell me exactly how to preview it.

Before editing files, give me a concise implementation plan and list the files you expect to create.
