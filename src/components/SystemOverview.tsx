import { InfoIcon } from "./icons";

// A concise, honest summary of what the guide library currently includes.
// Plain documentation — not a dashboard, not stats, no fake metrics.
const ITEMS = [
  "Course directory",
  "Morpheus Drive course",
  "Reusable lesson layout",
  "Lesson 1 complete",
  "Lessons 2–3 ready to fill in after the updated app walkthrough",
  "Progress saved on this device",
  "Future courses can be added",
];

export default function SystemOverview() {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <InfoIcon className="h-4 w-4" />
        </span>
        <h2 className="text-base font-semibold text-slate-900">
          System overview
        </h2>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        What this guide library includes today.
      </p>

      <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
