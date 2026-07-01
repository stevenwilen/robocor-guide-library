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
 * renderer in src/components/sections/ - the lesson page stays generic.
 */
/** A single image reference used by image and gallery blocks. */
export interface ImageRef {
  /** A usable URL (http(s) or an in-app preview). Optional when the file is
   *  still pending upload and only `intendedPath`/`fileName` are known. */
  src?: string;
  /** Where the file is expected to live once published, e.g. "/images/foo.png". */
  intendedPath?: string;
  /** Original file name, recorded so the publisher knows which asset to add. */
  fileName?: string;
  /**
   * Accessibility text. Optional in drafts - the Guide Builder no longer asks
   * for it; the publisher (see the publish-guide-draft skill) generates concise
   * alt text from the caption, file name, and surrounding content. The live
   * renderer still uses it.
   */
  alt?: string;
  caption?: string;
  /** True when the image file has not been provided yet (draft-only marker). */
  needsUpload?: boolean;
}

// Optional presentation metadata. Set during the publishing/design pass (never
// in the Builder) so a published guide can be laid out intentionally instead of
// as generic stacked cards. All optional - existing content is unaffected.
export type PresentationVariant =
  | "standard"
  | "compact"
  | "visual"
  | "training"
  | "reference";
export type SectionLayoutVariant =
  | "stacked"
  | "split"
  | "feature-checklist"
  | "steps-grid"
  | "media-right"
  | "media-left"
  | "compact-cards";
export type BlockDisplayVariant =
  | "card"
  | "plain"
  | "compact"
  | "grid"
  | "numbered"
  | "side-by-side"
  | "highlight";

export type LessonSection = (
  | { type: "paragraph"; heading?: string; text: string }
  | { type: "heading"; text: string }
  | {
      // Video block rendered as a responsive YouTube embed.
      // `youtubeId` is the id in https://www.youtube.com/embed/<youtubeId>.
      type: "video";
      title: string;
      youtubeId: string;
      durationLabel?: string;
      note?: string;
      /** Optional display emphasis. Defaults to "standard". */
      style?: "standard" | "feature" | "compact";
    }
  | { type: "keyNotes"; heading?: string; notes: string[] }
  | {
      type: "steps";
      heading?: string;
      steps: { title: string; detail?: string }[];
    }
  | {
      type: "callout";
      tone?: "info" | "tip" | "warning" | "readyCheck" | "important";
      heading?: string;
      text: string;
    }
  | ({
      type: "image";
      layout?: "standard" | "wide" | "sideBySide";
    } & ImageRef)
  | { type: "gallery"; heading?: string; images: ImageRef[] }
  | { type: "divider" }
  | { type: "pendingNote"; text: string }
  // Creative blocks added during the publishing/design pass (not collected by
  // the Builder). They give Claude expressive components to design real,
  // non-generic lessons.
  | {
      // A labeled breakdown / "anatomy" - each item is a named part with an
      // explanation. Good for "the parts of X" style teaching.
      type: "labeledList";
      heading?: string;
      items: { label: string; text: string }[];
    }
  | {
      // Side-by-side comparison (do/don't, good fit/keep human, before/after).
      type: "compare";
      heading?: string;
      columns: {
        label: string;
        tone?: "good" | "bad" | "neutral";
        items: string[];
      }[];
    }
  | {
      // A small, lightly-animated flow diagram: labeled nodes joined by arrows.
      // For showing a process at a glance instead of describing it.
      type: "flow";
      heading?: string;
      steps: { label: string; caption?: string }[];
    }
  | {
      // A concrete worked example: a real input next to the result. Shows
      // rather than tells.
      type: "example";
      heading?: string;
      input: { label: string; text: string };
      output: { label: string; text: string };
    }
) & { displayVariant?: BlockDisplayVariant };

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
   * checklist - it documents the gap honestly, it is not lesson content.
   */
  contentNeeded?: string[];
  /** Optional section layout chosen during the publishing/design pass. */
  layoutVariant?: SectionLayoutVariant;
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
  /** Intended reader, shown as a pill, e.g. "Interns", "Students", "Staff". */
  audience: string;
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
  /**
   * Optional prep items rendered in the sidebar "Before you start" card. Use
   * this for genuinely useful guidance instead of restating the hero metadata
   * (audience / duration / lesson count).
   */
  beforeYouStart?: string[];
  /** Optional knowledge-check quiz id (see src/data/quiz.ts). */
  quizId?: string;
  /** Optional overall presentation chosen during the publishing/design pass. */
  presentationVariant?: PresentationVariant;
  lessons: Lesson[];
}
