// Validation and a readable submission body for an update request. Like the
// brief, there is no JSON envelope: the request is sent as labeled fields plus
// any attached file via the form service.

import { courses } from "../../data/courses";
import { cleanMaterials } from "../materials/types";
import {
  CHANGE_TYPE_LABELS,
  GENERAL_SECTION,
  type ChangeType,
  type UpdateRequestDraft,
} from "./updateTypes";

export function guideTitleFor(guideId: string): string {
  return courses.find((c) => c.id === guideId)?.title ?? "";
}

export function sectionTitleFor(guideId: string, sectionId: string): string {
  if (sectionId === GENERAL_SECTION) return "Whole guide (general change)";
  const guide = courses.find((c) => c.id === guideId);
  return guide?.lessons.find((l) => l.id === sectionId)?.title ?? "";
}

export function validateUpdate(req: UpdateRequestDraft): string[] {
  const errors: string[] = [];
  if (!req.guideId) errors.push("Select a guide.");
  if (!req.changeSummary.trim()) errors.push("Describe what needs to change.");
  if (
    (req.changeType === "update_image" || req.changeType === "update_video") &&
    cleanMaterials(req.materials).length === 0
  ) {
    errors.push("Add the new image or video: add a link, or attach a file.");
  }
  return errors;
}

export function buildUpdateText(req: UpdateRequestDraft): string {
  const materials = cleanMaterials(req.materials);
  const links = materials.filter((m) => m.kind === "link");
  const fileMaterials = materials.filter((m) => m.kind === "file");

  const lines: string[] = [];
  lines.push("ROBOCOR GUIDE UPDATE REQUEST");
  lines.push("");
  lines.push(`Guide: ${guideTitleFor(req.guideId) || "(not selected)"}${req.guideId ? ` (${req.guideId})` : ""}`);
  lines.push(`Section: ${sectionTitleFor(req.guideId, req.sectionId)}`);
  lines.push(
    `Change type: ${CHANGE_TYPE_LABELS[req.changeType as ChangeType] ?? req.changeType}`,
  );
  lines.push("");

  lines.push("What needs to change:");
  lines.push(`  ${req.changeSummary.trim()}`);
  lines.push("");

  if (materials.length > 0) {
    lines.push("New material:");
    if (links.length > 0) {
      lines.push("  Links (Claude can open these directly):");
      links.forEach((m) =>
        lines.push(`    - ${m.ref.trim()}${m.note?.trim() ? ` — ${m.note.trim()}` : ""}`),
      );
    }
    if (fileMaterials.length > 0) {
      lines.push("  Files (attached to this email):");
      fileMaterials.forEach((m) =>
        lines.push(`    - ${m.ref.trim()}${m.note?.trim() ? ` — ${m.note.trim()}` : ""}`),
      );
    }
    lines.push("");
  }
  if (req.notesForAdmin.trim()) {
    lines.push("Notes for admin:");
    lines.push(`  ${req.notesForAdmin.trim()}`);
    lines.push("");
  }

  lines.push(
    "This is an update request, not a new guide. Apply it as a small change to the existing published guide with the publish-guide-update skill. Live only after review; preserve the guide's existing design.",
  );
  return lines.join("\n");
}

export function updateFileName(req: UpdateRequestDraft): string {
  return `${req.guideId || "guide"}-update-request.txt`;
}
