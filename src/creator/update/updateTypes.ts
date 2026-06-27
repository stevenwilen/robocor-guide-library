// Data model for an "Update Existing Guide" request. This never edits a live
// guide; it sends a small, plain-language change request (with any links or
// attached files) to the admin, who reviews and applies it with Claude.

import { type Material } from "../materials/types";

export type ChangeType =
  | "fix_text"
  | "update_image"
  | "update_video"
  | "add_content"
  | "remove_content"
  | "needs_info"
  | "other";

export const CHANGE_TYPES: { value: ChangeType; label: string }[] = [
  { value: "fix_text", label: "Reword or correct text" },
  { value: "update_image", label: "Update an image" },
  { value: "update_video", label: "Update a video" },
  { value: "add_content", label: "Add something new" },
  { value: "remove_content", label: "Remove something" },
  { value: "needs_info", label: "Flag as outdated / needs more info" },
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
  /** New material for the change: links and/or attached files, each with a note. */
  materials: Material[];
  /** Optional notes for the admin. */
  notesForAdmin: string;
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
    changeType: "fix_text",
    changeSummary: "",
    materials: [],
    notesForAdmin: "",
  };
}
