import { Link, useParams } from "react-router-dom";
import LessonListItem from "../components/LessonListItem";
import ProgressBar from "../components/ProgressBar";
import {
  ArrowLeftIcon,
  AudienceIcon,
  CheckIcon,
  ClockIcon,
  InfoIcon,
  LayersIcon,
  ListChecksIcon,
  ProgressIcon,
  QuizIcon,
} from "../components/icons";
import { getCourse } from "../data/courses";
import { getQuiz } from "../data/quiz";
import type { Lesson } from "../data/types";
import { useProgress } from "../hooks/useProgress";
import { usePersistentState } from "../hooks/usePersistentState";
import { useRecordLastOpened } from "../hooks/useRecordLastOpened";
import { quizScoreKey, type QuizScore } from "../data/storageKeys";

export default function CourseOverviewPage() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const { isComplete, courseProgress } = useProgress();
  const [quizScore] = usePersistentState<QuizScore>(
    course?.quizId ? quizScoreKey(course.quizId) : "robocor-quiz-score:none",
    null,
  );
  useRecordLastOpened(course?.id);

  if (!course) {
    return <NotFound />;
  }

  const quiz = getQuiz(course.quizId);

  const { completed, total, percent } = courseProgress(
    course.id,
    course.lessons.length,
  );


  const statusLine = buildStatusLine(course.lessons);

  return (
    <div>
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-accent dark:text-slate-400"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to guides
      </Link>

      {/* Hero */}
      <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-panel">
        <div className="relative h-48 bg-ink-900 sm:h-64">
          {course.image ? (
            <>
              <img
                src={course.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              {/* Calm readability overlays - darkens toward the bottom where
                  the title and badges sit. */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/55 to-ink-950/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950/65 via-ink-950/10 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#172339] to-[#101a2c]" />
              <div className="dot-grid absolute inset-0 opacity-[0.10]" />
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
            </>
          )}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            {course.heroEyebrow && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">
                {course.heroEyebrow}
              </span>
            )}
            <h1 className="mt-1 text-[26px] font-semibold leading-tight text-white sm:text-[32px]">
              {course.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill icon={AudienceIcon}>{course.audience}</Pill>
              <Pill icon={ClockIcon}>{course.durationLabel}</Pill>
              <Pill icon={LayersIcon}>{course.lessons.length} lessons</Pill>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <SectionHeader icon={InfoIcon} title="About this guide" />
            <div className="mt-4 space-y-3">
              {course.about.map((para, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-[1.7] text-slate-700"
                >
                  {para}
                </p>
              ))}
            </div>
          </Card>

          {course.helpsWith && course.helpsWith.length > 0 && (
            <Card>
              <SectionHeader
                icon={ListChecksIcon}
                title="What this guide helps with"
              />
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {course.helpsWith.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/20">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 text-sm font-medium leading-snug text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div>
            <div className="mb-3 flex items-center justify-between px-1">
              <SectionHeader icon={LayersIcon} title="Lessons" inline />
              <span className="text-sm font-medium text-slate-500">
                {completed} of {total} completed
              </span>
            </div>

            {statusLine && (
              <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5">
                <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p className="text-[13px] leading-snug text-slate-600">
                  <span className="font-semibold text-slate-700">
                    Guide status:
                  </span>{" "}
                  {statusLine}
                </p>
              </div>
            )}

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
          </div>
        </div>

        {/* Sidebar column */}
        <aside className="space-y-5 lg:self-start">
          {/* The hero already shows audience / duration / lessons, so the
              sidebar uses its space for practical prep instead of repeating it. */}
          {course.beforeYouStart && course.beforeYouStart.length > 0 && (
            <Card className="p-0">
              <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-accent">
                  <ListChecksIcon className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                  Before you start
                </h3>
              </div>
              <ul className="space-y-2.5 px-5 py-4">
                {course.beforeYouStart.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-accent">
                <ProgressIcon className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-semibold text-slate-900">
                Your progress
              </h3>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-semibold tracking-tight text-slate-900">
                {percent}
                <span className="text-lg text-slate-400">%</span>
              </span>
              <span className="pb-1 text-xs font-medium text-slate-500">
                {completed} / {total} lessons
              </span>
            </div>
            <ProgressBar percent={percent} className="mt-3" />
            <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
              Completion is saved on this device only.
            </p>
            <Link
              to={`/course/${course.id}/lesson/${course.lessons[0].id}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep"
            >
              {completed > 0 ? "Continue guide" : "Start guide"}
            </Link>
          </Card>

          {quiz && (
            <Card>
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-accent">
                  <QuizIcon className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                  Knowledge check
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                A short quiz on what this guide covers so far.
              </p>
              {quizScore && (
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Latest score: {quizScore.score} / {quizScore.total}
                </p>
              )}
              <Link
                to={`/quizzes/${course.quizId}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-accent/30 bg-white px-4 py-2.5 text-sm font-semibold text-accent transition hover:bg-blue-50"
              >
                {quizScore ? "Retake the knowledge check" : "Take the knowledge check"}
              </Link>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

// Builds e.g. "Lesson 1 available · Lessons 2-3 pending updated app workflow"
function buildStatusLine(lessons: Lesson[]): string {
  const available = lessons
    .filter((l) => l.contentStatus === "available")
    .map((l) => l.number);
  const pending = lessons
    .filter((l) => l.contentStatus === "pending")
    .map((l) => l.number);

  const parts: string[] = [];
  if (available.length) parts.push(`${formatRange(available)} available`);
  if (pending.length)
    parts.push(`${formatRange(pending)} pending updated app workflow`);
  return parts.join(" · ");
}

function formatRange(nums: number[]): string {
  const sorted = [...nums].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i];
      continue;
    }
    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
    start = prev = sorted[i];
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  const noun = nums.length === 1 ? "Lesson" : "Lessons";
  return `${noun} ${ranges.join(", ")}`;
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  inline,
}: {
  icon: (p: { className?: string }) => JSX.Element;
  title: string;
  inline?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex items-center justify-center rounded-lg bg-blue-50 text-accent ${
          inline ? "h-6 w-6" : "h-7 w-7"
        }`}
      >
        <Icon className={inline ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </span>
      <h2
        className={`font-semibold text-slate-900 ${inline ? "text-base dark:text-slate-100" : "text-lg"}`}
      >
        {title}
      </h2>
    </div>
  );
}

function Pill({
  icon: Icon,
  children,
}: {
  icon: (p: { className?: string }) => JSX.Element;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/15 backdrop-blur">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function NotFound() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <p className="text-slate-600">That guide could not be found.</p>
      <Link to="/" className="mt-3 inline-block text-sm font-medium text-accent">
        Back to library
      </Link>
    </div>
  );
}
