import { useEffect, useState } from "react";
import type {
  CalloutTone,
  DraftBlock,
  DraftImage,
  ImageLayout,
  VideoStyle,
} from "../draftTypes";
import {
  Field,
  Segmented,
  StringListEditor,
  TextArea,
  TextInput,
} from "./fields";

// Editor body for a single content block. The parent (LessonEditor) handles the
// surrounding card, move up/down, and remove.
export default function BlockEditor({
  block,
  onChange,
}: {
  block: DraftBlock;
  onChange: (next: DraftBlock) => void;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <div className="space-y-3">
          <Field label="Heading (optional)">
            <TextInput
              value={block.heading ?? ""}
              onChange={(v) => onChange({ ...block, heading: v })}
              placeholder="Optional sub-heading"
            />
          </Field>
          <Field label="Body text">
            <TextArea
              value={block.text}
              onChange={(v) => onChange({ ...block, text: v })}
              placeholder="Paragraph text"
              rows={4}
            />
          </Field>
        </div>
      );

    case "video":
      return (
        <div className="space-y-3">
          <Field label="YouTube URL or ID">
            <TextInput
              value={block.youtube}
              onChange={(v) => onChange({ ...block, youtube: v })}
              placeholder="https://youtu.be/… or the bare id"
            />
          </Field>
          <Field label="Caption (optional)">
            <TextInput
              value={block.caption ?? ""}
              onChange={(v) => onChange({ ...block, caption: v })}
              placeholder="Shown with the video"
            />
          </Field>
          <Field label="Display style">
            <Segmented<VideoStyle>
              value={block.style ?? "standard"}
              onChange={(v) => onChange({ ...block, style: v })}
              options={[
                { value: "standard", label: "Standard" },
                { value: "feature", label: "Feature" },
                { value: "compact", label: "Compact" },
              ]}
            />
          </Field>
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <ImageField
            image={block.image}
            onChange={(img) => onChange({ ...block, image: img })}
          />
          <Field label="Layout">
            <Segmented<ImageLayout>
              value={block.layout ?? "standard"}
              onChange={(v) => onChange({ ...block, layout: v })}
              options={[
                { value: "standard", label: "Standard" },
                { value: "wide", label: "Wide" },
                { value: "sideBySide", label: "Side by side" },
              ]}
            />
          </Field>
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-3">
          <Field label="Gallery heading (optional)">
            <TextInput
              value={block.heading ?? ""}
              onChange={(v) => onChange({ ...block, heading: v })}
              placeholder="Optional heading"
            />
          </Field>
          {block.images.map((img, i) => (
            <div
              key={img.id}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/40"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Image {i + 1}
                </span>
                {block.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...block,
                        images: block.images.filter((_, j) => j !== i),
                      })
                    }
                    className="text-xs text-slate-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <ImageField
                image={img}
                onChange={(next) =>
                  onChange({
                    ...block,
                    images: block.images.map((im, j) => (j === i ? next : im)),
                  })
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...block,
                images: [...block.images, newGalleryImage()],
              })
            }
            className="text-xs font-semibold text-accent hover:underline"
          >
            + Add image
          </button>
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            Image files must be included when you submit the draft.
          </p>
        </div>
      );

    case "checklist":
      return (
        <Field label="Steps / action items">
          <StringListEditor
            items={block.items}
            onChange={(items) => onChange({ ...block, items })}
            placeholder="A step or action item"
            addLabel="Add item"
          />
        </Field>
      );

    case "keyNotes":
      return (
        <Field label="Key notes">
          <StringListEditor
            items={block.notes}
            onChange={(notes) => onChange({ ...block, notes })}
            placeholder="An important note"
            addLabel="Add note"
          />
        </Field>
      );

    case "callout":
      return (
        <div className="space-y-3">
          <Field label="Callout style">
            <Segmented<CalloutTone>
              value={block.tone}
              onChange={(v) => onChange({ ...block, tone: v })}
              options={[
                { value: "tip", label: "Tip" },
                { value: "warning", label: "Warning" },
                { value: "readyCheck", label: "Ready check" },
                { value: "important", label: "Important" },
              ]}
            />
          </Field>
          <Field label="Callout title (optional)">
            <TextInput
              value={block.title ?? ""}
              onChange={(v) => onChange({ ...block, title: v })}
              placeholder="Optional title"
            />
          </Field>
          <Field label="Callout body">
            <TextArea
              value={block.body}
              onChange={(v) => onChange({ ...block, body: v })}
              placeholder="Callout text"
            />
          </Field>
        </div>
      );

    default:
      return null;
  }
}

// Lightweight unique id without importing the whole factory module twice.
function newGalleryImage(): DraftImage {
  const rand = Math.random().toString(36).slice(2, 10);
  return { id: `img_${rand}`, pathOrUrl: "", alt: "", caption: "" };
}

// Image input with a real local preview that is NEVER uploaded or persisted —
// the object URL lives only in this component's state.
function ImageField({
  image,
  onChange,
}: {
  image: DraftImage;
  onChange: (next: DraftImage) => void;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(URL.createObjectURL(file));
    onChange({ ...image, fileName: file.name });
  }

  function clearFile() {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(null);
    onChange({ ...image, fileName: undefined });
  }

  const isUrl = /^https?:\/\//i.test(image.pathOrUrl.trim());
  const previewSrc = objectUrl ?? (isUrl ? image.pathOrUrl.trim() : null);

  return (
    <div className="space-y-3">
      <Field
        label="Image URL or expected file path"
        hint="Type a public URL, or an expected path like /images/foo.png."
      >
        <TextInput
          value={image.pathOrUrl}
          onChange={(v) => onChange({ ...image, pathOrUrl: v })}
          placeholder="/images/foo.png"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
          Choose local file
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>
        {image.fileName && (
          <span className="inline-flex items-center gap-2 text-xs text-slate-500">
            {image.fileName}
            <button
              type="button"
              onClick={clearFile}
              className="text-slate-400 hover:text-red-600"
            >
              clear
            </button>
          </span>
        )}
      </div>

      {previewSrc && (
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <img
            src={previewSrc}
            alt={image.alt || "Preview"}
            className="max-h-48 w-full object-cover"
          />
        </div>
      )}

      {image.fileName && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Local preview only — this file has not been uploaded. Include it with
          the draft when submitting for publishing.
        </p>
      )}

      <Field label="Alt text" hint="Describes the image for accessibility.">
        <TextInput
          value={image.alt}
          onChange={(v) => onChange({ ...image, alt: v })}
          placeholder="Describe the image"
        />
      </Field>
      <Field label="Caption (optional)">
        <TextInput
          value={image.caption ?? ""}
          onChange={(v) => onChange({ ...image, caption: v })}
          placeholder="Optional caption"
        />
      </Field>
    </div>
  );
}
