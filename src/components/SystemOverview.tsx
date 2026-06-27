import { InfoIcon } from "./icons";
import { courses } from "../data/courses";

// A concise, honest, data-driven summary of what the guide library currently
// includes. Derived from the course data so it stays accurate as guides are
// added; no fake metrics, no stale per-guide claims.
export default function SystemOverview() {
  const guideCount = courses.length;
  const lessons = courses.flatMap((c) => c.lessons);
  const available = lessons.filter((l) => l.contentStatus === "available").length;
  const pending = lessons.filter((l) => l.contentStatus === "pending").length;
  const checks = courses.filter((c) => c.quizId).length;

  const items = [
    `${guideCount} published ${guideCount === 1 ? "guide" : "guides"}`,
    `${available} ${available === 1 ? "lesson" : "lessons"} available to read`,
    ...(pending > 0
      ? [`${pending} ${pending === 1 ? "lesson" : "lessons"} pending updated content`]
      : []),
    `${checks} knowledge ${checks === 1 ? "check" : "checks"}`,
    "Local completion cards",
    "Progress saved on this device only",
    "New guides added through JSON publishing",
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-800/50">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          <InfoIcon className="h-4 w-4" />
        </span>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          What this guide library includes
        </h2>
      </div>

      <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
          >
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
