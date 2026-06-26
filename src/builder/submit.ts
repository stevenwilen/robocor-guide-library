// Shared "Submit for approval" behavior for guide drafts and update requests.
//
// There is no backend. If an optional submission endpoint is configured we POST
// the JSON; otherwise we honestly report that submission is not connected and
// rely on Copy / Download JSON. We never fake a submission.

export type SubmitResult =
  | { kind: "no_endpoint" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function submissionConnected(): boolean {
  return !!import.meta.env.VITE_SUBMISSION_ENDPOINT;
}

export async function submitJson(json: string): Promise<SubmitResult> {
  const endpoint = import.meta.env.VITE_SUBMISSION_ENDPOINT;
  if (!endpoint) return { kind: "no_endpoint" };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    return { kind: "success" };
  } catch (e) {
    return { kind: "error", message: e instanceof Error ? e.message : "Unknown error" };
  }
}

export const NOT_CONNECTED_MESSAGE =
  "Submission is not connected yet. Copy or download the JSON and send it to Steven for review.";
