import {
  BLOCK_LABELS,
  BLOCK_TYPES,
  type CourseDraft,
  type DraftBlockType,
  type LessonDraftStatus,
} from "../draftTypes";
import type { BuilderActions } from "../mutations";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "../../components/icons";
import BlockEditor from "./BlockEditor";
import { Field, Segmented, TextArea, TextInput } from "./fields";

export default function LessonEditor({
  course,
  actions,
}: {
  course: CourseDraft;
  actions: BuilderActions;
}) {
  return (
    <div className="space-y-5">
      {course.lessons.map((lesson, li) => (
        <div
          key={lesson.id}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6"
        >
          {/* Section header */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-accent dark:bg-accent/15">
              Section {li + 1}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <IconBtn
                label="Move section up"
                disabled={li === 0}
                onClick={() => actions.moveLesson(li, -1)}
              >
                <ArrowUpIcon className="h-4 w-4" />
              </IconBtn>
              <IconBtn
                label="Move section down"
                disabled={li === course.lessons.length - 1}
                onClick={() => actions.moveLesson(li, 1)}
              >
                <ArrowDownIcon className="h-4 w-4" />
              </IconBtn>
              <IconBtn
                label="Remove section"
                disabled={course.lessons.length === 1}
                onClick={() => actions.removeLesson(lesson.id)}
                danger
              >
                <TrashIcon className="h-4 w-4" />
              </IconBtn>
            </div>
          </div>

          <div className="space-y-4">
            <Field label="Section title" required>
              <TextInput
                value={lesson.title}
                onChange={(v) => actions.updateLesson(lesson.id, { title: v })}
                placeholder="e.g. Hardware Setup"
              />
            </Field>
            <Field label="Section description (optional)">
              <TextInput
                value={lesson.description}
                onChange={(v) =>
                  actions.updateLesson(lesson.id, { description: v })
                }
                placeholder="One-line summary of this section"
              />
            </Field>
            <Field label="Section state">
              <Segmented<LessonDraftStatus>
                value={lesson.status}
                onChange={(v) =>
                  actions.updateLesson(lesson.id, { status: v })
                }
                options={[
                  { value: "available", label: "Ready to include" },
                  { value: "pending", label: "Needs more info" },
                ]}
              />
            </Field>

            {lesson.status === "pending" ? (
              <Field
                label="What information is still needed?"
                required
                hint="Describe honestly what is missing before this section can be written."
              >
                <TextArea
                  value={lesson.pendingNote ?? ""}
                  onChange={(v) =>
                    actions.updateLesson(lesson.id, { pendingNote: v })
                  }
                  placeholder="e.g. Updated app walkthrough and connection steps"
                />
              </Field>
            ) : (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Content blocks
                  </span>
                </div>

                {lesson.blocks.length === 0 && (
                  <p className="mb-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/40">
                    No blocks yet. Add at least one block, or set this section to
                    "Needs more info".
                  </p>
                )}

                <div className="space-y-3">
                  {lesson.blocks.map((block, bi) => (
                    <div
                      key={block.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40"
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {BLOCK_LABELS[block.type]}
                        </span>
                        <div className="flex shrink-0 items-center gap-1">
                          <IconBtn
                            label="Move block up"
                            disabled={bi === 0}
                            onClick={() =>
                              actions.moveBlock(lesson.id, bi, -1)
                            }
                          >
                            <ArrowUpIcon className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn
                            label="Move block down"
                            disabled={bi === lesson.blocks.length - 1}
                            onClick={() => actions.moveBlock(lesson.id, bi, 1)}
                          >
                            <ArrowDownIcon className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn
                            label="Remove block"
                            onClick={() =>
                              actions.removeBlock(lesson.id, block.id)
                            }
                            danger
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconBtn>
                        </div>
                      </div>
                      <BlockEditor
                        block={block}
                        onChange={(next) =>
                          actions.updateBlock(lesson.id, next)
                        }
                      />
                    </div>
                  ))}
                </div>

                <AddBlock
                  onAdd={(type) => actions.addBlock(lesson.id, type)}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={actions.addLesson}
        className="w-full rounded-2xl border border-dashed border-slate-300 bg-white py-3 text-sm font-semibold text-accent transition hover:border-accent hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-800/40"
      >
        + Add section
      </button>
    </div>
  );
}

function AddBlock({ onAdd }: { onAdd: (type: DraftBlockType) => void }) {
  return (
    <div className="mt-3">
      <select
        value=""
        onChange={(e) => {
          const v = e.target.value as DraftBlockType | "";
          if (v) onAdd(v);
          e.target.value = "";
        }}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-accent focus:border-accent focus:outline-none dark:border-slate-600 dark:bg-slate-900 sm:w-auto"
      >
        <option value="">+ Add content block…</option>
        {BLOCK_TYPES.map((t) => (
          <option key={t} value={t}>
            {BLOCK_LABELS[t]}
          </option>
        ))}
      </select>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded-md border border-slate-200 p-1.5 text-slate-500 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 ${
        danger
          ? "hover:border-red-300 hover:text-red-600"
          : "hover:border-slate-300 hover:text-slate-800 dark:hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
