// Content model for the Robocore Guide Library.
//
// IMPORTANT distinction:
//   - `contentStatus` describes whether the LESSON CONTENT exists yet
//     ("available") or is reserved for future content ("pending").
//   - A user's COMPLETION is NOT stored here. It lives only in localStorage
//     (see src/hooks/useProgress.ts) keyed by lesson id. Content state and
//     user progress are intentionally kept separate.

export type ContentStatus = "available" | "pending";

/**
 * A renderable block within a lesson. Add new block types here and a matching
 * renderer in src/components/sections/ — the lesson page stays generic.
 */
export type LessonSection =
  | { type: "paragraph"; heading?: string; text: string }
  | {
      // Styled video placeholder. No real media asset is bundled; `poster`
      // is an optional image URL if one is added later.
      type: "video";
      title: string;
      durationLabel?: string;
      note?: string;
      poster?: string;
    }
  | { type: "keyNotes"; heading?: string; notes: string[] }
  | {
      type: "steps";
      heading?: string;
      steps: { title: string; detail?: string }[];
    }
  | {
      type: "callout";
      tone?: "info" | "tip" | "warning";
      heading?: string;
      text: string;
    };

export interface Lesson {
  id: string;
  /** Display order number, e.g. "Lesson 1". */
  number: number;
  title: string;
  /** One-line summary shown in lesson lists. */
  summary: string;
  contentStatus: ContentStatus;
  durationLabel?: string;
  /** Shown when contentStatus === "pending". Honest, plain wording. */
  pendingNote?: string;
  /** Present when contentStatus === "available". */
  sections?: LessonSection[];
}

export interface Course {
  id: string;
  title: string;
  /** Short tagline under the title. */
  subtitle: string;
  level: string;
  durationLabel: string;
  /** Small eyebrow label on the overview hero, e.g. "Course". */
  heroEyebrow?: string;
  /** One-line description for the directory card. */
  description: string;
  /** "About this course" body paragraphs on the overview page. */
  about: string[];
  lessons: Lesson[];
}
