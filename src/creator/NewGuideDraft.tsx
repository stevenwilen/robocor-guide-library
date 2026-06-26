import { useMemo, useState } from "react";
import { useDraft, type SaveStatus } from "../builder/useDraft";
import { createActions } from "../builder/mutations";
import { buildExport } from "../builder/exportDraft";
import BuilderTabs, { type BuilderTab } from "../builder/components/BuilderTabs";
import CourseBasicsForm from "../builder/components/CourseBasicsForm";
import LessonEditor from "../builder/components/LessonEditor";
import ReviewDraft from "../builder/components/ReviewDraft";
import BuilderActions from "../builder/components/BuilderActions";
import {
  SaveIndicator,
  Toast,
  formatSavedTime,
  useToast,
} from "../components/SaveFeedback";

const STATUS_LABEL: Record<SaveStatus, string> = {
  saved: "Saved on this device",
  unsaved: "Unsaved changes",
  cleared: "Draft cleared",
  pending_approval: "Pending approval",
};

// The "New Guide Draft" flow (formerly the Guide Builder page). Rendered inside
// Creator Tools, so it has no big page header of its own.
export default function NewGuideDraft() {
  const { course, doc, status, setCourse, save, clear, markPendingApproval } =
    useDraft();
  const actions = useMemo(() => createActions(setCourse), [setCourse]);
  const [tab, setTab] = useState<BuilderTab>("basics");
  const { message: toast, show: showToast } = useToast();
  const savedTime = formatSavedTime(doc.updatedAt);

  function handleSave() {
    save();
    showToast("Draft saved locally");
  }

  const exportDoc = useMemo(
    () =>
      buildExport(course, {
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    [course, doc.createdAt, doc.updatedAt],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Draft a new guide locally, then export it for review.
        </p>
        <StatusPill status={status} />
      </div>

      <div className="mt-4">
        <BuilderTabs active={tab} onChange={setTab} />
      </div>

      <div className="mt-5">
        {tab === "basics" && (
          <CourseBasicsForm course={course} actions={actions} />
        )}
        {tab === "lessons" && <LessonEditor course={course} actions={actions} />}
        {tab === "review" && (
          <div className="space-y-6">
            <ReviewDraft course={course} exportDoc={exportDoc} />
            <BuilderActions
              course={course}
              exportDoc={exportDoc}
              onSave={handleSave}
              onClear={clear}
              onSubmitted={markPendingApproval}
              status={status}
              savedTime={savedTime}
            />
          </div>
        )}
      </div>

      {tab !== "review" && (
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={() => setTab("review")}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Go to Review and Submit
          </button>
          <span className="flex items-center pl-1">
            <SaveIndicator status={status} savedTime={savedTime} />
          </span>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}

function StatusPill({ status }: { status: SaveStatus }) {
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
      {STATUS_LABEL[status]}
    </span>
  );
}
