// Shared one-click submission via Web3Forms (a hosted form service; keeps the
// app fully static). The access key is a PUBLIC key by design - safe in
// frontend code; it only routes the submission to the admin inbox. No secrets.
// Used by both the New Guide brief and the Update Existing Guide request.

const ENDPOINT = "https://api.web3forms.com/submit";
const FALLBACK_KEY = "dde1e522-3027-489a-8dfd-fe8073569701";

export function web3formsKey(): string {
  return import.meta.env.VITE_WEB3FORMS_KEY?.trim() || FALLBACK_KEY;
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitForm(opts: {
  subject: string;
  message: string;
  files?: File[];
}): Promise<SubmitResult> {
  const key = web3formsKey();
  if (!key) return { ok: false, error: "No form key configured." };

  const form = new FormData();
  form.append("access_key", key);
  form.append("subject", opts.subject);
  form.append("from_name", "Robocor Creator Tools");
  form.append("message", opts.message);
  // Honeypot: real submitters leave this empty; bots fill it and get rejected.
  form.append("botcheck", "");
  (opts.files ?? []).forEach((file, i) => {
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
