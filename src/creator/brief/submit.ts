import type { GuideBrief } from "./briefTypes";
import { buildSubmissionText } from "./exportBrief";
import { submitForm, type SubmitResult } from "../formSubmit";

// One-click brief submission. Bundles the structured brief plus the actual file
// attachments into a single email to the admin via the shared form service.

export type { SubmitResult };

export async function submitBrief(
  brief: GuideBrief,
  files: File[],
): Promise<SubmitResult> {
  return submitForm({
    subject: `Guide brief: ${brief.title.trim() || "Untitled"}`,
    message: buildSubmissionText(brief),
    files,
  });
}
