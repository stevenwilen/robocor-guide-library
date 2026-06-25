import { useState } from "react";
import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  InfoIcon,
  SendIcon,
} from "../../components/icons";
import type { CourseDraft } from "../draftTypes";
import { kebab, toJSON, type GuideDraftExport } from "../exportDraft";
import { validateDraft } from "../validation";

type Banner =
  | { type: "info" | "success" | "error"; text: string }
  | null;

export default function BuilderActions({
  course,
  exportDoc,
  onSave,
  onLoad,
  onClear,
  onSubmitted,
}: {
  course: CourseDraft;
  exportDoc: GuideDraftExport;
  onSave: () => void;
  onLoad: () => boolean;
  onClear: () => void;
  onSubmitted: () => void;
}) {
  const [banner, setBanner] = useState<Banner>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const errors = validateDraft(course);
  const valid = errors.length === 0;
  const json = toJSON(exportDoc);
  const endpoint = import.meta.env.VITE_COURSE_SUBMISSION_ENDPOINT;

  async function copyJSON() {
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setBanner({
        type: "error",
        text: "Could not copy automatically. Use Download JSON instead.",
      });
    }
  }

  function downloadJSON() {
    if (!valid) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kebab(course.title) || "guide"}-draft.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function submit() {
    if (!valid) {
      setBanner({
        type: "error",
        text: "Fix the items below before submitting.",
      });
      return;
    }
    if (!endpoint) {
      setBanner({
        type: "info",
        text: "Submission is not connected yet. Copy or download the JSON and send it to Steven for review.",
      });
      return;
    }
    setSubmitting(true);
    setBanner(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      onSubmitted();
      setBanner({
        type: "success",
        text: "Submitted for approval. This draft will be reviewed and polished before being added to the live guide library.",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setBanner({
        type: "error",
        text: `Could not submit (${msg}). You can still Copy or Download the JSON and send it to Steven.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Validation */}
      {!valid && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-900/20">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Resolve these before exporting or submitting:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-800 dark:text-amber-200">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {banner && (
        <div
          className={`flex items-start gap-2.5 rounded-xl border p-4 text-sm ${
            banner.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200"
              : banner.type === "error"
                ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200"
                : "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
          }`}
        >
          {banner.type === "success" ? (
            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span className="leading-relaxed">{banner.text}</span>
        </div>
      )}

      {/* Save group */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={() => {
            const ok = onLoad();
            setBanner(
              ok
                ? { type: "info", text: "Loaded the saved draft from this device." }
                : { type: "info", text: "No saved draft was found on this device." },
            );
          }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Load saved draft
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              typeof window === "undefined" ||
              window.confirm("Clear the current draft? This cannot be undone.")
            ) {
              onClear();
              setBanner({ type: "info", text: "Draft cleared." });
            }
          }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-200"
        >
          Clear draft
        </button>
      </div>

      {/* Export / submit group */}
      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
        <button
          type="button"
          onClick={copyJSON}
          disabled={!valid}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <CopyIcon className="h-4 w-4" />
          {copied ? "Copied" : "Copy JSON"}
        </button>
        <button
          type="button"
          onClick={downloadJSON}
          disabled={!valid}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <DownloadIcon className="h-4 w-4" />
          Download JSON
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          <SendIcon className="h-4 w-4" />
          {submitting ? "Submitting…" : "Submit for approval"}
        </button>
      </div>

      <p className="text-xs leading-relaxed text-slate-400">
        Copy JSON or Download JSON is the main way to submit a draft right now.
        Send the JSON (and any image files) to Steven for review.
      </p>
    </div>
  );
}
