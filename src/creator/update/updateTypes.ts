// Data model for an "Update Existing Guide" request. This never edits a live
// guide; it produces a structured request JSON for Steven and Claude to review.

export type ChangeType =
  | "replace_text"
  | "replace_image"
  | "replace_video"
  | "add_block"
  | "remove_block"
  | "update_list"
  | "mark_needs_info"
  | "other";

export const CHANGE_TYPES: { value: ChangeType; label: string }[] = [
  { value: "replace_text", label: "Replace text" },
  { value: "replace_image", label: "Replace image" },
  { value: "replace_video", label: "Replace video" },
  { value: "add_block", label: "Add content block" },
  { value: "remove_block", label: "Remove content block" },
  { value: "update_list", label: "Update checklist/key notes" },
  { value: "mark_needs_info", label: "Mark section as needing more info" },
  { value: "other", label: "Other" },
];

export const CHANGE_TYPE_LABELS: Record<ChangeType, string> = Object.fromEntries(
  CHANGE_TYPES.map((c) => [c.value, c.label]),
) as Record<ChangeType, string>;

/** Sentinel section id for a change that is not tied to one section. */
export const GENERAL_SECTION = "__general__";

export interface UpdateRequestDraft {
  guideId: string;
  /** A section id, or GENERAL_SECTION for a guide-level change. */
  sectionId: string;
  changeType: ChangeType;
  /** "What needs to change?" */
  changeSummary: string;
  replacementContent: string;
  /** Image replacement: a typed URL/path. */
  imagePathOrUrl: string;
  /** Set when a local file was picked (metadata only; never uploaded). */
  imageFileName?: string;
  notesForPublisher: string;
}

export interface UpdateRequestDocument {
  request: UpdateRequestDraft;
  createdAt: string;
  updatedAt: string;
}

export function emptyUpdateRequest(): UpdateRequestDraft {
  return {
    guideId: "",
    sectionId: GENERAL_SECTION,
    changeType: "replace_text",
    changeSummary: "",
    replacementContent: "",
    imagePathOrUrl: "",
    imageFileName: undefined,
    notesForPublisher: "",
  };
}
