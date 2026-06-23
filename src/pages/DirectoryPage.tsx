import CourseCard from "../components/CourseCard";
import { courses } from "../data/courses";

export default function DirectoryPage() {
  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-medium text-accent">Robocore Guide Library</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Course Directory
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-600">
          Step-by-step setup and reference guides for Robocore hardware. Open a
          course to follow the lessons and track your progress on this device.
        </p>
      </header>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
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
