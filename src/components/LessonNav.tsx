import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Course } from "../data/types";
import { useProgress } from "../hooks/useProgress";
import { ArrowLeftIcon, CheckIcon, LockIcon } from "./icons";

// A permanent slim lesson rail - a compact utility nav, not a collapsed
// sidebar. Renders vertically (desktop) or horizontally (mobile, above the
// content). Pending lessons stay clickable and clearly muted.
type Orientation = "vertical" | "horizontal";

export default function LessonNav({
  course,
  activeLessonId,
  orientation = "vertical",
}: {
  course: Course;
  activeLessonId: string;
  orientation?: Orientation;
}) {
  const { isComplete } = useProgress();
  const vertical = orientation === "vertical";

  const divider = vertical ? "h-px w-7 bg-slate-200" : "h-7 w-px bg-slate-200";

  return (
    <nav
      aria-label="Lessons"
      className={
        vertical
          ? "flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-card"
          : "flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-card"
      }
    >
      <RailLink
        to={`/course/${course.id}`}
        label="Back to course"
        vertical={vertical}
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </RailLink>

      <span aria-hidden="true" className={divider} />

      <ul
        className={
          vertical
            ? "flex flex-col items-center gap-2"
            : "flex items-center gap-2"
        }
      >
        {course.lessons.map((lesson) => {
          const done = isComplete(course.id, lesson.id);
          const pending = lesson.contentStatus === "pending";
          const active = lesson.id === activeLessonId;

          const nodeColor = active
            ? "bg-accent text-white ring-accent"
            : done
              ? "bg-emerald-500 text-white ring-emerald-500"
              : pending
                ? "bg-slate-100 text-slate-400 ring-slate-200 hover:text-slate-600"
                : "bg-white text-slate-600 ring-slate-300 hover:text-accent hover:ring-accent/50";

          return (
            <li key={lesson.id}>
              <RailLink
                to={`/course/${course.id}/lesson/${lesson.id}`}
                label={lesson.title}
                vertical={vertical}
                node
                nodeColor={nodeColor}
              >
                {done ? (
                  <CheckIcon className="h-4 w-4" />
                ) : pending ? (
                  <LockIcon className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-[12px] font-semibold">
                    {lesson.number}
                  </span>
                )}
              </RailLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// A rail item with an accessible label and a subtle hover/focus tooltip.
function RailLink({
  to,
  label,
  vertical,
  node,
  nodeColor,
  children,
}: {
  to: string;
  label: string;
  vertical: boolean;
  node?: boolean;
  nodeColor?: string;
  children: ReactNode;
}) {
  const shape = node
    ? `rounded-full ring-1 ring-inset ${nodeColor ?? ""}`
    : "rounded-lg text-slate-400 hover:bg-slate-100 hover:text-accent";

  return (
    <Link
      to={to}
      aria-label={label}
      className={`group relative flex h-9 w-9 items-center justify-center transition ${shape}`}
    >
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-30 hidden w-max max-w-[14rem] rounded-md bg-slate-900 px-2 py-1 text-center text-xs font-medium leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100 lg:block ${
          vertical
            ? "left-full top-1/2 ml-2 -translate-y-1/2"
            : "left-1/2 top-full mt-2 -translate-x-1/2"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
