import type { CourseDraft } from "./draftTypes";

// Validation gate run before export or submission. Returns a list of plain,
// actionable messages. An empty list means the draft is valid.
export function validateDraft(course: CourseDraft): string[] {
  const errors: string[] = [];

  if (!course.title.trim()) errors.push("Guide title is required.");
  if (!course.description.trim()) errors.push("Guide description is required.");
  if (course.lessons.length === 0) errors.push("Add at least one section.");

  course.lessons.forEach((lesson, i) => {
    const n = i + 1;
    const label = lesson.title.trim() ? `"${lesson.title.trim()}"` : `Section ${n}`;
    if (!lesson.title.trim()) errors.push(`Section ${n}: a title is required.`);
    if (lesson.status === "pending" && !lesson.pendingNote?.trim()) {
      errors.push(
        `${label}: explain what information is still needed for this section.`,
      );
    }
    if (lesson.status === "available" && lesson.blocks.length === 0) {
      errors.push(
        `${label}: add at least one content block, or set it to "Needs more info".`,
      );
    }
  });

  return errors;
}
