import type { GuideBrief } from "./briefTypes";
import { buildSubmissionText } from "./exportBrief";

// One-click submission via Web3Forms (a hosted form service; keeps the app
// fully static). The access key is a PUBLIC key by design - it is safe in
// frontend code and only routes the submission to Steven's inbox. No private
// secrets here.

const ENDPOINT = "https://api.web3forms.com/submit";
const FALLBACK_KEY = "dde1e522-3027-489a-8dfd-fe8073569701";

export function web3formsKey(): string {
  return import.meta.env.VITE_WEB3FORMS_KEY?.trim() || FALLBACK_KEY;
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitBrief(
  brief: GuideBrief,
  files: File[],
): Promise<SubmitResult> {
  const key = web3formsKey();
  if (!key) return { ok: false, error: "No form key configured." };

  const form = new FormData();
  form.append("access_key", key);
  form.append("subject", `Guide brief: ${brief.title.trim() || "Untitled"}`);
  form.append("from_name", "Robocor Creator Tools");
  form.append("message", buildSubmissionText(brief));
  // Honeypot: real submitters leave this empty; bots fill it and get rejected.
  form.append("botcheck", "");
  files.forEach((file, i) => {
    form.append(`attachment_${i + 1}`, file, file.name);
  });

  try {
    const res = await fetch(ENDPOINT, { method: "POST", body: form });
    const data = (await res.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;
    if (res.ok && data?.success) return { ok: true };
    return {
      ok: false,
      error: data?.message || `Submission failed (status ${res.status}).`,
    };
  } catch {
    return {
      ok: false,
      error: "Could not reach the form service. Check your connection.",
    };
  }
}
