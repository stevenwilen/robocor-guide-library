import { useEffect, useMemo, useRef, useState } from "react";
import { courses } from "../../data/courses";
import { isProvidedReference } from "../../builder/exportDraft";
import {
  NOT_CONNECTED_MESSAGE,
  submitJson,
} from "../../builder/submit";
import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  InfoIcon,
  SendIcon,
} from "../../components/icons";
import {
  Field,
  Select,
  TextArea,
  TextInput,
} from "../../builder/components/fields";
import { useUpdateRequest } from "./useUpdateRequest";
import {
  buildUpdateExport,
  updateToJSON,
  validateUpdate,
} from "./exportUpdate";
import {
  CHANGE_TYPES,
  CHANGE_TYPE_LABELS,
  GENERAL_SECTION,
  type ChangeType,
} from "./updateTypes";

type Banner = { type: "info" | "success" | "error"; text: string } | null;

export default function UpdateExistingGuide() {
  const { request, doc, status, setRequest, save, clear, markPendingApproval } =
    useUpdateRequest();

  const [banner, setBanner] = useState<Banner>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (banner) bannerRef.current?.scrollIntoView({ block: "nearest" });
  }, [banner]);

  const guide = courses.find((c) => c.id === request.guideId);
  const errors = validateUpdate(request);
  const valid = errors.length === 0;
  const exportDoc = useMemo(
    () => buildUpdateExport(request, { createdAt: doc.createdAt }),
    [request, doc.createdAt],
  );
  const json = updateToJSON(exportDoc);

  const guideOptions = [
    { value: "", label: "Select a guide…" },
    ...courses.map((c) => ({ value: c.id, label: c.title })),
  ];
  const sectionOptions = [
    { value: GENERAL_SECTION, label: "General guide-level change" },
    ...(guide?.lessons ?? []).map((l) => ({
      value: l.id,
      label: `Section ${l.number}: ${l.title}`,
    })),
  ];

  async function copyJSON() {
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setBanner({ type: "error", text: "Could not copy. Use Download JSON." });
    }
  }

  function downloadJSON() {
    if (!valid) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${request.guideId || "guide"}-update-request.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function submit() {
    if (!valid) return;
    setSubmitting(true);
    const result = await submitJson(json);
    setSubmitting(false);
    if (result.kind === "no_endpoint") {
      setBanner({ type: "info", text: NOT_CONNECTED_MESSAGE });
    } else if (result.kind === "success") {
      markPendingApproval();
      setBanner({
        type: "success",
        text: "Submitted for approval. The live guide will not change until Steven reviews and publishes the update.",
      });
    } else {
      setBanner({
        type: "error",
        text: `Could not submit (${result.message}). You can still Copy or Download the JSON and send it to Steven.`,
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Request a small change to an existing published guide. This does not
          edit the live guide.
        </p>
        <StatusPill status={status} />
      </div>

      {/* Form */}
      <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <Field label="Guide" required>
          <Select
            value={request.guideId}
            onChange={(v) =>
              setRequest((r) => ({
                ...r,
                guideId: v,
                sectionId: GENERAL_SECTION,
              }))
            }
            options={guideOptions}
          />
        </Field>

        <Field label="Section">
          <Select
            value={request.sectionId}
            onChange={(v) => setRequest((r) => ({ ...r, sectionId: v }))}
            options={sectionOptions}
          />
        </Field>

        <Field label="Change type">
          <Select<ChangeType>
            value={request.changeType}
            onChange={(v) => setRequest((r) => ({ ...r, changeType: v }))}
            options={CHANGE_TYPES}
          />
        </Field>

        <Field label="What needs to change?" required>
          <TextArea
            value={request.changeSummary}
            onChange={(v) => setRequest((r) => ({ ...r, changeSummary: v }))}
            placeholder="Describe the change you are requesting."
          />
        </Field>

        <Field
          label="Replacement content"
          hint="The new text, item, link, or details. Leave blank if not applicable."
        >
          <TextArea
            value={request.replacementContent}
            onChange={(v) =>
              setRequest((r) => ({ ...r, replacementContent: v }))
            }
            placeholder="New content for this change."
          />
        </Field>

        {request.changeType === "replace_image" && <ImageReplacement />}

        <Field label="Notes for publisher (optional)">
          <TextArea
            value={request.notesForPublisher}
            onChange={(v) =>
              setRequest((r) => ({ ...r, notesForPublisher: v }))
            }
            placeholder="Anything Steven should know when applying this."
          />
        </Field>
      </div>

      {/* Review */}
      <ReviewUpdate exportDoc={exportDoc} />

      {/* Actions */}
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

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={save}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep"
        >
          Save request
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              typeof window === "undefined" ||
              window.confirm("Clear this update request?")
            ) {
              clear();
              setBanner({ type: "info", text: "Request cleared." });
            }
          }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-200"
        >
          Clear request
        </button>
      </div>

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

  // Image replacement sub-field. Local previews are never uploaded; only
  // metadata is exported.
  function ImageReplacement() {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    useEffect(() => {
      return () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    }, [objectUrl]);

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setObjectUrl(URL.createObjectURL(file));
      setRequest((r) => ({ ...r, imageFileName: file.name }));
    }
    function handlePath(v: string) {
      if (isProvidedReference(v)) {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
        setRequest((r) => ({ ...r, imagePathOrUrl: v, imageFileName: undefined }));
      } else {
        setRequest((r) => ({ ...r, imagePathOrUrl: v }));
      }
    }

    const isHttp = /^https?:\/\//i.test(request.imagePathOrUrl.trim());
    const previewSrc = objectUrl ?? (isHttp ? request.imagePathOrUrl.trim() : null);
    const needsUpload =
      !!request.imageFileName && !isProvidedReference(request.imagePathOrUrl);

    return (
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">
        <Field
          label="Replacement image URL or path"
          hint="A public URL or an expected path like /images/foo.png."
        >
          <TextInput
            value={request.imagePathOrUrl}
            onChange={handlePath}
            placeholder="/images/foo.png"
          />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
            Choose local file
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>
          {request.imageFileName && (
            <span className="inline-flex items-center gap-2 text-xs text-slate-500">
              {request.imageFileName}
              <button
                type="button"
                onClick={() => {
                  if (objectUrl) URL.revokeObjectURL(objectUrl);
                  setObjectUrl(null);
                  setRequest((r) => ({ ...r, imageFileName: undefined }));
                }}
                className="text-slate-400 hover:text-red-600"
              >
                clear
              </button>
            </span>
          )}
        </div>
        {previewSrc && (
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <img
              src={previewSrc}
              alt="Preview"
              className="max-h-48 w-full object-cover"
            />
          </div>
        )}
        {needsUpload && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            Local preview only. Send this file with the request when submitting.
          </p>
        )}
      </div>
    );
  }
}

function ReviewUpdate({
  exportDoc,
}: {
  exportDoc: ReturnType<typeof buildUpdateExport>;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
        This is an update request. The live guide will not change until Steven
        reviews and publishes the update.
      </div>
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Review update request
        </h3>
        <dl className="mt-3 space-y-2.5 text-sm">
          <Row label="Guide">{exportDoc.guideTitle || em("Not selected")}</Row>
          <Row label="Section">{exportDoc.sectionTitle || em("None")}</Row>
          <Row label="Change type">
            {CHANGE_TYPE_LABELS[exportDoc.changeType as ChangeType] ??
              exportDoc.changeType}
          </Row>
          <Row label="What changes">
            {exportDoc.changeSummary || em("Not described")}
          </Row>
          {exportDoc.replacementContent && (
            <Row label="Replacement">{exportDoc.replacementContent}</Row>
          )}
          {exportDoc.imageReference && (
            <Row label="Image ref">{exportDoc.imageReference}</Row>
          )}
          {exportDoc.assets.length > 0 && (
            <Row label="Image file">
              {exportDoc.assets[0].fileName}{" "}
              <span className="text-xs text-amber-600">send separately</span>
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

function StatusPill({ status }: { status: string }) {
  const label =
    status === "saved"
      ? "Saved on this device"
      : status === "pending_approval"
        ? "Pending approval"
        : status === "cleared"
          ? "Request cleared"
          : "Unsaved changes";
  const tone =
    status === "saved"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : status === "pending_approval"
        ? "bg-blue-50 text-accent dark:bg-accent/15 dark:text-accent-soft"
        : status === "cleared"
          ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {label}
    </span>
  );
}
