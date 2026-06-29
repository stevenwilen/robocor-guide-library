import CourseCard from "../components/CourseCard";
import PlannedCourseCard from "../components/PlannedCourseCard";
import { PlusCircleIcon } from "../components/icons";
import { courses, plannedCourses } from "../data/courses";

export default function DirectoryPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Robocor Guide Library
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight dark:text-slate-100 sm:text-[34px]">
          Guides
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-400">
          Step-by-step setup and reference guides for Robocor hardware. Open a
          guide to follow it and track your progress on this device.
        </p>
      </header>

      {/* Active guides */}
      <section>
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Active guides
          </h2>
          <span className="text-sm text-slate-400">
            {courses.length} {courses.length === 1 ? "guide" : "guides"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Planned / future courses */}
      {plannedCourses.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PlusCircleIcon className="h-4 w-4 text-slate-400" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Ready for future guides
              </h2>
            </div>
            <span className="text-sm text-slate-400">
              {plannedCourses.length} planned
            </span>
          </div>

          <p className="mb-4 max-w-2xl text-sm text-slate-500">
            The library can grow over time. These are planned guides. They aren't
            built yet, and they're listed here to show what can be added later.
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {plannedCourses.map((course) => (
              <PlannedCourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
