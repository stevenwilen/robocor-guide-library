import { Link, useParams } from "react-router-dom";
import LessonNav from "../components/LessonNav";
import LessonSections from "../components/sections/LessonSections";
import StatusBadge from "../components/StatusBadge";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  LockIcon,
} from "../components/icons";
import { getCourse, getLesson } from "../data/courses";
import { useProgress } from "../hooks/useProgress";

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const course = getCourse(courseId);
  const { lesson } = getLesson(courseId, lessonId);
  const { isComplete, toggleComplete } = useProgress();

  if (!course || !lesson) {
    return <NotFound />;
  }

  const index = course.lessons.findIndex((l) => l.id === lesson.id);
  const prev = index > 0 ? course.lessons[index - 1] : undefined;
  const next =
    index < course.lessons.length - 1 ? course.lessons[index + 1] : undefined;

  const completed = isComplete(course.id, lesson.id);
  const isPending = lesson.contentStatus === "pending";

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Left rail */}
      <aside className="lg:sticky lg:top-10 lg:self-start">
        <LessonNav course={course} activeLessonId={lesson.id} />
      </aside>

      {/* Main content */}
      <article className="min-w-0">
        <div className="mb-1 flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Lesson {lesson.number} of {course.lessons.length}
          </span>
          {lesson.durationLabel && !isPending && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <ClockIcon className="h-3 w-3" />
              {lesson.durationLabel}
            </span>
          )}
          {completed && <StatusBadge kind="completed" />}
          {isPending && <StatusBadge kind="pending" />}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-600">
          {lesson.summary}
        </p>

        <div className="mt-8">
          {isPending ? (
            <PendingState note={lesson.pendingNote} />
          ) : (
            <>
              <LessonSections sections={lesson.sections ?? []} />

              {/* Mark complete (user progress -> localStorage) */}
              <div className="mt-10 flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {completed
                      ? "You've completed this lesson."
                      : "Finished this lesson?"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Your progress is saved on this device.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleComplete(course.id, lesson.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    completed
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-accent text-white hover:bg-accent-soft"
                  }`}
                >
                  <CheckIcon className="h-4 w-4" />
                  {completed ? "Completed — undo" : "Mark lesson complete"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Prev / Next */}
        <nav className="mt-10 flex items-stretch justify-between gap-4 border-t border-slate-200 pt-6">
          {prev ? (
            <Link
              to={`/course/${course.id}/lesson/${prev.id}`}
              className="group flex max-w-[48%] flex-col rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-card transition hover:border-slate-300"
            >
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <ArrowLeftIcon className="h-3 w-3" /> Previous
              </span>
              <span className="truncate text-sm font-medium text-slate-700 group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/course/${course.id}/lesson/${next.id}`}
              className="group flex max-w-[48%] flex-col rounded-lg border border-slate-200 bg-white px-4 py-3 text-right shadow-card transition hover:border-slate-300"
            >
              <span className="inline-flex items-center justify-end gap-1 text-xs text-slate-400">
                Next <ArrowRightIcon className="h-3 w-3" />
              </span>
              <span className="truncate text-sm font-medium text-slate-700 group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  );
}

// Structured, honest pending state — not a blank or "coming soon" page.
function PendingState({ note }: { note?: string }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <LockIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-amber-900">
            Pending updated app workflow
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-amber-800">
            {note ??
              "This lesson is reserved for upcoming content and can be completed once the new app flow is confirmed."}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-amber-700/90">
            The lesson structure is in place. Final content will be added here
            without changing the rest of the course.
          </p>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <p className="text-slate-600">That lesson could not be found.</p>
      <Link to="/" className="mt-3 inline-block text-sm font-medium text-accent">
        Back to library
      </Link>
    </div>
  );
}
