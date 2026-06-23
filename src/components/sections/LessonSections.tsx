import type { LessonSection } from "../../data/types";
import { CheckCircleIcon } from "../icons";

// Renders a list of lesson section blocks. Add a case here when a new block
// type is added to LessonSection in src/data/types.ts.

export default function LessonSections({
  sections,
}: {
  sections: LessonSection[];
}) {
  return (
    <div className="space-y-10">
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
          <p className="text-[15px] leading-[1.75] text-slate-700">
            {section.text}
          </p>
        </section>
      );

    case "video":
      return (
        <section>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-ink-900 shadow-card">
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${section.youtubeId}`}
                title={section.title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          {section.note && (
            <p className="mt-2.5 text-xs italic text-slate-500">
              {section.note}
            </p>
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
                className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition hover:border-slate-300"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-accent ring-1 ring-inset ring-blue-600/20">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-sm font-semibold text-slate-900">
                    {step.title}
                  </p>
                  {step.detail && (
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
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
                className="flex gap-2.5 rounded-xl border border-slate-200/80 bg-white p-4 text-sm text-slate-700 shadow-card"
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
      const accentBar: Record<string, string> = {
        info: "bg-blue-500",
        tip: "bg-emerald-500",
        warning: "bg-amber-500",
      };
      const labels: Record<string, string> = {
        info: "Note",
        tip: "Tip",
        warning: "Caution",
      };
      return (
        <section
          className={`relative overflow-hidden rounded-2xl border p-5 pl-6 ${toneStyles[tone]}`}
        >
          <span
            aria-hidden="true"
            className={`absolute inset-y-0 left-0 w-1 ${accentBar[tone]}`}
          />
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
    <h2 className="mb-3.5 text-lg font-semibold text-slate-900">{children}</h2>
  );
}
