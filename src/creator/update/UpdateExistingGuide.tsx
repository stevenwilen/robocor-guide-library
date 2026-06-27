import { useState } from "react";
import { courses } from "../../data/courses";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  DownloadIcon,
  InfoIcon,
} from "../../components/icons";
import { Field, Select, TextArea } from "../../builder/components/fields";
import {
  SaveIndicator,
  Toast,
  formatSavedTime,
  useToast,
} from "../../components/SaveFeedback";
import { submitForm } from "../formSubmit";
import { MaterialsEditor } from "../materials/MaterialsEditor";
import { useMaterialFiles } from "../materials/useMaterialFiles";
import { cleanMaterials } from "../materials/types";
import { useUpdateRequest } from "./useUpdateRequest";
import {
  buildUpdateText,
  guideTitleFor,
  sectionTitleFor,
  updateFileName,
  validateUpdate,
} from "./exportUpdate";
import {
  CHANGE_TYPES,
  CHANGE_TYPE_LABELS,
  GENERAL_SECTION,
  type ChangeType,
  type UpdateRequestDraft,
} from "./updateTypes";

const CREATOR_EMAIL = "steven.wilen@gmail.com";

type SendState = "idle" | "sending" | "sent" | "error";

export default function UpdateExistingGuide() {
  const { request, doc, status, setRequest, save, clear } = useUpdateRequest();
  const { message: toast, show: showToast } = useToast();
  const savedTime = formatSavedTime(doc.updatedAt);
  const files = useMaterialFiles();

  const [send, setSend] = useState<SendState>("idle");
  const [sendError, setSendError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const guide = courses.find((c) => c.id === request.guideId);
  const baseErrors = validateUpdate(request);
  const missing = files.missingFiles(request.materials);
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

  const guideOptions = [
    { value: "", label: "Select a guide…" },
    ...courses.map((c) => ({ value: c.id, label: c.title })),
  ];
  const sectionOptions = guide
    ? [
        { value: GENERAL_SECTION, label: "Whole guide (general change)" },
        ...guide.lessons.map((l) => ({
          value: l.id,
          label: `Section ${l.number}: ${l.title}`,
        })),
      ]
    : [{ value: GENERAL_SECTION, label: "Select a guide first" }];

  function patch(p: Partial<UpdateRequestDraft>) {
    setRequest((r) => ({ ...r, ...p }));
  }

  function handleSave() {
    save();
    showToast("Update request saved locally");
  }
  function handleClear() {
    if (
      typeof window === "undefined" ||
      window.confirm("Clear this update request?")
    ) {
      clear();
      files.resetFiles();
      setSend("idle");
      setSendError(null);
      setBanner("Request cleared.");
    }
  }

  async function handleSend() {
    if (!canSend || send === "sending") return;
    setSend("sending");
    setSendError(null);
    const result = await submitForm({
      subject: `Guide update: ${guideTitleFor(request.guideId) || request.guideId || "guide"}`,
      message: buildUpdateText(request),
      files: files.collectFiles(request.materials),
    });
    if (result.ok) {
      setSend("sent");
      save();
    } else {
      setSend("error");
      setSendError(result.error ?? "Something went wrong.");
    }
  }

  function downloadFallback() {
    const blob = new Blob([buildUpdateText(request)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = updateFileName(request);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Request a small change to an existing published guide. The admin
          reviews and applies it; the live guide changes only after that.
        </p>
        <SaveIndicator status={status} savedTime={savedTime} />
      </div>

      {/* Basics */}
      <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <Field label="Guide" required>
          <Select
            value={request.guideId}
            onChange={(v) => patch({ guideId: v, sectionId: GENERAL_SECTION })}
            options={guideOptions}
          />
        </Field>

        <Field
          label="Section"
          hint="Which part of the guide. Pick the whole guide for a general change."
        >
          <Select
            value={request.sectionId}
            onChange={(v) => patch({ sectionId: v })}
            options={sectionOptions}
            disabled={!guide}
          />
        </Field>

        <Field label="Change type">
          <Select<ChangeType>
            value={request.changeType}
            onChange={(v) => patch({ changeType: v })}
            options={CHANGE_TYPES}
          />
        </Field>

        <Field label="What needs to change?" required>
          <TextArea
            value={request.changeSummary}
            onChange={(v) => patch({ changeSummary: v })}
            placeholder="Describe the change you are requesting."
          />
        </Field>
      </div>

      {/* New material */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <MaterialsEditor
          materials={request.materials}
          onChange={(materials) => patch({ materials })}
          attached={files.attached}
          onPick={files.pickFile}
          onDrop={files.dropFile}
          label="New material"
          description="Optional. Add a link or attach a file for this change - a new image, a video URL, a doc. Leave empty for a text-only change."
        />
      </div>

      {/* Notes */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <Field label="Notes for admin (optional)">
          <TextArea
            value={request.notesForAdmin}
            onChange={(v) => patch({ notesForAdmin: v })}
            placeholder="Anything the admin should know when applying this."
          />
        </Field>
      </div>

      {/* Review */}
      <ReviewUpdate request={request} />

      {/* Blockers */}
      {blockers.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-900/20">
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Complete the request before sending:
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
          Save request
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-200"
        >
          Clear request
        </button>
      </div>

      {/* Send */}
      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          One click sends the request and any attached files to the admin.
          Nothing changes on the live guide automatically.
        </p>

        {send === "sent" ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100">
            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="leading-relaxed">
              Request sent to the admin. They will review it and apply the change.
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend || send === "sending"}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {send === "sending" ? "Sending…" : "Send request to admin"}
            {send !== "sending" && <ArrowRightIcon className="h-4 w-4" />}
          </button>
        )}

        {send === "error" && (
          <div className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-900/20 dark:text-red-100">
            <p className="leading-relaxed">
              {sendError} You can try again, or download a copy and{" "}
              <a
                href={`mailto:${CREATOR_EMAIL}?subject=Guide update request`}
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

function ReviewUpdate({ request }: { request: UpdateRequestDraft }) {
  const guideTitle = guideTitleFor(request.guideId);
  const sectionTitle = sectionTitleFor(request.guideId, request.sectionId);
  const materials = cleanMaterials(request.materials);
  const links = materials.filter((m) => m.kind === "link").length;
  const fileCount = materials.filter((m) => m.kind === "file").length;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
        This is an update request. The live guide will not change until the admin
        reviews and applies it.
      </div>
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Review update request
        </h3>
        <dl className="mt-3 space-y-2.5 text-sm">
          <Row label="Guide">{guideTitle || em("Not selected")}</Row>
          <Row label="Section">{sectionTitle || em("None")}</Row>
          <Row label="Change type">
            {CHANGE_TYPE_LABELS[request.changeType]}
          </Row>
          <Row label="What changes">
            {request.changeSummary.trim() || em("Not described")}
          </Row>
          {materials.length > 0 && (
            <Row label="New material">
              {[
                links ? `${links} link${links === 1 ? "" : "s"}` : null,
                fileCount ? `${fileCount} file${fileCount === 1 ? "" : "s"}` : null,
              ]
                .filter(Boolean)
                .join(", ")}
            </Row>
          )}
        </dl>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="w-28 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 break-words text-slate-700 dark:text-slate-200">
        {children}
      </dd>
    </div>
  );
}

function em(text: string) {
  return <span className="text-slate-400">{text}</span>;
}
