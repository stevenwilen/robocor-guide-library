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
import { certificates, type CertificateDef } from "../data/certificates";
import { useProgress } from "../hooks/useProgress";
import { usePersistentState } from "../hooks/usePersistentState";
import {
  certificateKey,
  quizScoreKey,
  type QuizScore,
} from "../data/storageKeys";

type CertState = { dateIssued: string | null };

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
          Completion Cards
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          Lightweight local completion cards you can show for review. They are
          saved on this device only, not secure or account-verified
          credentials.
        </p>
      </header>

      {certificates.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
          No completion cards are available yet.
        </div>
      ) : (
        <div className="mt-7 space-y-8">
          {certificates.map((cert) => (
            <CertificateItem key={cert.id} cert={cert} />
          ))}
        </div>
      )}
    </div>
  );
}

function CertificateItem({ cert }: { cert: CertificateDef }) {
  const { isComplete } = useProgress();
  const course = courses.find((c) => c.id === cert.courseId);

  const lessonsDone = cert.requiredLessonIds.every((id) =>
    isComplete(cert.courseId, id),
  );

  const [name, setName] = usePersistentState<string>("robocor-learner-name", "");
  const quizId = course?.quizId;
  const [quizScore] = usePersistentState<QuizScore>(
    quizId ? quizScoreKey(quizId) : `robocor-quiz-noquiz:${cert.id}`,
    null,
  );
  const quizTaken = quizScore != null;
  const quizSatisfied = cert.requiresQuiz ? quizTaken : true;
  // Unlock rule mirrors the original behavior exactly: all required lessons
  // complete AND (when required) the course quiz taken.
  const unlocked = lessonsDone && quizSatisfied;

  const [certState, setCertState] = usePersistentState<CertState>(
    certificateKey(cert.id),
    { dateIssued: null },
  );

  const [previewOpen, setPreviewOpen] = useState(false);

  // Record the completion date once, the first time all steps are done.
  useEffect(() => {
    if (unlocked && !certState.dateIssued) {
      setCertState({ dateIssued: new Date().toISOString() });
    }
  }, [unlocked, certState.dateIssued, setCertState]);

  // Close the full-screen preview with Escape.
  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewOpen]);

  if (!unlocked) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-card dark:border-slate-800 dark:bg-slate-800/50">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-300">
          <LockIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">{cert.title}</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600 dark:text-slate-400">
          Finish the steps below to unlock this completion card.
        </p>
        <ul className="mx-auto mt-6 max-w-sm space-y-2.5 text-left">
          {cert.requiredLessonIds.map((lessonId) => {
            const lesson = course?.lessons.find((l) => l.id === lessonId);
            return (
              <Requirement
                key={lessonId}
                done={isComplete(cert.courseId, lessonId)}
                label={`Complete the ${lesson?.title ?? lessonId} lesson`}
                to={`/course/${cert.courseId}/lesson/${lessonId}`}
                cta="Go to lesson"
              />
            );
          })}
          {cert.requiresQuiz && (
            <Requirement
              done={quizTaken}
              label={`Take the ${course?.title ?? "course"} knowledge check`}
              to={quizId ? `/quizzes/${quizId}` : "/quizzes"}
              cta="Go to quiz"
            />
          )}
        </ul>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 sm:flex-row sm:items-end sm:justify-between">
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
          cert={cert}
          name={name}
          dateIssued={certState.dateIssued}
          quizScore={quizScore}
          courseTitle={course?.title}
        />
      </div>

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
              cert={cert}
              name={name}
              dateIssued={certState.dateIssued}
              quizScore={quizScore}
              courseTitle={course?.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// The completion "paper" - always light, in both themes and at preview size.
function CompletionCard({
  cert,
  name,
  dateIssued,
  quizScore,
  courseTitle,
  large,
}: {
  cert: CertificateDef;
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
          {cert.title}
        </h2>
        {courseTitle && (
          <p className="mt-0.5 text-sm text-slate-500">
            {courseTitle} · {cert.scopeLabel}
          </p>
        )}

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <Field label="Completed by">
            {name.trim() || <span className="text-slate-400">Add your name</span>}
          </Field>
          <Field label="Completed on">
            {dateIssued ? formatDate(dateIssued) : "Not set"}
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
