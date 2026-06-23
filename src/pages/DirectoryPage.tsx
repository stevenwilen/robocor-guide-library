import CourseCard from "../components/CourseCard";
import { courses } from "../data/courses";

export default function DirectoryPage() {
  return (
    <div>
      <header className="mb-9 max-w-2xl">
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

      <section>
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            All courses
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
    </div>
  );
}
