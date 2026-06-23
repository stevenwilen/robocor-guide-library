import { Link } from "react-router-dom";
import type { Lesson } from "../data/types";
import { CheckIcon, ClockIcon, LockIcon } from "./icons";
import StatusBadge from "./StatusBadge";

// Row in the course-overview lesson list.
// Shows the user's completion (a tick) and the content status badge separately.
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
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-card transition hover:border-slate-300 hover:shadow-panel"
    >
      {/* Completion indicator (user progress) */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          completed
            ? "bg-emerald-500 text-white"
            : isPending
              ? "bg-slate-100 text-slate-400"
              : "bg-blue-50 text-accent ring-1 ring-inset ring-blue-600/20"
        }`}
      >
        {completed ? (
          <CheckIcon className="h-4 w-4" />
        ) : isPending ? (
          <LockIcon className="h-4 w-4" />
        ) : (
          lesson.number
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Lesson {lesson.number}
          </span>
          {lesson.durationLabel && !isPending && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <ClockIcon className="h-3 w-3" />
              {lesson.durationLabel}
            </span>
          )}
        </div>
        <p className="truncate text-sm font-medium text-slate-900">
          {lesson.title}
        </p>
        <p className="truncate text-xs text-slate-500">{lesson.summary}</p>
      </div>

      <div className="hidden shrink-0 sm:block">
        {completed ? (
          <StatusBadge kind="completed" />
        ) : isPending ? (
          <StatusBadge kind="pending" />
        ) : (
          <StatusBadge kind="available" />
        )}
      </div>
    </Link>
  );
}
