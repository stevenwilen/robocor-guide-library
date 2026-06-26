import { Link } from "react-router-dom";
import type { Course } from "../data/types";
import { useProgress } from "../hooks/useProgress";
import { ArrowRightIcon, AudienceIcon, ClockIcon, LayersIcon } from "./icons";
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lift dark:border-slate-800 dark:bg-slate-800/50"
    >
      {/* Cover */}
      <div className="relative h-40 overflow-hidden bg-ink-900">
        {course.image ? (
          <>
            <img
              src={course.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/35 to-ink-950/5" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#172339] to-[#101a2c]" />
            <div className="dot-grid absolute inset-0 opacity-[0.10]" />
            {/* subtle accent depth */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
          </>
        )}
        <div className="absolute inset-x-5 bottom-4 flex items-end justify-between">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white ring-1 ring-inset ring-white/15 backdrop-blur">
            {course.audience}
          </span>
          <span className="text-xs font-medium text-white/70">
            {completed}/{total} lessons
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-semibold text-slate-900 transition-colors group-hover:text-accent dark:text-slate-100">
            {course.title}
          </h3>
          <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {course.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <AudienceIcon className="h-4 w-4 text-slate-400" />
            {course.audience}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 text-slate-400" />
            {course.durationLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LayersIcon className="h-4 w-4 text-slate-400" />
            {course.lessons.length} lessons
          </span>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-700">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Your progress
            </span>
            <span className="font-medium text-slate-500">{percent}%</span>
          </div>
          <ProgressBar percent={percent} />
        </div>
      </div>
    </Link>
  );
}
