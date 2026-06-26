import { useMemo, useState } from "react";
import { BuilderIcon } from "../components/icons";
import { useDraft, type SaveStatus } from "../builder/useDraft";
import { createActions } from "../builder/mutations";
import { buildExport } from "../builder/exportDraft";
import BuilderTabs, { type BuilderTab } from "../builder/components/BuilderTabs";
import CourseBasicsForm from "../builder/components/CourseBasicsForm";
import LessonEditor from "../builder/components/LessonEditor";
import ReviewDraft from "../builder/components/ReviewDraft";
import BuilderActions from "../builder/components/BuilderActions";

const STATUS_LABEL: Record<SaveStatus, string> = {
  saved: "Saved on this device",
  unsaved: "Unsaved changes",
  cleared: "Draft cleared",
};

export default function BuilderPage() {
  const { course, doc, status, setCourse, save, clear } = useDraft();
  const actions = useMemo(() => createActions(setCourse), [setCourse]);
  const [tab, setTab] = useState<BuilderTab>("basics");

  const exportDoc = useMemo(
    () =>
      buildExport(course, {
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    [course, doc.createdAt, doc.updatedAt],
  );

  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-accent dark:bg-accent/15">
            <BuilderIcon className="h-4 w-4" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Guide tools
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight dark:text-slate-100">
            Guide Builder
          </h1>
          <StatusPill status={status} />
        </div>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          Draft guide content locally, then export it for review.
        </p>
        <p className="mt-2 max-w-2xl rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
          Drafts are saved on this device. To submit a guide for review, copy or
          download the JSON and send it to steven.wilen@gmail.com. He reviews it
          and adds it to the live guide library.
        </p>
      </header>

      <div className="mt-6">
        <BuilderTabs active={tab} onChange={setTab} />
      </div>

      <div className="mt-5">
        {tab === "basics" && (
          <CourseBasicsForm course={course} actions={actions} />
        )}
        {tab === "lessons" && (
          <LessonEditor course={course} actions={actions} />
        )}
        {tab === "review" && (
          <div className="space-y-6">
            <ReviewDraft course={course} exportDoc={exportDoc} />
            <BuilderActions
              course={course}
              exportDoc={exportDoc}
              onSave={save}
              onClear={clear}
            />
          </div>
        )}
      </div>

      {/* Save controls are also available outside the Review tab for convenience. */}
      {tab !== "review" && (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={save}
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
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: SaveStatus }) {
  const tone =
    status === "saved"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : status === "cleared"
        ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
