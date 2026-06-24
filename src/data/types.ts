// Content model for the Robocor Guide Library.
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
      // Video block rendered as a responsive YouTube embed.
      // `youtubeId` is the id in https://www.youtube.com/embed/<youtubeId>.
      type: "video";
      title: string;
      youtubeId: string;
      durationLabel?: string;
      note?: string;
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
  /**
   * For pending lessons: the source material still required before this lesson
   * can be written. Rendered as a "Content needed to complete this lesson"
   * checklist — it documents the gap honestly, it is not lesson content.
   */
  contentNeeded?: string[];
  /** Present when contentStatus === "available". */
  sections?: LessonSection[];
}

/**
 * A course that the library is structured to support but that has not been
 * built yet. Rendered as a clearly-labeled, non-clickable planned card so the
 * directory can show future scope without pretending the course exists.
 */
export interface PlannedCourse {
  id: string;
  title: string;
  description: string;
  /** Honest status label, e.g. "Pending updated app workflow". */
  status: string;
}

export interface Course {
  id: string;
  title: string;
  /** Short tagline under the title. */
  subtitle: string;
  level: string;
  durationLabel: string;
  /**
   * Optional banner / identity image. Served from the public folder, so use a
   * root-absolute path like "/images/morpheus-drive.png" (file lives in
   * public/images/). Used on the overview hero and the directory card.
   */
  image?: string;
  /** Small eyebrow label on the overview hero, e.g. "Course". */
  heroEyebrow?: string;
  /** One-line description for the directory card. */
  description: string;
  /** "About this course" body paragraphs on the overview page. */
  about: string[];
  /** Optional bullet list rendered in the "What this guide helps with" card. */
  helpsWith?: string[];
  /** Optional knowledge-check quiz id (see src/data/quiz.ts). */
  quizId?: string;
  lessons: Lesson[];
}
