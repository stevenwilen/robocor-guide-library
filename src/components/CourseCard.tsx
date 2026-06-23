import { Link } from "react-router-dom";
import type { Course } from "../data/types";
import { useProgress } from "../hooks/useProgress";
import { ClockIcon, LayersIcon, SignalIcon } from "./icons";
import ProgressBar from "./ProgressBar";

export default function CourseCard({ course }: { course: Course }) {
  const { courseProgress } = useProgress();
  const { completed, total, percent } = courseProgress(
    course.id,
    course.lessons.length,
  );

  return (
    <Link
      to={`/course/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-panel"
    >
      {/* Cover */}
      <div className="relative h-36 bg-gradient-to-br from-ink-800 to-ink-600">
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur">
            {course.level}
          </span>
          <span className="text-xs font-medium text-white/80">
            {completed}/{total} lessons
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-accent">
          {course.title}
        </h3>
        <p className="mt-1 text-sm text-slate-600">{course.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <SignalIcon className="h-4 w-4" />
            {course.level}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" />
            {course.durationLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LayersIcon className="h-4 w-4" />
            {course.lessons.length} lessons
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Your progress</span>
            <span className="text-slate-500">{percent}%</span>
          </div>
          <ProgressBar percent={percent} />
        </div>
      </div>
    </Link>
  );
}
