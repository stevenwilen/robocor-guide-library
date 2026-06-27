import { useMemo, useRef, useState } from "react";
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
import {
  AUDIENCES,
  newMaterial,
  type Audience,
  type Material,
} from "./brief/briefTypes";
import {
  buildSubmissionText,
  cleanMaterials,
  scopeOf,
  submissionFileName,
  validateBrief,
} from "./brief/exportBrief";
import { submitBrief } from "./brief/submit";

const CREATOR_EMAIL = "steven.wilen@gmail.com";

type SendState = "idle" | "sending" | "sent" | "error";

// "New Guide" = a commission brief. The creator states intent and drops their
// materials; one click sends everything (links + files) to Steven, who scopes,
// sections, and designs it with Claude.
export default function NewGuideDraft() {
  const { brief, status, doc, setBrief, save, clear } = useBrief();
  const { message: toast, show: showToast } = useToast();
  const savedTime = formatSavedTime(doc.updatedAt);

  // Actual File objects live in memory only (never localStorage). `attached`
  // mirrors which materials currently hold a file, so the UI can react.
  const filesRef = useRef<Map<string, File>>(new Map());
  const [attached, setAttached] = useState<Set<string>>(new Set());

  const [send, setSend] = useState<SendState>("idle");
  const [sendError, setSendError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const baseErrors = validateBrief(brief);
  const missingFiles = useMemo(
    () =>
      cleanMaterials(brief).filter(
        (m) => m.kind === "file" && !attached.has(m.id),
      ),
    [brief, attached],
  );
  const blockers = [
    ...baseErrors,
    ...(missingFiles.length
      ? [
          `Re-select ${missingFiles.length} file${
            missingFiles.length === 1 ? "" : "s"
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
      filesRef.current.clear();
      setAttached(new Set());
      setSend("idle");
      setSendError(null);
      setBanner("Brief cleared.");
    }
  }

  function pickFile(id: string, file: File) {
    filesRef.current.set(id, file);
    setAttached((prev) => new Set(prev).add(id));
    updateMaterial(id, { ref: file.name });
  }
  function updateMaterial(id: string, patch: Partial<Material>) {
    setBrief((b) => ({
      ...b,
      materials: b.materials.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }
  function addMaterial(kind: "link" | "file") {
    setBrief((b) => ({ ...b, materials: [...b.materials, newMaterial(kind)] }));
  }
  function removeMaterial(id: string) {
    filesRef.current.delete(id);
    setAttached((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setBrief((b) => ({
      ...b,
      materials: b.materials.filter((m) => m.id !== id),
    }));
  }

  async function handleSend() {
    if (!canSend || send === "sending") return;
    setSend("sending");
    setSendError(null);
    const files = cleanMaterials(brief)
      .filter((m) => m.kind === "file")
      .map((m) => filesRef.current.get(m.id))
      .filter((f): f is File => Boolean(f));
    const result = await submitBrief(brief, files);
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
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Materials <span className="text-red-500">*</span>
        </p>
        <p className="mt-1 mb-3 text-[11px] leading-relaxed text-slate-400">
          Drop everything you have. Prefer links (a page, Drive, Dropbox,
          YouTube) - they are read directly. For a local file, choose it and it
          is attached to the submission. Keep big media as links.
        </p>

        <div className="space-y-3">
          {brief.materials.map((m) => {
            const isAttached = attached.has(m.id);
            const needsReattach =
              m.kind === "file" && m.ref.trim() !== "" && !isAttached;
            return (
              <div
                key={m.id}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/40"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                    {m.kind === "link" ? "Link" : "File"}
                  </span>
                  {brief.materials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMaterial(m.id)}
                      className="text-xs text-slate-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {m.kind === "link" ? (
                  <TextInput
                    value={m.ref}
                    onChange={(v) => updateMaterial(m.id, { ref: v })}
                    placeholder="https://… (webpage, doc, or video URL)"
                  />
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
                      {m.ref
                        ? isAttached
                          ? "Change file"
                          : "Re-attach file"
                        : "Choose file"}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) pickFile(m.id, f);
                        }}
                      />
                    </label>
                    {m.ref && (
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {m.ref}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-2">
                  <TextInput
                    value={m.note ?? ""}
                    onChange={(v) => updateMaterial(m.id, { note: v })}
                    placeholder="Note (optional): what it is / how to use it"
                  />
                </div>

                {needsReattach && (
                  <p className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                    Re-select this file so it attaches to the submission.
                  </p>
                )}
                {m.kind === "file" && isAttached && (
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Attaches to the submission. Not uploaded anywhere else.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => addMaterial("link")}
            className="text-xs font-semibold text-accent hover:underline"
          >
            + Add link
          </button>
          <button
            type="button"
            onClick={() => addMaterial("file")}
            className="text-xs font-semibold text-accent hover:underline"
          >
            + Add file
          </button>
        </div>
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
