import { Link, useParams } from "react-router-dom";
import LessonListItem from "../components/LessonListItem";
import ProgressBar from "../components/ProgressBar";
import {
  ArrowLeftIcon,
  ClockIcon,
  LayersIcon,
  SignalIcon,
} from "../components/icons";
import { getCourse } from "../data/courses";
import { useProgress } from "../hooks/useProgress";

export default function CourseOverviewPage() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const { isComplete, courseProgress } = useProgress();

  if (!course) {
    return <NotFound />;
  }

  const { completed, total, percent } = courseProgress(
    course.id,
    course.lessons.length,
  );

  const details = [
    { icon: SignalIcon, label: "Level", value: course.level },
    { icon: ClockIcon, label: "Duration", value: course.durationLabel },
    {
      icon: LayersIcon,
      label: "Lessons",
      value: String(course.lessons.length),
    },
  ];

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-accent"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to library
      </Link>

      {/* Hero */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
        <div className="relative h-40 bg-gradient-to-br from-ink-800 to-ink-600 sm:h-48">
          <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            {course.heroEyebrow && (
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                {course.heroEyebrow}
              </span>
            )}
            <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
              {course.title}
            </h1>
            <p className="mt-1 text-sm text-white/80">{course.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              About this course
            </h2>
            <div className="space-y-3">
              {course.about.map((para, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-slate-600">
                  {para}
                </p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              Lessons
            </h2>
            <div className="space-y-3">
              {course.lessons.map((lesson) => (
                <LessonListItem
                  key={lesson.id}
                  courseId={course.id}
                  lesson={lesson}
                  completed={isComplete(course.id, lesson.id)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar column */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="text-sm font-semibold text-slate-900">
              Course details
            </h3>
            <dl className="mt-4 space-y-3">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <dt className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <Icon className="h-4 w-4 text-slate-400" />
                    {label}
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Your progress
              </h3>
              <span className="text-sm text-slate-500">{percent}%</span>
            </div>
            <ProgressBar percent={percent} />
            <p className="mt-2 text-xs text-slate-500">
              {completed} of {total} lessons completed. Saved on this device only.
            </p>
            <Link
              to={`/course/${course.id}/lesson/${course.lessons[0].id}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-soft"
            >
              {completed > 0 ? "Continue course" : "Start course"}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <p className="text-slate-600">That course could not be found.</p>
      <Link to="/" className="mt-3 inline-block text-sm font-medium text-accent">
        Back to library
      </Link>
    </div>
  );
}
