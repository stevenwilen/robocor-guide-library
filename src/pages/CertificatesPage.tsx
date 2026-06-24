import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CertificateIcon,
  CheckCircleIcon,
  CloseIcon,
  LockIcon,
  MaximizeIcon,
} from "../components/icons";
import { courses } from "../data/courses";
import { useProgress } from "../hooks/useProgress";
import { usePersistentState } from "../hooks/usePersistentState";

type QuizScore = { score: number; total: number; date: string } | null;
type CertState = { dateIssued: string | null };

const COURSE_ID = "morpheus-drive";
const LESSON_ID = "hardware-setup";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function CertificatesPage() {
  const { isComplete } = useProgress();
  const lesson1Done = isComplete(COURSE_ID, LESSON_ID);
  const course = courses.find((c) => c.id === COURSE_ID);

  const [name, setName] = usePersistentState<string>("robocor-learner-name", "");
  const [quizScore] = usePersistentState<QuizScore>("robocor-quiz-score", null);
  const [cert, setCert] = usePersistentState<CertState>("robocor-certificate", {
    dateIssued: null,
  });

  const quizTaken = quizScore != null;
  // The completion card requires BOTH finishing the lesson and the quiz.
  const unlocked = lesson1Done && quizTaken;

  const [previewOpen, setPreviewOpen] = useState(false);

  // Record the completion date once, the first time both steps are done.
  useEffect(() => {
    if (unlocked && !cert.dateIssued) {
      setCert({ dateIssued: new Date().toISOString() });
    }
  }, [unlocked, cert.dateIssued, setCert]);

  // Close the full-screen preview with Escape.
  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewOpen]);

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-accent dark:bg-accent/15">
            <CertificateIcon className="h-4 w-4" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Completion
          </p>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight dark:text-slate-100">
          Certificates
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          A lightweight local completion card you can show for review. It is
          saved on this device only — not a secure or account-verified
          certificate.
        </p>
      </header>

      {!unlocked ? (
        <div className="mt-7 rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-card dark:border-slate-800 dark:bg-slate-800/50">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-300">
            <LockIcon className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">Completion card locked</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Finish both steps below to unlock this completion card.
          </p>
          <ul className="mx-auto mt-6 max-w-sm space-y-2.5 text-left">
            <Requirement
              done={lesson1Done}
              label="Complete the Hardware Setup lesson"
              to={`/course/${COURSE_ID}/lesson/${LESSON_ID}`}
              cta="Go to lesson"
            />
            <Requirement
              done={quizTaken}
              label="Take the Morpheus Drive knowledge check"
              to="/quizzes"
              cta="Go to quiz"
            />
          </ul>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 sm:flex-row sm:items-end sm:justify-between">
            <label className="flex-1">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                Your name (optional)
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep"
            >
              <MaximizeIcon className="h-4 w-4" />
              Preview
            </button>
          </div>

          {/* Inline completion card */}
          <div className="mt-5">
            <CompletionCard
              name={name}
              dateIssued={cert.dateIssued}
              quizScore={quizScore}
              courseTitle={course?.title}
            />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Full course certificates can be added after the app lessons are
            completed.
          </p>
        </>
      )}

      {/* Full-screen preview */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-slate-900/70 p-4 backdrop-blur-sm">
          <button
            type="button"
            className="fixed inset-0 cursor-default"
            onClick={() => setPreviewOpen(false)}
            aria-label="Close preview"
          />
          <button
            type="button"
            onClick={() => setPreviewOpen(false)}
            aria-label="Close preview"
            className="fixed right-3 top-3 z-20 rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <div className="relative z-10 mx-auto w-full max-w-3xl py-10 sm:py-14">
            <CompletionCard
              large
              name={name}
              dateIssued={cert.dateIssued}
              quizScore={quizScore}
              courseTitle={course?.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// The completion "paper" — always light, in both themes and at preview size.
function CompletionCard({
  name,
  dateIssued,
  quizScore,
  courseTitle,
  large,
}: {
  name: string;
  dateIssued: string | null;
  quizScore: QuizScore;
  courseTitle?: string;
  large?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/20">
            <CheckCircleIcon className="h-4 w-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Completion card
          </span>
        </div>
      </div>

      <div className={`text-slate-900 ${large ? "px-8 py-10 sm:px-12" : "px-6 py-7"}`}>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          This confirms completion of
        </p>
        <h2
          className={`mt-1 font-semibold tracking-tight text-slate-900 ${large ? "text-3xl sm:text-4xl" : "text-2xl"}`}
        >
          Morpheus Drive Hardware Setup
        </h2>
        {courseTitle && (
          <p className="mt-0.5 text-sm text-slate-500">
            {courseTitle} · Lesson 1
          </p>
        )}

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <Field label="Completed by">
            {name.trim() || (
              <span className="text-slate-400">— (add your name)</span>
            )}
          </Field>
          <Field label="Completed on">
            {dateIssued ? formatDate(dateIssued) : "—"}
          </Field>
          <Field label="Status">Completed on this device</Field>
          {quizScore && (
            <Field label="Knowledge check">
              {quizScore.score} / {quizScore.total}
            </Field>
          )}
        </div>

        <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
          This completion card is saved locally and can be shown for review.
        </p>
      </div>
    </div>
  );
}

function Requirement({
  done,
  label,
  to,
  cta,
}: {
  done: boolean;
  label: string;
  to: string;
  cta: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800/40">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          done
            ? "bg-emerald-500 text-white"
            : "border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700"
        }`}
      >
        {done && <CheckCircleIcon className="h-3.5 w-3.5" />}
      </span>
      <span
        className={`flex-1 text-sm ${
          done
            ? "text-slate-400 line-through dark:text-slate-500"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        {label}
      </span>
      {!done && (
        <Link
          to={to}
          className="shrink-0 text-xs font-semibold text-accent hover:underline"
        >
          {cta}
        </Link>
      )}
    </li>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{children}</dd>
    </div>
  );
}
