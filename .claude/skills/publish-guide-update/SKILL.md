---
name: publish-guide-update
description: Use this skill when the user provides JSON with `_type: "robocor_guide_update_request"` (from Creator Tools > Update Existing Guide). It reviews a small change request and applies it safely to an existing published guide.
---

# Publish Guide Update

Use this skill when the user provides JSON with
`_type: "robocor_guide_update_request"`. These come from
**Creator Tools > Update Existing Guide** and describe a small change to an
already-published guide. This is NOT a full new guide draft (that uses
`publish-guide-draft`). Do not confuse the two.

## Goal

Review a submitted guide update request and apply it safely to the Robocor Guide
Library.

## Rules (do not violate)

- Do **not** push directly to `main`. Work on a branch and open a PR.
- Do **not** invent technical content.
- Do **not** apply unclear updates without flagging them.
- Do **not** assume missing images exist.
- Keep all visible company names as **"Robocor."**
- Do **not** add backend, accounts, users, enrollments, reports, analytics, or
  admin tools.
- Run `npm run build` before finishing.

## Request shape

`robocor_guide_update_request` (schemaVersion `1.0`):

- `guideId`, `guideTitle` - which published guide to change.
- `sectionId`, `sectionTitle` - the target section, or
  `"__general__"` / "General guide-level change".
- `changeType` - one of `replace_text`, `replace_image`, `replace_video`,
  `add_block`, `remove_block`, `update_list`, `mark_needs_info`, `other`.
- `changeSummary` - what needs to change.
- `replacementContent` - the new text / item / link / details, if any.
- `imageReference` - present when an image replacement uses a public URL or
  `/images/` path (usable as-is).
- `assets` - local image files that must be sent separately
  (`fileName`, `intendedPath`, `needsUpload: true`).
- `notesForPublisher` - plain notes to read first.

## Where guides live

Published guides are in `src/data/courses.ts` (the `courses` array). A guide is a
`Course`; its sections are `lessons`; a section's content blocks are its
`sections` (`LessonSection`). See `src/data/types.ts`.

## Process

1. **Read the update request JSON.**
2. **Confirm `_type`** is `"robocor_guide_update_request"`. If not, stop and say so.
3. **Confirm `submissionStatus`** is `"pending_approval"`.
4. **Identify `guideId` and `sectionId`.**
5. **Locate the existing guide** in `src/data/courses.ts` by `guideId`, and the
   section by `sectionId` (or treat it as a guide-level change for
   `__general__`). If it cannot be found, stop and flag it.
6. **Review the requested change** (`changeType`, `changeSummary`,
   `replacementContent`).
7. **Apply only clear, specific changes.** If the request is ambiguous, make no
   change and flag exactly what needs confirmation.
8. **If the request references an image:**
   - Use public URLs or provided project paths (`imageReference`) when available.
   - Do not assume local files exist. If `assets` lists a file that was not
     provided, leave a clear note and do not fabricate the image.
   - Generate concise alt text from the caption, file name, and surrounding
     context.
9. **Preserve existing guide structure and styling.** Change only what the
   request asks for. For `mark_needs_info`, set the section's
   `contentStatus: "pending"` with an honest `pendingNote`; do not delete its
   existing content unless asked.
10. **Run `npm run build`** and fix any type errors.
11. **Summarize** for the client:
    - what changed
    - what was not changed
    - what assets are missing
    - what needs confirmation
    - whether the build passed
