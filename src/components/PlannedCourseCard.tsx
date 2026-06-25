import type { PlannedCourse } from "../data/types";
import { ClockIcon, LayersIcon } from "./icons";

// A planned/future course. Intentionally NOT a link — it's a non-interactive,
// dashed, muted card so the directory can show future scope honestly without
// implying the course is built or clickable.
export default function PlannedCourseCard({
  course,
}: {
  course: PlannedCourse;
}) {
  const isPending = /pending/i.test(course.status);

  return (
    <div
      aria-disabled="true"
      className="flex flex-col rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/40"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Planned guide
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-400 ring-1 ring-inset ring-slate-200">
          <LayersIcon className="h-4 w-4" />
        </span>
      </div>

      <h3 className="mt-2 text-[15px] font-semibold text-slate-700 dark:text-slate-200">
        {course.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {course.description}
      </p>

      <div className="mt-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${
            isPending
              ? "bg-amber-50 text-amber-700 ring-amber-600/20"
              : "bg-slate-100 text-slate-500 ring-slate-300"
          }`}
        >
          {isPending ? (
            <ClockIcon className="h-3.5 w-3.5" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          )}
          {course.status}
        </span>
      </div>
    </div>
  );
}
