import { Link } from "react-router-dom";
import SystemOverview from "../components/SystemOverview";
import ProgressBar from "../components/ProgressBar";
import {
  ArrowRightIcon,
  CertificateIcon,
  CheckCircleIcon,
  CourseIcon,
  QuizIcon,
} from "../components/icons";
import { courses } from "../data/courses";
import type { Course } from "../data/types";
import { getCertificatesForCourse } from "../data/certificates";
import { useProgress } from "../hooks/useProgress";
import { usePersistentState } from "../hooks/usePersistentState";
import {
  LAST_OPENED_GUIDE,
  quizScoreKey,
  type LastOpenedGuide,
  type QuizScore,
} from "../data/storageKeys";

export default function DashboardPage() {
  // Real continuation: the guide the learner last opened on this device. No
  // hardcoded "current" guide, and no pretending one is active before they
  // open it.
  const [lastOpened] = usePersistentState<LastOpenedGuide>(
    LAST_OPENED_GUIDE,
    null,
  );
  const activeGuide = lastOpened?.id
    ? (courses.find((c) => c.id === lastOpened.id) ?? null)
    : null;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Robocor Guide Library
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight dark:text-slate-100">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          A quick overview of the guide library. Everything here reflects the
          current state of this device. No accounts, no tracking.
        </p>
      </header>

      {activeGuide ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <SectionLabel>Continue learning</SectionLabel>
            <ContinueCard guide={activeGuide} />
          </section>
          <section className="flex flex-col">
            <SectionLabel>This guide</SectionLabel>
            <SideStats guide={activeGuide} />
          </section>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <SectionLabel>Continue learning</SectionLabel>
            <EmptyContinue />
          </section>
          {/* Right column (progress / this-guide) intentionally left empty
              until a guide is opened. */}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <SectionLabel>Guide library overview</SectionLabel>
          <SystemOverview />
        </section>
        {activeGuide && (
          <section className="flex flex-col">
            <SectionLabel>Next steps</SectionLabel>
            <NextSteps guide={activeGuide} />
          </section>
        )}
      </div>
    </div>
  );
}

function NextSteps({ guide }: { guide: Course }) {
  const { isComplete } = useProgress();
  const [quizScore] = usePersistentState<QuizScore>(
    guide.quizId ? quizScoreKey(guide.quizId) : `robocor-quiz-noquiz:${guide.id}`,
    null,
  );

  const available = guide.lessons.filter((l) => l.contentStatus === "available");
  const pending = guide.lessons.filter((l) => l.contentStatus === "pending");
  const firstLesson = available[0];
  const firstDone = firstLesson ? isComplete(guide.id, firstLesson.id) : false;

  const cert = getCertificatesForCourse(guide.id)[0];
  const certUnlocked = cert
    ? cert.requiredLessonIds.every((id) => isComplete(guide.id, id)) &&
      (cert.requiresQuiz ? !!quizScore : true)
    : false;

  return (
    <div className="flex h-full flex-1 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50">
      <ol className="space-y-3 text-sm">
        {firstLesson && (
          <NextStep done={firstDone}>Complete {firstLesson.title}</NextStep>
        )}
        {guide.quizId && (
          <NextStep done={!!quizScore}>Take the knowledge check</NextStep>
        )}
        {cert && (
          <NextStep done={certUnlocked}>Open your completion card</NextStep>
        )}
      </ol>
      {pending.length > 0 && (
        <p className="mt-auto border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {pending.length} {pending.length === 1 ? "lesson is" : "lessons are"}{" "}
          pending the updated app workflow.
        </p>
      )}
    </div>
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

function ContinueCard({ guide }: { guide: Course }) {
  const { isComplete, courseProgress } = useProgress();
  const total = guide.lessons.length;
  const { completed, percent } = courseProgress(guide.id, total);

  const available = guide.lessons.filter((l) => l.contentStatus === "available");
  const pending = guide.lessons.filter((l) => l.contentStatus === "pending");
  const nextLesson = available.find((l) => !isComplete(guide.id, l.id));

  const ctaTo = nextLesson
    ? `/course/${guide.id}/lesson/${nextLesson.id}`
    : `/course/${guide.id}`;
  const ctaLabel =
    completed === 0 ? "Start guide" : nextLesson ? "Continue guide" : "Review guide";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-800/50">
      <div className="relative h-32 bg-ink-900 sm:h-40">
        {guide.image ? (
          <img
            src={guide.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#172339] to-[#101a2c]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/45 to-ink-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="text-xl font-semibold text-white">{guide.title}</h2>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {completed} of {total} {total === 1 ? "lesson" : "lessons"} complete
          </span>
          <span className="text-xs font-medium text-slate-500">{percent}%</span>
        </div>
        <ProgressBar percent={percent} className="mt-2" />

        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          {nextLesson ? (
            <>
              Next: <span className="font-semibold">{nextLesson.title}</span>
            </>
          ) : pending.length > 0 ? (
            "Available lessons complete."
          ) : (
            "Complete."
          )}
        </p>
        {pending.length > 0 && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            {pending.length} {pending.length === 1 ? "lesson" : "lessons"}{" "}
            pending the updated app workflow.
          </p>
        )}

        <Link
          to={ctaTo}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep"
        >
          {ctaLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function SideStats({ guide }: { guide: Course }) {
  const { isComplete } = useProgress();
  const [quizScore] = usePersistentState<QuizScore>(
    guide.quizId ? quizScoreKey(guide.quizId) : `robocor-quiz-noquiz:${guide.id}`,
    null,
  );

  const cert = getCertificatesForCourse(guide.id)[0];
  const certUnlocked = cert
    ? cert.requiredLessonIds.every((id) => isComplete(guide.id, id)) &&
      (cert.requiresQuiz ? !!quizScore : true)
    : null;

  const hasRows = !!guide.quizId || !!cert;

  return (
    <div className="flex h-full flex-1 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50">
      {hasRows ? (
        <dl className="space-y-2.5 text-sm">
          {guide.quizId && (
            <div className="flex items-center justify-between">
              <dt className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <QuizIcon className="h-4 w-4 text-slate-400" />
                Latest quiz
              </dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">
                {quizScore ? `${quizScore.score} / ${quizScore.total}` : "Not taken"}
              </dd>
            </div>
          )}
          {cert && (
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
          )}
        </dl>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No knowledge check or completion card for this guide yet.
        </p>
      )}
      <p className="mt-auto border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-400 dark:border-slate-700">
        Progress is saved on this device only.
      </p>
    </div>
  );
}

function EmptyContinue() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-accent dark:bg-accent/15">
        <CourseIcon className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-lg font-semibold dark:text-slate-100">
        Start with a guide
      </h2>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Choose a guide from the library to begin. Your progress will show up here
        once you open one.
      </p>
      <Link
        to="/courses"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep"
      >
        Browse guides
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
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
