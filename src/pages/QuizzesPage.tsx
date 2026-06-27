import { Link } from "react-router-dom";
import { ArrowRightIcon, QuizIcon } from "../components/icons";
import { courses } from "../data/courses";
import { getQuizForCourse, type Quiz } from "../data/quiz";
import { usePersistentState } from "../hooks/usePersistentState";
import { quizScoreKey, type QuizScore } from "../data/storageKeys";

// Index of knowledge checks: one compact card per guide that has a quiz.
// Each card links to a dedicated quiz page so the list stays scannable as more
// guides are added.
export default function QuizzesPage() {
  const items = courses
    .map((course) => ({ course, quiz: getQuizForCourse(course) }))
    .filter(
      (x): x is { course: (typeof courses)[number]; quiz: Quiz } => !!x.quiz,
    );

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-accent dark:bg-accent/15">
            <QuizIcon className="h-4 w-4" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Knowledge checks
          </p>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight dark:text-slate-100">
          Knowledge Checks
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          Short checks based on each guide's available sections. Pick one to
          take it. Your latest score is saved on this device.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
          No knowledge checks are available yet.
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map(({ course, quiz }) => (
            <QuizIndexCard key={quiz.id} guideTitle={course.title} quiz={quiz} />
          ))}
        </div>
      )}

      <p className="mt-8 text-xs leading-relaxed text-slate-400">
        These are lightweight local checks, not secure or account-based.
      </p>
    </div>
  );
}

function QuizIndexCard({
  guideTitle,
  quiz,
}: {
  guideTitle: string;
  quiz: Quiz;
}) {
  const [score] = usePersistentState<QuizScore>(quizScoreKey(quiz.id), null);
  const total = quiz.questions.length;
  const status = score
    ? `Latest score ${score.score}/${score.total}`
    : "Not taken";

  return (
    <Link
      to={`/quizzes/${quiz.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lift dark:border-slate-800 dark:bg-slate-800/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-accent dark:bg-accent/15">
        <QuizIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {guideTitle}
        </p>
        <h2 className="text-[15px] font-semibold text-slate-900 transition-colors group-hover:text-accent dark:text-slate-100">
          {quiz.title}
        </h2>
        {quiz.description && (
          <p className="mt-0.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {quiz.description}
          </p>
        )}
        <p className="mt-1.5 text-xs text-slate-500">
          {total} {total === 1 ? "question" : "questions"} · {status}
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent">
        {score ? "Retake" : "Take"}
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
