import { Link } from "react-router-dom";
import type { Lesson } from "../data/types";
import { ArrowRightIcon, CheckIcon, ClockIcon, LockIcon } from "./icons";
import StatusBadge from "./StatusBadge";

// Row in the course-overview lesson list — styled as a course module.
// Completion (a tick) is user progress; the status badge is content status.
// Three clear states: available (accent, the action), completed (emerald),
// pending (muted but intentional).
export default function LessonListItem({
  courseId,
  lesson,
  completed,
}: {
  courseId: string;
  lesson: Lesson;
  completed: boolean;
}) {
  const isPending = lesson.contentStatus === "pending";

  return (
    <Link
      to={`/course/${courseId}/lesson/${lesson.id}`}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border bg-white p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-panel sm:gap-5 sm:p-5 ${
        isPending
          ? "border-slate-200/80 hover:border-amber-300"
          : "border-slate-200/80 hover:border-accent/50"
      }`}
    >
      {/* status accent bar */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 transition-opacity ${
          completed
            ? "bg-emerald-500 opacity-100"
            : isPending
              ? "bg-amber-400 opacity-100"
              : "bg-accent opacity-0 group-hover:opacity-100"
        }`}
      />

      {/* Lesson number / completion node */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold ${
          completed
            ? "bg-emerald-500 text-white shadow-[0_2px_6px_-3px_rgba(16,185,129,0.35)]"
            : isPending
              ? "bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200"
              : "bg-accent text-white shadow-[0_2px_6px_-3px_rgba(37,99,235,0.3)]"
        }`}
      >
        {completed ? (
          <CheckIcon className="h-5 w-5" />
        ) : isPending ? (
          <LockIcon className="h-5 w-5" />
        ) : (
          lesson.number
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Lesson {lesson.number}
          </span>
          {lesson.durationLabel && !isPending && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <span className="text-slate-300">·</span>
              <ClockIcon className="h-3 w-3" />
              {lesson.durationLabel}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-accent">
          {lesson.title}
        </p>
        <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-600">
          {lesson.summary}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden sm:block">
          {completed ? (
            <StatusBadge kind="completed" />
          ) : isPending ? (
            <StatusBadge kind="pending" />
          ) : (
            <StatusBadge kind="available" />
          )}
        </div>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
            isPending
              ? "text-slate-300 group-hover:bg-amber-50 group-hover:text-amber-500"
              : "text-slate-300 group-hover:bg-blue-50 group-hover:text-accent"
          }`}
        >
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
