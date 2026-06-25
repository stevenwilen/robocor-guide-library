import type { CourseDraft } from "./draftTypes";

// Validation gate run before export or submission. Returns a list of plain,
// actionable messages. An empty list means the draft is valid.
export function validateDraft(course: CourseDraft): string[] {
  const errors: string[] = [];

  if (!course.title.trim()) errors.push("Course title is required.");
  if (!course.description.trim()) errors.push("Short description is required.");
  if (!course.goal.trim()) errors.push("Course goal is required.");
  if (course.lessons.length === 0) errors.push("Add at least one lesson.");

  course.lessons.forEach((lesson, i) => {
    const n = i + 1;
    const label = lesson.title.trim() ? `"${lesson.title.trim()}"` : `Lesson ${n}`;
    if (!lesson.title.trim()) errors.push(`Lesson ${n}: a title is required.`);
    if (lesson.status === "pending" && !lesson.pendingNote?.trim()) {
      errors.push(`${label}: a pending note is required for pending lessons.`);
    }
    if (lesson.status === "available" && lesson.blocks.length === 0) {
      errors.push(
        `${label}: add at least one content block, or mark the lesson pending.`,
      );
    }
  });

  return errors;
}
