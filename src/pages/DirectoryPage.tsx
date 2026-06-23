import CourseCard from "../components/CourseCard";
import PlannedCourseCard from "../components/PlannedCourseCard";
import SystemOverview from "../components/SystemOverview";
import { PlusCircleIcon } from "../components/icons";
import { courses, plannedCourses } from "../data/courses";

export default function DirectoryPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Robocor Guide Library
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-[34px]">
          Course Directory
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
          Step-by-step setup and reference guides for Robocor hardware. Open a
          course to follow the lessons and track your progress on this device.
        </p>
      </header>

      {/* Active courses */}
      <section>
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Active courses
          </h2>
          <span className="text-sm text-slate-400">
            {courses.length} {courses.length === 1 ? "course" : "courses"}
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Planned / future courses */}
      {plannedCourses.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <PlusCircleIcon className="h-4 w-4 text-slate-400" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Ready for future courses
              </h2>
            </div>
            <span className="text-sm text-slate-400">
              {plannedCourses.length} planned
            </span>
          </div>

          <p className="mb-4 max-w-2xl text-sm text-slate-500">
            The library is structured to grow. These are planned courses — not
            yet built, and shown here only to outline what can be added over
            time.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {plannedCourses.map((course) => (
              <PlannedCourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      <SystemOverview />
    </div>
  );
}
