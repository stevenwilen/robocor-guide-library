import type { LessonSection, SectionLayoutVariant } from "../../data/types";
import { CheckCircleIcon, PlayIcon, SparkIcon } from "../icons";

// Renders a guide section's content blocks. Two layers of presentation, both
// set during the publishing/design pass (never in the Builder) and both
// optional so existing content keeps working:
//   - the section `layoutVariant` arranges blocks (e.g. media beside text)
//   - each block's `displayVariant` controls how that block looks
// On mobile everything stacks cleanly.

function isMedia(s: LessonSection): boolean {
  return s.type === "image" || s.type === "gallery";
}

export default function LessonSections({
  sections,
  layoutVariant,
}: {
  sections: LessonSection[];
  layoutVariant?: SectionLayoutVariant;
}) {
  const mediaSplit =
    layoutVariant === "media-right" || layoutVariant === "media-left";
  const media = mediaSplit ? sections.filter(isMedia) : [];

  // Media-beside-text: content in one column, images in the other. Falls back
  // to a normal stack when there is no media to place.
  if (mediaSplit && media.length > 0) {
    const content = sections.filter((s) => !isMedia(s));
    const contentCol = (
      <div className="space-y-5">
        {content.map((s, i) => (
          <SectionBlock key={i} section={s} />
        ))}
      </div>
    );
    const mediaCol = (
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        {media.map((s, i) => (
          <SectionBlock key={`m${i}`} section={s} />
        ))}
      </div>
    );
    return (
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {layoutVariant === "media-left" ? (
          <>
            {mediaCol}
            {contentCol}
          </>
        ) : (
          <>
            {contentCol}
            {mediaCol}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section, i) => (
        <SectionBlock key={i} section={section} />
      ))}
    </div>
  );
}

function SectionBlock({ section }: { section: LessonSection }) {
  const dv = section.displayVariant;

  switch (section.type) {
    case "paragraph": {
      const body = (
        <>
          {section.heading && <SectionHeading>{section.heading}</SectionHeading>}
          <p className="text-[15px] leading-[1.75] text-slate-700">
            {section.text}
          </p>
        </>
      );
      // "plain" reads as flowing prose; default keeps the card surface.
      return dv === "plain" ? (
        <section>{body}</section>
      ) : (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6">
          {body}
        </section>
      );
    }

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

    case "steps": {
      // "grid"/"compact" turn a long list of short actions into tidy small
      // cards instead of giant full-width rows. Default keeps the big steps.
      if (dv === "grid" || dv === "compact") {
        return (
          <section>
            {section.heading && (
              <SectionHeading>{section.heading}</SectionHeading>
            )}
            <ul
              className={
                dv === "grid" ? "grid gap-2.5 sm:grid-cols-2" : "space-y-2"
              }
            >
              {section.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 shadow-card"
                >
                  <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-semibold text-accent ring-1 ring-inset ring-blue-600/20">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {step.title}
                    </p>
                    {step.detail && (
                      <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      }
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
    }

    case "keyNotes": {
      const compact = dv === "compact";
      return (
        <section>
          {section.heading && <SectionHeading>{section.heading}</SectionHeading>}
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {section.notes.map((note, i) => (
              <li
                key={i}
                className={`flex gap-2 rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-card ${
                  compact ? "p-2.5 text-[13px]" : "p-4 text-sm"
                }`}
              >
                <CheckCircleIcon
                  className={`mt-0.5 shrink-0 text-emerald-500 ${
                    compact ? "h-3.5 w-3.5" : "h-4 w-4"
                  }`}
                />
                <span className="leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </section>
      );
    }

    case "callout": {
      const tone = section.tone ?? "info";

      // "highlight" reads as a reusable template/snippet rather than a banner.
      if (dv === "highlight") {
        return (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-card">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
              <SparkIcon className="h-3.5 w-3.5 text-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {section.heading ?? "Template"}
              </span>
            </div>
            <p className="px-4 py-3 font-mono text-[13px] leading-relaxed text-slate-700">
              {section.text}
            </p>
          </section>
        );
      }

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
// "image pending" placeholder - never a broken <img> or a fake upload claim.
function ImageOrPlaceholder({
  src,
  alt,
  intendedPath,
  fileName,
  needsUpload,
}: {
  src?: string;
  alt?: string;
  intendedPath?: string;
  fileName?: string;
  needsUpload?: boolean;
}) {
  if (src && !needsUpload) {
    return <img src={src} alt={alt ?? ""} className="w-full object-cover" />;
  }
  return (
    <div className="flex flex-col items-center justify-center gap-1 bg-slate-50 px-4 py-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Image pending
      </p>
      <p className="text-sm text-slate-500">
        {fileName || intendedPath || alt || "Image"}
      </p>
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
