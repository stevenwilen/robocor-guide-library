import { BLOCK_LABELS, type CourseDraft, type DraftBlock } from "../draftTypes";
import type { GuideDraftExport } from "../exportDraft";

const READER_LABELS: Record<string, string> = {
  interns: "Interns",
  students: "Students",
  staff: "Staff",
  customers: "Customers",
  other: "Other",
};

// Structured summary of the guide draft - deliberately NOT the polished guide.
export default function ReviewDraft({
  course,
  exportDoc,
}: {
  course: CourseDraft;
  exportDoc: GuideDraftExport;
}) {
  const assets = exportDoc.assets;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
        This is a structured guide draft. The final published guide may be
        redesigned and polished before it goes live.
      </div>

      {/* Guide summary */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Guide
        </h3>
        <dl className="mt-3 space-y-2.5 text-sm">
          <Row label="Title">{course.title || em("Not set")}</Row>
          <Row label="Description">{course.description || em("Not set")}</Row>
          <Row label="Intended reader">
            {READER_LABELS[course.audience] ?? course.audience}
          </Row>
          <Row label="Banner">
            {course.bannerImage?.trim() || em("None")}
          </Row>
        </dl>
      </section>

      {/* Sections */}
      <section className="space-y-4">
        {course.lessons.map((lesson, li) => (
          <div
            key={lesson.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Section {li + 1}: {lesson.title || em("Untitled")}
              </h4>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  lesson.status === "available"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                }`}
              >
                {lesson.status === "available" ? "Ready" : "Needs info"}
              </span>
            </div>
            {lesson.description && (
              <p className="mt-1 text-xs text-slate-500">{lesson.description}</p>
            )}

            {lesson.status === "pending" ? (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                Information still needed:{" "}
                {lesson.pendingNote?.trim() || em("Missing")}
              </p>
            ) : (
              <ol className="mt-3 space-y-2">
                {lesson.blocks.length === 0 && (
                  <li className="text-xs text-slate-400">No content blocks.</li>
                )}
                {lesson.blocks.map((block, bi) => (
                  <li
                    key={block.id}
                    className="flex gap-3 rounded-lg border border-slate-200/70 bg-slate-50/60 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800/40"
                  >
                    <span className="shrink-0 font-mono text-slate-400">
                      {bi + 1}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {BLOCK_LABELS[block.type]}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-slate-500">
                      {blockSummary(block)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </section>

      {/* Local image files to send separately, only shown when applicable. */}
      {assets.length > 0 && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Image files to send separately
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            These were added as local files, so send them with the JSON.
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {assets.map((a, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {a.fileName || a.intendedPath}
                <span className="text-xs text-amber-600">needs file</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Notes for publishing */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Notes for publishing
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          {exportDoc.notesForPublisher.map((note, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
              <span className="leading-relaxed">{note}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function blockSummary(block: DraftBlock): string {
  switch (block.type) {
    case "paragraph":
      return [block.heading, block.text].filter(Boolean).join(": ");
    case "video":
      return block.youtube || "(no video set)";
    case "image":
      return (
        block.image.fileName ||
        block.image.pathOrUrl ||
        "(no image reference)"
      );
    case "gallery":
      return `${block.images.length} image(s)`;
    case "checklist":
      return `${block.items.filter((i) => i.trim()).length} item(s)`;
    case "keyNotes":
      return `${block.notes.filter((n) => n.trim()).length} note(s)`;
    case "callout":
      return `${block.tone}${block.title ? `: ${block.title}` : ""}`;
    default:
      return "";
  }
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
