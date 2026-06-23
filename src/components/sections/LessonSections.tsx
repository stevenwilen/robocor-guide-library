import type { LessonSection } from "../../data/types";
import { CheckCircleIcon, PlayIcon } from "../icons";

// Renders a list of lesson section blocks. Add a case here when a new block
// type is added to LessonSection in src/data/types.ts.

export default function LessonSections({
  sections,
}: {
  sections: LessonSection[];
}) {
  return (
    <div className="space-y-8">
      {sections.map((section, i) => (
        <SectionBlock key={i} section={section} />
      ))}
    </div>
  );
}

function SectionBlock({ section }: { section: LessonSection }) {
  switch (section.type) {
    case "paragraph":
      return (
        <section>
          {section.heading && <SectionHeading>{section.heading}</SectionHeading>}
          <p className="text-[15px] leading-relaxed text-slate-600">
            {section.text}
          </p>
        </section>
      );

    case "video":
      return (
        <section>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-panel">
            <div className="relative aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-600" />
              <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-lg">
                  <PlayIcon className="ml-0.5 h-6 w-6" />
                </span>
                <span className="text-sm font-medium text-white/90">
                  {section.title}
                </span>
                {section.durationLabel && (
                  <span className="text-xs text-white/60">
                    {section.durationLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
          {section.note && (
            <p className="mt-2 text-xs italic text-slate-400">{section.note}</p>
          )}
        </section>
      );

    case "steps":
      return (
        <section>
          {section.heading && <SectionHeading>{section.heading}</SectionHeading>}
          <ol className="space-y-3">
            {section.steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-accent ring-1 ring-inset ring-blue-600/20">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {step.title}
                  </p>
                  {step.detail && (
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                      {step.detail}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      );

    case "keyNotes":
      return (
        <section>
          {section.heading && <SectionHeading>{section.heading}</SectionHeading>}
          <ul className="grid gap-3 sm:grid-cols-2">
            {section.notes.map((note, i) => (
              <li
                key={i}
                className="flex gap-2.5 rounded-lg border border-slate-200 bg-white p-3.5 text-sm text-slate-600 shadow-card"
              >
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span className="leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </section>
      );

    case "callout": {
      const tone = section.tone ?? "info";
      const toneStyles: Record<string, string> = {
        info: "border-blue-200 bg-blue-50 text-blue-900",
        tip: "border-emerald-200 bg-emerald-50 text-emerald-900",
        warning: "border-amber-200 bg-amber-50 text-amber-900",
      };
      const labels: Record<string, string> = {
        info: "Note",
        tip: "Tip",
        warning: "Caution",
      };
      return (
        <section
          className={`rounded-xl border p-4 ${toneStyles[tone]}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
            {section.heading ?? labels[tone]}
          </p>
          <p className="mt-1 text-sm leading-relaxed">{section.text}</p>
        </section>
      );
    }

    default:
      return null;
  }
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-lg font-semibold text-slate-900">{children}</h2>
  );
}
