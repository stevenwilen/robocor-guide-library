import { useState } from "react";
import { CheckIcon, CloseIcon, QuizIcon } from "../components/icons";
import { morpheusQuiz } from "../data/quiz";
import { usePersistentState } from "../hooks/usePersistentState";

type QuizScore = { score: number; total: number; date: string } | null;

export default function QuizzesPage() {
  const quiz = morpheusQuiz;
  const total = quiz.questions.length;
  const [, setStoredScore] = usePersistentState<QuizScore>(
    "robocor-quiz-score",
    null,
  );

  const [answers, setAnswers] = useState<(number | null)[]>(
    () => quiz.questions.map(() => null),
  );
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.reduce<number>(
    (sum, a, i) => sum + (a === quiz.questions[i].answerIndex ? 1 : 0),
    0,
  );

  function select(qIndex: number, oIndex: number) {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = oIndex;
      return next;
    });
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    setStoredScore({
      score,
      total,
      date: new Date().toISOString(),
    });
  }

  function retake() {
    setAnswers(quiz.questions.map(() => null));
    setSubmitted(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-accent dark:bg-accent/15">
            <QuizIcon className="h-4 w-4" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Knowledge check
          </p>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight dark:text-slate-100">
          {quiz.title}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          A short check based on the current Lesson 1 content. Your latest score
          is saved on this device.
        </p>
      </header>

      {submitted && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Your score
            </p>
            <p className="text-2xl font-semibold tracking-tight">
              {score}{" "}
              <span className="text-lg text-slate-400">/ {total}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={retake}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Retake
          </button>
        </div>
      )}

      <ol className="mt-6 space-y-5">
        {quiz.questions.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <li
              key={q.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6"
            >
              <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                <span className="text-slate-400">{qi + 1}.</span> {q.question}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = oi === q.answerIndex;
                  let state =
                    "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600";
                  if (submitted) {
                    if (isCorrect)
                      state =
                        "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30";
                    else if (isChosen)
                      state =
                        "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/25";
                    else state = "border-slate-200 dark:border-slate-700";
                  } else if (isChosen) {
                    state =
                      "border-accent bg-blue-50 dark:border-accent dark:bg-accent/15";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() => select(qi, oi)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${state} ${submitted ? "cursor-default" : ""}`}
                    >
                      <span className="text-slate-700 dark:text-slate-200">
                        {opt}
                      </span>
                      {submitted && isCorrect && (
                        <CheckIcon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {submitted && isChosen && !isCorrect && (
                        <CloseIcon className="h-4 w-4 shrink-0 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {!submitted && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto sm:px-6"
          >
            {allAnswered ? "Submit answers" : "Answer all questions to submit"}
          </button>
        </div>
      )}

      <p className="mt-6 text-xs leading-relaxed text-slate-400">
        This knowledge check can be updated as more lessons are added. It's a
        lightweight local check, not secure or account-based.
      </p>
    </div>
  );
}
