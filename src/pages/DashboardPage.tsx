import { Link } from "react-router-dom";
import SystemOverview from "../components/SystemOverview";
import ProgressBar from "../components/ProgressBar";
import {
  ArrowRightIcon,
  CertificateIcon,
  CheckCircleIcon,
  ClockIcon,
  QuizIcon,
} from "../components/icons";
import { courses } from "../data/courses";
import { useProgress } from "../hooks/useProgress";
import { usePersistentState } from "../hooks/usePersistentState";

type QuizScore = { score: number; total: number; date: string } | null;

export default function DashboardPage() {
  const course = courses[0];
  const lesson1 = course.lessons[0];
  const { isComplete, courseProgress } = useProgress();
  const [quizScore] = usePersistentState<QuizScore>("robocor-quiz-score", null);

  const { completed, total, percent } = courseProgress(
    course.id,
    course.lessons.length,
  );
  const lesson1Done = isComplete(course.id, lesson1.id);
  // The completion card unlocks only after both the lesson and the quiz.
  const certUnlocked = lesson1Done && !!quizScore;
  const pendingCount = course.lessons.filter(
    (l) => l.contentStatus === "pending",
  ).length;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Robocor Guide Library
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          A quick overview of the guide library. Everything here reflects the
          current state of this device — no accounts, no tracking.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current course */}
        <section className="lg:col-span-2">
          <SectionLabel>Current course</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-800/50">
            <div className="relative h-32 bg-ink-900 sm:h-40">
              {course.image && (
                <img
                  src={course.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/45 to-ink-950/10" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Active course
                </span>
                <h2 className="mt-0.5 text-xl font-semibold text-white">
                  {course.title}
                </h2>
              </div>
            </div>
            <div className="p-5">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                  <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500" />
                  Lesson 1 available — {lesson1.title}
                </li>
                <li className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                  <ClockIcon className="h-4 w-4 shrink-0 text-amber-500" />
                  Lessons 2–3 pending updated app workflow
                </li>
              </ul>
              <Link
                to={`/course/${course.id}/lesson/${lesson1.id}`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep"
              >
                {lesson1Done ? "Review Morpheus Drive" : "Continue Morpheus Drive"}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Progress */}
        <section>
          <SectionLabel>Progress</SectionLabel>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-semibold tracking-tight">
                {percent}
                <span className="text-lg text-slate-400">%</span>
              </span>
              <span className="pb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {completed} / {total} lessons
              </span>
            </div>
            <ProgressBar percent={percent} className="mt-3" />

            <dl className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 text-sm dark:border-slate-700">
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <QuizIcon className="h-4 w-4 text-slate-400" />
                  Latest quiz
                </dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100">
                  {quizScore
                    ? `${quizScore.score} / ${quizScore.total}`
                    : "Not taken"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <CertificateIcon className="h-4 w-4 text-slate-400" />
                  Completion card
                </dt>
                <dd
                  className={`font-semibold ${certUnlocked ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}
                >
                  {certUnlocked ? "Available" : "Locked"}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Progress is saved on this device only.
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionLabel>Guide library overview</SectionLabel>
          <SystemOverview />
        </div>

        <section>
          <SectionLabel>Next steps</SectionLabel>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50">
            <ol className="space-y-3 text-sm">
              <NextStep done={lesson1Done}>
                Complete the Hardware Setup lesson
              </NextStep>
              <NextStep done={!!quizScore}>
                Take the Morpheus Drive knowledge check
              </NextStep>
              <NextStep done={certUnlocked}>
                Open your local completion card
              </NextStep>
            </ol>
            <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {pendingCount} app lessons are a separate next phase, pending the
              updated app workflow. Future courses can be added later.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
      {children}
    </h2>
  );
}

function NextStep({
  done,
  children,
}: {
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
          done
            ? "bg-emerald-500 text-white"
            : "border border-slate-300 bg-white text-transparent dark:border-slate-600 dark:bg-slate-700"
        }`}
      >
        {done && <CheckCircleIcon className="h-3.5 w-3.5" />}
      </span>
      <span
        className={
          done
            ? "text-slate-400 line-through dark:text-slate-500"
            : "text-slate-700 dark:text-slate-300"
        }
      >
        {children}
      </span>
    </li>
  );
}
