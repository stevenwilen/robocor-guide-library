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
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6">
          {section.heading && <SectionHeading>{section.heading}</SectionHeading>}
          <p className="text-[15px] leading-[1.75] text-slate-700">
            {section.text}
          </p>
        </section>
      );

    case "video":
      return (
        <section>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-accent">
                  <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
                </span>
                <h2 className="truncate text-sm font-semibold text-slate-900">
                  {section.title}
                </h2>
              </div>
              {section.durationLabel && (
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {section.durationLabel}
                </span>
              )}
            </div>
            <div className="relative aspect-video w-full bg-ink-900">
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
            {section.note && (
              <p className="border-t border-slate-100 px-4 py-2.5 text-xs italic text-slate-500 sm:px-5">
                {section.note}
              </p>
            )}
          </div>
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
        readyCheck: "border-emerald-200 bg-emerald-50 text-emerald-900",
        important: "border-blue-300 bg-blue-50 text-blue-900",
      };
      const accentBar: Record<string, string> = {
        info: "bg-blue-500",
        tip: "bg-emerald-500",
        warning: "bg-amber-500",
        readyCheck: "bg-emerald-500",
        important: "bg-blue-600",
      };
      const labels: Record<string, string> = {
        info: "Note",
        tip: "Tip",
        warning: "Caution",
        readyCheck: "Ready check",
        important: "Important",
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

    case "heading":
      return (
        <section>
          <SectionHeading>{section.text}</SectionHeading>
        </section>
      );

    case "image": {
      const wrap =
        section.layout === "wide"
          ? ""
          : section.layout === "sideBySide"
            ? "sm:max-w-sm"
            : "max-w-2xl";
      return (
        <section className={wrap}>
          <figure className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
            <ImageOrPlaceholder
              src={section.src}
              alt={section.alt}
              intendedPath={section.intendedPath}
              fileName={section.fileName}
              needsUpload={section.needsUpload}
            />
            {section.caption && (
              <figcaption className="border-t border-slate-100 px-4 py-2.5 text-xs italic text-slate-500">
                {section.caption}
              </figcaption>
            )}
          </figure>
        </section>
      );
    }

    case "gallery":
      return (
        <section>
          {section.heading && <SectionHeading>{section.heading}</SectionHeading>}
          <div className="grid gap-4 sm:grid-cols-2">
            {section.images.map((img, i) => (
              <figure
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card"
              >
                <ImageOrPlaceholder
                  src={img.src}
                  alt={img.alt}
                  intendedPath={img.intendedPath}
                  fileName={img.fileName}
                  needsUpload={img.needsUpload}
                />
                {img.caption && (
                  <figcaption className="border-t border-slate-100 px-4 py-2.5 text-xs italic text-slate-500">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      );

    case "divider":
      return <hr className="border-t border-slate-200" />;

    case "pendingNote":
      return (
        <section className="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 p-5 pl-6 text-amber-900">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-amber-500"
          />
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
            Pending
          </p>
          <p className="mt-1 text-sm leading-relaxed">{section.text}</p>
        </section>
      );

    default:
      return null;
  }
}

// Renders an image when a usable src is present, otherwise an honest
// "image pending" placeholder — never a broken <img> or a fake upload claim.
function ImageOrPlaceholder({
  src,
  alt,
  intendedPath,
  fileName,
  needsUpload,
}: {
  src?: string;
  alt: string;
  intendedPath?: string;
  fileName?: string;
  needsUpload?: boolean;
}) {
  if (src && !needsUpload) {
    return <img src={src} alt={alt} className="w-full object-cover" />;
  }
  return (
    <div className="flex flex-col items-center justify-center gap-1 bg-slate-50 px-4 py-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Image pending
      </p>
      <p className="text-sm text-slate-500">{fileName || intendedPath || alt}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3.5 flex items-center gap-2.5 text-lg font-semibold text-slate-900">
      <span aria-hidden="true" className="h-4 w-1 rounded-full bg-accent/70" />
      {children}
    </h2>
  );
}
