import { TextInput } from "../../builder/components/fields";
import { newMaterial, type Material } from "./types";

// Shared editor for a list of materials: each row is a Link (URL) or a File
// (picked locally, attached to the submission), with its own optional note. Used
// by the New Guide brief and the Update Existing Guide request. The actual File
// objects are managed by the parent via useMaterialFiles (onPick/onDrop/attached).

export function MaterialsEditor({
  materials,
  onChange,
  attached,
  onPick,
  onDrop,
  label = "Materials",
  description,
  required,
  minItems = 0,
}: {
  materials: Material[];
  onChange: (materials: Material[]) => void;
  attached: Set<string>;
  onPick: (id: string, file: File) => void;
  onDrop: (id: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
  minItems?: number;
}) {
  function update(id: string, patch: Partial<Material>) {
    onChange(materials.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }
  function add(kind: "link" | "file") {
    onChange([...materials, newMaterial(kind)]);
  }
  function remove(id: string) {
    onDrop(id);
    onChange(materials.filter((m) => m.id !== id));
  }
  function pick(id: string, file: File) {
    onPick(id, file);
    update(id, { ref: file.name });
  }

  return (
    <div>
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      {description && (
        <p className="mt-1 mb-3 text-[11px] leading-relaxed text-slate-400">
          {description}
        </p>
      )}

      <div className={`${description ? "" : "mt-3"} space-y-3`}>
        {materials.map((m) => {
          const isAttached = attached.has(m.id);
          const needsReattach =
            m.kind === "file" && m.ref.trim() !== "" && !isAttached;
          return (
            <div
              key={m.id}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/40"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                  {m.kind === "link" ? "Link" : "File"}
                </span>
                {materials.length > minItems && (
                  <button
                    type="button"
                    onClick={() => remove(m.id)}
                    className="text-xs text-slate-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              {m.kind === "link" ? (
                <TextInput
                  value={m.ref}
                  onChange={(v) => update(m.id, { ref: v })}
                  placeholder="https://… (webpage, doc, or video URL)"
                />
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200">
                    {m.ref
                      ? isAttached
                        ? "Change file"
                        : "Re-attach file"
                      : "Choose file"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) pick(m.id, f);
                      }}
                    />
                  </label>
                  {m.ref && (
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      {m.ref}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-2">
                <TextInput
                  value={m.note ?? ""}
                  onChange={(v) => update(m.id, { note: v })}
                  placeholder="Note (optional): what it is / how to use it"
                />
              </div>

              {needsReattach && (
                <p className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                  Re-select this file so it attaches to the submission.
                </p>
              )}
              {m.kind === "file" && isAttached && (
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Attaches to the submission. Not uploaded anywhere else.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => add("link")}
          className="text-xs font-semibold text-accent hover:underline"
        >
          + Add link
        </button>
        <button
          type="button"
          onClick={() => add("file")}
          className="text-xs font-semibold text-accent hover:underline"
        >
          + Add file
        </button>
      </div>
    </div>
  );
}
