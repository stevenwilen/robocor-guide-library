import { BLOCK_LABELS, type CourseDraft, type DraftBlock } from "../draftTypes";
import type { CourseDraftExport } from "../exportDraft";

// Structured summary of the draft — deliberately NOT the polished course.
export default function ReviewDraft({
  course,
  exportDoc,
}: {
  course: CourseDraft;
  exportDoc: CourseDraftExport;
}) {
  const assets = exportDoc.assets;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
        This is a structured draft preview. The final published course may be
        redesigned and polished before it goes live.
      </div>

      {/* Course summary */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Course
        </h3>
        <dl className="mt-3 space-y-2.5 text-sm">
          <Row label="Title">{course.title || em("Not set")}</Row>
          <Row label="Description">{course.description || em("Not set")}</Row>
          <Row label="Audience">{course.audience}</Row>
          <Row label="Goal">{course.goal || em("Not set")}</Row>
          <Row label="Status">{course.status}</Row>
          <Row label="Banner">
            {course.bannerImage?.trim() || em("None")}
          </Row>
        </dl>
      </section>

      {/* Lessons */}
      <section className="space-y-4">
        {course.lessons.map((lesson, li) => (
          <div
            key={lesson.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Lesson {li + 1}: {lesson.title || em("Untitled")}
              </h4>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  lesson.status === "available"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                }`}
              >
                {lesson.status}
              </span>
            </div>
            {lesson.goal && (
              <p className="mt-1 text-xs text-slate-500">{lesson.goal}</p>
            )}

            {lesson.status === "pending" ? (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                Pending note: {lesson.pendingNote?.trim() || em("Missing")}
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

      {/* Missing assets */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Missing assets
        </h3>
        {assets.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            No image files need to be supplied.
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5 text-sm">
            {assets.map((a, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {a.fileName || a.intendedPath}
                <span className="text-xs text-amber-600">needs file</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function blockSummary(block: DraftBlock): string {
  switch (block.type) {
    case "heading":
      return block.text;
    case "paragraph":
      return [block.heading, block.text].filter(Boolean).join(" — ");
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
      return `${block.tone}${block.title ? ` — ${block.title}` : ""}`;
    case "divider":
      return "—";
    case "pendingNote":
      return block.text;
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
