---
name: publish-guide-update
description: Use this skill when the user provides a "ROBOCOR GUIDE UPDATE REQUEST" submission (from Creator Tools > Update Existing Guide, usually emailed with an attached file via the form service), or older `_type: "robocor_guide_update_request"` JSON. It reviews a small change request and applies it safely to an existing published guide.
---

# Publish Guide Update

Use this skill when the user provides a guide update request. It arrives as a
structured **"ROBOCOR GUIDE UPDATE REQUEST"** message (via the form service,
usually an email, sometimes with an attached file), or as older
`_type: "robocor_guide_update_request"` JSON. Both come from **Creator Tools >
Update Existing Guide** and describe a small change to an already-published
guide. This is NOT a full new guide (that uses `publish-guide-draft`). Do not
confuse the two.

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
- **Preserve the guide's existing presentation.** Published guides may already
  have a design pass applied (`presentationVariant`, section `layoutVariant`,
  block `displayVariant` in `src/data/types.ts`). Keep or adjust those as needed
  for the change; do **not** reset a designed guide back to generic stacked
  cards.
- Run `npm run build` before finishing.

## Request shape

A request has these labeled fields (the readable submission) or the equivalent
JSON keys (older `robocor_guide_update_request`):

- **Guide** (`guideId` / title) - which published guide to change.
- **Section** (`sectionId` / title) - the target section, or
  "General guide-level change" (`"__general__"`).
- **Change type** - one of: `fix_text` (reword or correct text), `update_image`,
  `update_video`, `add_content` (add something new), `remove_content`,
  `needs_info` (flag as outdated / needs more info), `other`.
- **What needs to change** (`changeSummary`) - the requested change.
- **New material** (`materials`) - optional supporting content for the change,
  split into **Links** (URLs you fetch: a new image, video, doc, or page) and
  **Files** (attached to the submission), each with an optional note.
- **Notes for admin** (`notesForAdmin`) - plain notes to read first.

## Where guides live

Published guides are in `src/data/courses.ts` (the `courses` array). A guide is a
`Course`; its sections are `lessons`; a section's content blocks are its
`sections` (`LessonSection`). See `src/data/types.ts`.

## Process

1. **Read the update request** (the labeled "ROBOCOR GUIDE UPDATE REQUEST"
   submission, or the older JSON). If it is clearly something else, stop and say so.
2. **Identify the guide and section** from the request.
3. **Locate the existing guide** in `src/data/courses.ts` by guide id/title, and
   the section by id/title (or treat it as a guide-level change for
   "General guide-level change"). If it cannot be found, stop and flag it.
4. **Review the requested change** (change type, "what needs to change", and any
   "new material" links/files).
5. **Apply only clear, specific changes.** If the request is ambiguous, make no
   change and flag exactly what needs confirmation.
6. **For an image or video** (`update_image` / `update_video`):
   - Use a public URL or `/images/` path from the "new material" links when given.
   - If the creator attached a file, use that attachment. Do not assume a file
     exists if it was not provided; leave a clear note and do not fabricate it.
   - A video becomes a `video` (YouTube) block; generate concise alt text for
     images from the surrounding context.
7. **Preserve existing guide structure and styling**, including any presentation
   metadata (`layoutVariant`, `displayVariant`). Change only what the request
   asks for, and keep new content consistent with the section's existing layout
   and the show-don't-tell style. For `needs_info`, set the section's
   `contentStatus: "pending"` with an honest `pendingNote`; do not delete its
   existing content unless asked.
8. **Run `npm run build`** and fix any type errors.
9. **Summarize** for the client:
    - what changed
    - what was not changed
    - what assets are missing
    - what needs confirmation
    - whether the build passed
