// Builds the self-identifying update-request envelope and validates it.

import { courses } from "../../data/courses";
import { isProvidedReference } from "../../builder/exportDraft";
import {
  GENERAL_SECTION,
  type UpdateRequestDraft,
} from "./updateTypes";

export interface UpdateAsset {
  fileName: string;
  intendedPath: string;
  needsUpload: true;
}

export interface GuideUpdateExport {
  _type: "robocor_guide_update_request";
  schemaVersion: "1.0";
  submissionStatus: "pending_approval";
  intendedAction: "review_and_apply_update_to_guide_library";
  claudeSkill: "publish-guide-update";
  createdAt: string;
  guideId: string;
  guideTitle: string;
  sectionId: string;
  sectionTitle: string;
  changeType: string;
  changeSummary: string;
  replacementContent: string;
  /** Present for image replacements that use a public URL or /images/ path. */
  imageReference?: string;
  assets: UpdateAsset[];
  notesForPublisher: string[];
}

function guideTitleFor(guideId: string): string {
  return courses.find((c) => c.id === guideId)?.title ?? "";
}

function sectionTitleFor(guideId: string, sectionId: string): string {
  if (sectionId === GENERAL_SECTION) return "General guide-level change";
  const guide = courses.find((c) => c.id === guideId);
  return guide?.lessons.find((l) => l.id === sectionId)?.title ?? "";
}

export function validateUpdate(req: UpdateRequestDraft): string[] {
  const errors: string[] = [];
  if (!req.guideId) errors.push("Select a guide.");
  if (!req.changeSummary.trim()) {
    errors.push("Describe what needs to change.");
  }
  if (
    req.changeType === "replace_image" &&
    !req.imagePathOrUrl.trim() &&
    !req.imageFileName
  ) {
    errors.push(
      "Add a replacement image: a URL/path, or pick a local file to send.",
    );
  }
  return errors;
}

export function buildUpdateExport(
  req: UpdateRequestDraft,
  meta: { createdAt: string },
): GuideUpdateExport {
  const assets: UpdateAsset[] = [];
  let imageReference: string | undefined;

  if (req.changeType === "replace_image") {
    const value = req.imagePathOrUrl.trim();
    if (isProvidedReference(value)) {
      // Provided public reference: usable as-is, no file needed.
      imageReference = value;
    } else if (req.imageFileName) {
      // Local file: only metadata travels; the file is sent separately.
      const intendedPath = value || `/images/${req.imageFileName}`;
      assets.push({
        fileName: req.imageFileName,
        intendedPath,
        needsUpload: true,
      });
    } else if (value) {
      imageReference = value;
    }
  }

  const notesForPublisher: string[] = [
    "This is an update request, not a full guide draft. Apply it as a small change to the existing published guide.",
  ];
  if (req.notesForPublisher.trim()) {
    notesForPublisher.push(req.notesForPublisher.trim());
  }
  if (assets.length > 0) {
    notesForPublisher.push(
      "A local image file is referenced and must be sent with this request. Do not assume it exists.",
    );
  }

  return {
    _type: "robocor_guide_update_request",
    schemaVersion: "1.0",
    submissionStatus: "pending_approval",
    intendedAction: "review_and_apply_update_to_guide_library",
    claudeSkill: "publish-guide-update",
    createdAt: meta.createdAt,
    guideId: req.guideId,
    guideTitle: guideTitleFor(req.guideId),
    sectionId: req.sectionId,
    sectionTitle: sectionTitleFor(req.guideId, req.sectionId),
    changeType: req.changeType,
    changeSummary: req.changeSummary.trim(),
    replacementContent: req.replacementContent.trim(),
    ...(imageReference ? { imageReference } : {}),
    assets,
    notesForPublisher,
  };
}

export function updateToJSON(doc: GuideUpdateExport): string {
  return JSON.stringify(doc, null, 2);
}
