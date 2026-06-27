import { Link, useParams } from "react-router-dom";
import LessonNav from "../components/LessonNav";
import LessonSections from "../components/sections/LessonSections";
import StatusBadge from "../components/StatusBadge";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  FileTextIcon,
  LockIcon,
  QuizIcon,
} from "../components/icons";
import { getCourse, getLesson } from "../data/courses";
import { getQuiz } from "../data/quiz";
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
  const quiz = getQuiz(course.quizId);

  return (
    <div className="lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-8">
      {/* Desktop slim rail */}
      <aside className="hidden lg:block lg:self-start">
        <LessonNav
          course={course}
          activeLessonId={lesson.id}
          orientation="vertical"
        />
      </aside>

      <article className="min-w-0">
        {/* Mobile horizontal rail */}
        <div className="mb-6 lg:hidden">
          <LessonNav
            course={course}
            activeLessonId={lesson.id}
            orientation="horizontal"
          />
        </div>

        {/* Reader column */}
        <div className="mx-auto max-w-4xl">
          {/* Intro */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Lesson {lesson.number} of {course.lessons.length}
            </span>
            {completed && <StatusBadge kind="completed" />}
            {isPending && <StatusBadge kind="pending" />}
          </div>

          <h1 className="mt-3 text-[28px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-[34px]">
            {lesson.title}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            {lesson.summary}
          </p>

          <div className="mt-8 border-t border-slate-200 pt-8">
            {isPending ? (
              <PendingState
                note={lesson.pendingNote}
                contentNeeded={lesson.contentNeeded}
              />
            ) : (
              <>
                <LessonSections
                  sections={lesson.sections ?? []}
                  layoutVariant={lesson.layoutVariant}
                />

                {/* Mark complete (user progress -> localStorage) */}
                <div className="mt-12 flex flex-col items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {completed
                        ? "You've completed this lesson."
                        : "Finished this lesson?"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Your progress is saved on this device.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleComplete(course.id, lesson.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${
                      completed
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-accent shadow-sm hover:bg-accent-deep"
                    }`}
                  >
                    <CheckIcon className="h-4 w-4" />
                    {completed ? "Completed (undo)" : "Mark lesson complete"}
                  </button>
                </div>

                {/* After completing the lesson, point to the knowledge check. */}
                {completed && quiz && (
                  <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-blue-200/70 bg-blue-50/60 p-5 dark:border-accent/30 dark:bg-accent/10 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent ring-1 ring-inset ring-blue-200">
                        <QuizIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Test what you learned
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          Take the {quiz.title} to check your understanding.
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/quizzes/${quiz.id}`}
                      className="inline-flex shrink-0 items-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep"
                    >
                      Take the knowledge check
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Prev / Next */}
          <nav className="mt-10 grid grid-cols-1 gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2">
            {prev ? (
              <Link
                to={`/course/${course.id}/lesson/${prev.id}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-card transition hover:border-slate-300 hover:shadow-panel"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-accent">
                  <ArrowLeftIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-slate-400">Previous</span>
                  <span className="block truncate text-sm font-semibold text-slate-700 group-hover:text-accent">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" aria-hidden="true" />
            )}
            {next ? (
              <Link
                to={`/course/${course.id}/lesson/${next.id}`}
                className="group flex items-center justify-end gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-right shadow-card transition hover:border-slate-300 hover:shadow-panel"
              >
                <span className="min-w-0">
                  <span className="block text-xs text-slate-400">Next</span>
                  <span className="block truncate text-sm font-semibold text-slate-700 group-hover:text-accent">
                    {next.title}
                  </span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-accent">
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" aria-hidden="true" />
            )}
          </nav>
        </div>
      </article>
    </div>
  );
}

// Structured, honest pending state - not a blank or "coming soon" page.
function PendingState({
  note,
  contentNeeded,
}: {
  note?: string;
  contentNeeded?: string[];
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200">
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
              without changing the rest of the guide.
            </p>
          </div>
        </div>
      </div>

      {contentNeeded && contentNeeded.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <FileTextIcon className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-slate-900">
              Content needed to complete this lesson
            </h3>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Once these are provided, this lesson can be written and marked
            available.
          </p>
          <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {contentNeeded.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-slate-700"
              >
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border border-slate-300 bg-slate-50" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <p className="text-slate-600">That lesson could not be found.</p>
      <Link to="/" className="mt-3 inline-block text-sm font-medium text-accent">
        Back to library
      </Link>
    </div>
  );
}
