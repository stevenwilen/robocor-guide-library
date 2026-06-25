// Draft data model for the Guide Builder.
//
// These shapes mirror the published content model in src/data/types.ts as
// closely as is practical, plus stable ids for reordering and a couple of
// editor-only fields. On export they are converted to a guide draft envelope
// (see exportDraft.ts) so a reviewed draft can be integrated into
// src/data/courses.ts with minimal editing.
//
// Internal type names stay Course/Lesson to match the published model and avoid
// a risky rename; the visible language is Guide/Section.

export type Audience =
  | "interns"
  | "students"
  | "staff"
  | "customers"
  | "other";

/** Internal section state. "available" = ready to include,
 *  "pending" = needs more info. */
export type LessonDraftStatus = "available" | "pending";
export type VideoStyle = "standard" | "feature" | "compact";
export type ImageLayout = "standard" | "wide" | "sideBySide";
export type CalloutTone = "tip" | "warning" | "readyCheck" | "important";

/** An image reference inside the builder. The local preview object URL is
 *  NEVER stored here — it lives only in component state and is not persisted.
 *  Alt text is intentionally not collected here; the publisher generates it. */
export interface DraftImage {
  id: string;
  /** Typed image URL or expected file path. */
  pathOrUrl: string;
  /** Set when a local file was chosen (marks the asset as needing upload). */
  fileName?: string;
  caption?: string;
}

export type DraftBlock =
  | { id: string; type: "paragraph"; heading?: string; text: string }
  | {
      id: string;
      type: "video";
      youtube: string; // URL or bare id
      caption?: string;
      style?: VideoStyle;
    }
  | { id: string; type: "image"; image: DraftImage; layout?: ImageLayout }
  | { id: string; type: "gallery"; heading?: string; images: DraftImage[] }
  | { id: string; type: "checklist"; items: string[] }
  | { id: string; type: "keyNotes"; notes: string[] }
  | {
      id: string;
      type: "callout";
      tone: CalloutTone;
      title?: string;
      body: string;
    };

export type DraftBlockType = DraftBlock["type"];

export interface LessonDraft {
  id: string;
  title: string;
  /** Optional one-line section description. */
  description: string;
  status: LessonDraftStatus;
  /** When the section needs more info: what is still needed. */
  pendingNote?: string;
  blocks: DraftBlock[];
}

export interface CourseDraft {
  title: string;
  description: string;
  audience: Audience;
  bannerImage?: string;
  lessons: LessonDraft[];
}

/** The working document persisted to localStorage. */
export interface DraftDocument {
  course: CourseDraft;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

/** Small unique id. crypto.randomUUID where available, else a timestamp+counter. */
let counter = 0;
export function uid(prefix = "b"): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
    }
  } catch {
    /* fall through */
  }
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter}`;
}

export function emptyCourse(): CourseDraft {
  return {
    title: "",
    description: "",
    audience: "interns",
    bannerImage: "",
    lessons: [newLesson()],
  };
}

export function newLesson(): LessonDraft {
  return {
    id: uid("s"),
    title: "",
    description: "",
    status: "available",
    pendingNote: "",
    blocks: [],
  };
}

export function newImage(): DraftImage {
  return { id: uid("img"), pathOrUrl: "", fileName: undefined, caption: "" };
}

export function newBlock(type: DraftBlockType): DraftBlock {
  const id = uid("blk");
  switch (type) {
    case "paragraph":
      return { id, type, heading: "", text: "" };
    case "video":
      return { id, type, youtube: "", caption: "", style: "standard" };
    case "image":
      return { id, type, image: newImage(), layout: "standard" };
    case "gallery":
      return { id, type, heading: "", images: [newImage()] };
    case "checklist":
      return { id, type, items: [""] };
    case "keyNotes":
      return { id, type, notes: [""] };
    case "callout":
      return { id, type, tone: "tip", title: "", body: "" };
  }
}

/** Simple human label for each block type. */
export const BLOCK_LABELS: Record<DraftBlockType, string> = {
  paragraph: "Paragraph",
  video: "Video",
  image: "Image",
  gallery: "Image gallery",
  checklist: "Checklist",
  keyNotes: "Key notes",
  callout: "Callout",
};

/** Order blocks appear in the "add block" menu. */
export const BLOCK_TYPES: DraftBlockType[] = [
  "paragraph",
  "video",
  "image",
  "gallery",
  "checklist",
  "keyNotes",
  "callout",
];
