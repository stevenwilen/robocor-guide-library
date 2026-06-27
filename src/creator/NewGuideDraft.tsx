import { useState } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  DownloadIcon,
  InfoIcon,
} from "../components/icons";
import {
  Field,
  Select,
  StringListEditor,
  TextArea,
  TextInput,
} from "../builder/components/fields";
import {
  SaveIndicator,
  Toast,
  formatSavedTime,
  useToast,
} from "../components/SaveFeedback";
import { useBrief } from "./brief/useBrief";
import { AUDIENCES, type Audience } from "./brief/briefTypes";
import {
  buildSubmissionText,
  scopeOf,
  submissionFileName,
  validateBrief,
} from "./brief/exportBrief";
import { submitBrief } from "./brief/submit";
import { MaterialsEditor } from "./materials/MaterialsEditor";
import { useMaterialFiles } from "./materials/useMaterialFiles";

const CREATOR_EMAIL = "steven.wilen@gmail.com";

type SendState = "idle" | "sending" | "sent" | "error";

// "New Guide" = a commission brief. The creator states intent and drops their
// materials; one click sends everything (links + files) to Steven, who scopes,
// sections, and designs it with Claude.
export default function NewGuideDraft() {
  const { brief, status, doc, setBrief, save, clear } = useBrief();
  const { message: toast, show: showToast } = useToast();
  const savedTime = formatSavedTime(doc.updatedAt);

  const files = useMaterialFiles();

  const [send, setSend] = useState<SendState>("idle");
  const [sendError, setSendError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const baseErrors = validateBrief(brief);
  const missing = files.missingFiles(brief.materials);
  const blockers = [
    ...baseErrors,
    ...(missing.length
      ? [
          `Re-select ${missing.length} file${
            missing.length === 1 ? "" : "s"
          } so they attach to the submission.`,
        ]
      : []),
  ];
  const canSend = blockers.length === 0;
  const scope = scopeOf(brief);

  function handleSave() {
    save();
    showToast("Brief saved locally");
  }
  function handleClear() {
    if (
      typeof window === "undefined" ||
      window.confirm("Clear this brief? This cannot be undone.")
    ) {
      clear();
      files.resetFiles();
      setSend("idle");
      setSendError(null);
      setBanner("Brief cleared.");
    }
  }

  async function handleSend() {
    if (!canSend || send === "sending") return;
    setSend("sending");
    setSendError(null);
    const result = await submitBrief(brief, files.collectFiles(brief.materials));
    if (result.ok) {
      setSend("sent");
      save();
    } else {
      setSend("error");
      setSendError(result.error ?? "Something went wrong.");
    }
  }

  function downloadFallback() {
    const blob = new Blob([buildSubmissionText(brief)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = submissionFileName(brief);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Brief a new guide. List the topics and drop your materials (links or
          files). You do not write the lessons; the admin scopes and designs it
          from what you send.
        </p>
        <SaveIndicator status={status} savedTime={savedTime} />
      </div>

      {/* Basics */}
      <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <Field label="Guide title" required>
          <TextInput
            value={brief.title}
            onChange={(v) => setBrief((b) => ({ ...b, title: v }))}
            placeholder="e.g. Front Desk Opening Routine"
          />
        </Field>
        <Field label="Who is it for">
          <Select<Audience>
            value={brief.audience}
            onChange={(v) => setBrief((b) => ({ ...b, audience: v }))}
            options={AUDIENCES}
          />
        </Field>
        <Field
          label="What should it help them do?"
          required
          hint="The outcome. This bounds the scope."
        >
          <TextArea
            value={brief.goal}
            onChange={(v) => setBrief((b) => ({ ...b, goal: v }))}
            placeholder="By the end, the reader can..."
          />
        </Field>
      </div>

      {/* Topics */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <Field
          label="Topics to cover"
          required
          hint="What the guide should cover. Steven decides how to section and design it."
        >
          <StringListEditor
            items={brief.topics}
            onChange={(topics) => setBrief((b) => ({ ...b, topics }))}
            placeholder="A topic to cover"
            addLabel="Add topic"
          />
        </Field>
      </div>

      {/* Materials */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <MaterialsEditor
          materials={brief.materials}
          onChange={(materials) => setBrief((b) => ({ ...b, materials }))}
          attached={files.attached}
          onPick={files.pickFile}
          onDrop={files.dropFile}
          required
          minItems={1}
          description="Drop everything you have. Prefer links (a page, Drive, Dropbox, YouTube) - they are read directly. For a local file, choose it and it is attached to the submission. Keep big media as links."
        />
      </div>

      {/* Optional */}
      <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <Field label="Feel / brand notes (optional)">
          <TextInput
            value={brief.feel}
            onChange={(v) => setBrief((b) => ({ ...b, feel: v }))}
            placeholder="e.g. friendly and visual, like a quick-start"
          />
        </Field>
        <Field label="Must include / leave out / examples (optional)">
          <TextArea
            value={brief.notes}
            onChange={(v) => setBrief((b) => ({ ...b, notes: v }))}
            placeholder="Anything that must appear, must be avoided, or a specific example to feature."
          />
        </Field>
      </div>

      {/* Scope review */}
      <ScopeReview
        topics={scope.topics}
        materials={scope.materials}
        links={scope.links}
        files={scope.files}
        flags={scope.flags}
      />

      {/* Blockers */}
      {blockers.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-900/20">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Complete the brief before sending:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-800 dark:text-amber-200">
            {blockers.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Save / clear */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Save brief
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-200"
        >
          Clear brief
        </button>
      </div>

      {/* Send */}
      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          One click sends the brief and all attached files to the admin. Nothing
          is published automatically.
        </p>

        {send === "sent" ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100">
            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="leading-relaxed">
              Brief sent to the admin. They will review the scope and follow up.
              You can keep this brief or clear it.
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend || send === "sending"}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {send === "sending" ? "Sending…" : "Send brief to admin"}
            {send !== "sending" && <ArrowRightIcon className="h-4 w-4" />}
          </button>
        )}

        {send === "error" && (
          <div className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-900/20 dark:text-red-100">
            <p className="leading-relaxed">
              {sendError} You can try again, or download a copy and{" "}
              <a
                href={`mailto:${CREATOR_EMAIL}?subject=Guide brief`}
                className="font-semibold underline"
              >
                email it to the admin
              </a>{" "}
              with your files.
            </p>
            <button
              type="button"
              onClick={downloadFallback}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:text-red-200"
            >
              <DownloadIcon className="h-4 w-4" />
              Download a copy
            </button>
          </div>
        )}
      </div>

      {banner && (
        <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed">{banner}</span>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}

function ScopeReview({
  topics,
  materials,
  links,
  files,
  flags,
}: {
  topics: number;
  materials: number;
  links: number;
  files: number;
  flags: string[];
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
        This is a brief, not a finished guide. The admin scopes and designs the
        final guide from your topics and materials.
      </div>
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Scope summary
        </h3>
        <dl className="mt-3 grid grid-cols-3 gap-3 text-center">
          <Stat label="Topics" value={topics} />
          <Stat label="Links" value={links} />
          <Stat label="Files" value={files} />
        </dl>
        <p className="mt-3 text-xs text-slate-500">
          {materials} material{materials === 1 ? "" : "s"} total.
        </p>
        {flags.length > 0 && (
          <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-700">
            {flags.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50 py-3 dark:border-slate-700 dark:bg-slate-800/40">
      <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {value}
      </div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>
    </div>
  );
}
