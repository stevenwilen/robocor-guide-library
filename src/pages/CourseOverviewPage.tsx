import { Link, useParams } from "react-router-dom";
import LessonListItem from "../components/LessonListItem";
import ProgressBar from "../components/ProgressBar";
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  InfoIcon,
  LayersIcon,
  ListChecksIcon,
  ProgressIcon,
  SignalIcon,
} from "../components/icons";
import { getCourse } from "../data/courses";
import type { Lesson } from "../data/types";
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

  const statusLine = buildStatusLine(course.lessons);

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-accent"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to library
      </Link>

      {/* Hero (compact) */}
      <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-panel">
        <div className="relative h-36 bg-ink-900 sm:h-44">
          <div className="absolute inset-0 bg-gradient-to-br from-[#172339] to-[#101a2c]" />
          <div className="dot-grid absolute inset-0 opacity-[0.10]" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
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
              <Pill icon={SignalIcon}>{course.level}</Pill>
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
            <SectionHeader icon={InfoIcon} title="About this course" />
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
              <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {course.helpsWith.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/20">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-medium leading-snug text-slate-700">
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
                    Course status:
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
        <aside className="space-y-5 lg:sticky lg:top-12 lg:self-start">
          <Card className="p-0">
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <InfoIcon className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-semibold text-slate-900">
                Course details
              </h3>
            </div>
            <dl className="divide-y divide-slate-100 px-5">
              {details.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3"
                >
                  <dt className="inline-flex items-center gap-2.5 text-sm text-slate-500">
                    <Icon className="h-4 w-4 text-slate-400" />
                    {label}
                  </dt>
                  <dd className="text-sm font-semibold text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

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
              {completed > 0 ? "Continue course" : "Start course"}
            </Link>
          </Card>
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
        className={`font-semibold text-slate-900 ${inline ? "text-base" : "text-lg"}`}
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
      <p className="text-slate-600">That course could not be found.</p>
      <Link to="/" className="mt-3 inline-block text-sm font-medium text-accent">
        Back to library
      </Link>
    </div>
  );
}
