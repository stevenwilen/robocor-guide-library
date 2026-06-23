import { Link } from "react-router-dom";
import type { Course } from "../data/types";
import { useProgress } from "../hooks/useProgress";
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HelpIcon,
  LockIcon,
} from "./icons";
import ProgressBar from "./ProgressBar";

// Lesson-page navigation. Renders three ways:
//  - collapsed: a narrow rail of lesson nodes (desktop, space-saving)
//  - expanded: full lesson list + progress + help (desktop)
//  - drawer:   expanded content without the collapse toggle (mobile overlay)
type Props = {
  course: Course;
  activeLessonId: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  showCollapseToggle?: boolean;
};

export default function LessonNav({
  course,
  activeLessonId,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  showCollapseToggle = true,
}: Props) {
  const { isComplete, courseProgress } = useProgress();
  const { completed, total, percent } = courseProgress(
    course.id,
    course.lessons.length,
  );

  // --- Collapsed rail ------------------------------------------------------
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Expand lessons"
          aria-label="Expand lessons"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-accent"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>

        <div className="h-px w-8 bg-slate-200" />

        <ul className="flex flex-col items-center gap-2">
          {course.lessons.map((lesson) => {
            const done = isComplete(course.id, lesson.id);
            const pending = lesson.contentStatus === "pending";
            const active = lesson.id === activeLessonId;
            return (
              <li key={lesson.id}>
                <Link
                  to={`/course/${course.id}/lesson/${lesson.id}`}
                  title={`Lesson ${lesson.number}: ${lesson.title}${pending ? " — pending" : ""}`}
                  aria-label={`Lesson ${lesson.number}: ${lesson.title}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold transition ${
                    active
                      ? "bg-accent text-white"
                      : done
                        ? "bg-emerald-500 text-white"
                        : pending
                          ? "bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200"
                          : "bg-white text-slate-500 ring-1 ring-inset ring-slate-300 hover:text-accent hover:ring-accent/40"
                  }`}
                >
                  {done ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : pending ? (
                    <LockIcon className="h-3.5 w-3.5" />
                  ) : (
                    lesson.number
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="h-px w-8 bg-slate-200" />
        <div
          title={`Course progress: ${percent}%`}
          className="text-[11px] font-semibold text-slate-400"
        >
          {completed}/{total}
        </div>
      </div>
    );
  }

  // --- Expanded (desktop) / drawer (mobile) --------------------------------
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <Link
          to={`/course/${course.id}`}
          onClick={onNavigate}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-accent"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to course
        </Link>
        {showCollapseToggle && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Collapse lessons"
            aria-label="Collapse lessons"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-accent"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div>
        <h2 className="px-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {course.title}
        </h2>
        <ul className="mt-3 space-y-1">
          {course.lessons.map((lesson, i) => {
            const done = isComplete(course.id, lesson.id);
            const pending = lesson.contentStatus === "pending";
            const active = lesson.id === activeLessonId;
            const isLast = i === course.lessons.length - 1;
            return (
              <li key={lesson.id} className="relative">
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[19px] top-9 h-[calc(100%-1.25rem)] w-px bg-slate-200"
                  />
                )}
                <Link
                  to={`/course/${course.id}/lesson/${lesson.id}`}
                  onClick={onNavigate}
                  className={`relative flex items-start gap-3 rounded-lg px-2.5 py-2 text-sm transition ${
                    active
                      ? "bg-blue-50 text-accent ring-1 ring-inset ring-blue-600/15"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span
                    className={`z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      done
                        ? "bg-emerald-500 text-white"
                        : pending
                          ? "bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200"
                          : active
                            ? "bg-accent text-white"
                            : "bg-white text-slate-500 ring-1 ring-inset ring-slate-300"
                    }`}
                  >
                    {done ? (
                      <CheckIcon className="h-3 w-3" />
                    ) : pending ? (
                      <LockIcon className="h-3 w-3" />
                    ) : (
                      lesson.number
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium leading-snug">
                      {lesson.title}
                    </span>
                    {pending && (
                      <span className="text-[11px] text-amber-600">
                        Pending updated app workflow
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">Course progress</span>
          <span className="font-medium text-slate-500">
            {completed}/{total}
          </span>
        </div>
        <ProgressBar percent={percent} />
        <p className="mt-2 text-[11px] text-slate-400">
          Saved on this device only.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <HelpIcon className="h-4 w-4 text-slate-400" />
          Need help?
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Reach out to your Robocor contact for setup support.
        </p>
      </div>
    </div>
  );
}
