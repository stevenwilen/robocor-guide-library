import { useEffect, useRef, useState } from "react";
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
import { NOT_CONNECTED_MESSAGE, submitJson } from "../submit";
import { SaveIndicator, type SaveState } from "../../components/SaveFeedback";

type Banner = { type: "info" | "success" | "error"; text: string } | null;

export default function BuilderActions({
  course,
  exportDoc,
  onSave,
  onClear,
  onSubmitted,
  status,
  savedTime,
}: {
  course: CourseDraft;
  exportDoc: GuideDraftExport;
  onSave: () => void;
  onClear: () => void;
  onSubmitted: () => void;
  status: SaveState;
  savedTime?: string;
}) {
  const [banner, setBanner] = useState<Banner>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Make sure feedback is seen: the action buttons can sit far down a long
  // Review page, so scroll the message into view when it appears.
  useEffect(() => {
    if (banner) bannerRef.current?.scrollIntoView({ block: "nearest" });
  }, [banner]);

  const errors = validateDraft(course);
  const valid = errors.length === 0;
  const json = toJSON(exportDoc);

  async function submit() {
    if (!valid) return;
    setSubmitting(true);
    const result = await submitJson(json);
    setSubmitting(false);
    if (result.kind === "no_endpoint") {
      setBanner({ type: "info", text: NOT_CONNECTED_MESSAGE });
    } else if (result.kind === "success") {
      onSubmitted();
      setBanner({
        type: "success",
        text: "Submitted for approval. This draft will be reviewed and polished before being added to the live guide library.",
      });
    } else {
      setBanner({
        type: "error",
        text: `Could not submit (${result.message}). You can still Copy or Download the JSON and send it to Steven.`,
      });
    }
  }

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

  return (
    <div className="space-y-4">
      {/* Validation */}
      {!valid && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-900/20">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Resolve these before exporting:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-800 dark:text-amber-200">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
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
        <span className="flex items-center pl-1">
          <SaveIndicator status={status} savedTime={savedTime} />
        </span>
      </div>

      {/* Export group */}
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
          disabled={!valid || submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          <SendIcon className="h-4 w-4" />
          {submitting ? "Submitting…" : "Submit for approval"}
        </button>
      </div>

      {/* Feedback shows right under the buttons so it's seen where you click. */}
      {banner && (
        <div
          ref={bannerRef}
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

      <p className="text-xs leading-relaxed text-slate-400">
        Submission is not connected yet, so use Copy JSON or Download JSON and
        send it (with any image files) to steven.wilen@gmail.com for review.
      </p>
    </div>
  );
}
