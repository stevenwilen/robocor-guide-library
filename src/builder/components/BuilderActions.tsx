import { useEffect, useRef, useState } from "react";
import { CopyIcon, DownloadIcon, InfoIcon } from "../../components/icons";
import type { CourseDraft } from "../draftTypes";
import { kebab, toJSON, type GuideDraftExport } from "../exportDraft";
import { validateDraft } from "../validation";
import { SaveIndicator, type SaveState } from "../../components/SaveFeedback";

const CREATOR_EMAIL = "steven.wilen@gmail.com";

type Banner = { type: "info" | "error"; text: string } | null;

export default function BuilderActions({
  course,
  exportDoc,
  onSave,
  onClear,
  status,
  savedTime,
}: {
  course: CourseDraft;
  exportDoc: GuideDraftExport;
  onSave: () => void;
  onClear: () => void;
  status: SaveState;
  savedTime?: string;
}) {
  const [banner, setBanner] = useState<Banner>(null);
  const [copied, setCopied] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Make sure feedback is seen: the action buttons can sit far down a long
  // Review page, so scroll the message into view when it appears.
  useEffect(() => {
    if (banner) bannerRef.current?.scrollIntoView({ block: "nearest" });
  }, [banner]);

  const errors = validateDraft(course);
  const valid = errors.length === 0;
  const json = toJSON(exportDoc);

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
      <div className="flex flex-wrap items-center gap-2">
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

      {/* How to submit: there is no submit button. The creator copies or
          downloads the JSON and emails it. */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
        <p className="font-semibold">How to submit this guide</p>
        <p className="mt-1">
          There is no automatic submit. Use <strong>Copy JSON</strong> or{" "}
          <strong>Download JSON</strong> below, then email it (with any image
          files) to{" "}
          <a
            href={`mailto:${CREATOR_EMAIL}?subject=Guide draft for review`}
            className="font-semibold underline"
          >
            {CREATOR_EMAIL}
          </a>
          . The guide goes live only after Steven reviews and publishes it.
        </p>
      </div>

      {/* Export group */}
      <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Feedback shows right under the buttons so it's seen where you click. */}
      {banner && (
        <div
          ref={bannerRef}
          className={`flex items-start gap-2.5 rounded-xl border p-4 text-sm ${
            banner.type === "error"
              ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200"
              : "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
          }`}
        >
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed">{banner.text}</span>
        </div>
      )}
    </div>
  );
}
