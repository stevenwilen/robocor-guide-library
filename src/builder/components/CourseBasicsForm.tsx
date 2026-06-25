import type { Audience, CourseDraft, CourseDraftStatus } from "../draftTypes";
import type { BuilderActions } from "../mutations";
import { Field, Segmented, Select, TextArea, TextInput } from "./fields";

const AUDIENCES: { value: Audience; label: string }[] = [
  { value: "interns", label: "Interns" },
  { value: "students", label: "Students" },
  { value: "staff", label: "Staff" },
  { value: "customers", label: "Customers" },
  { value: "other", label: "Other" },
];

const STATUSES: { value: CourseDraftStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "planned", label: "Planned" },
  { value: "ready_for_review", label: "Ready for review" },
];

export default function CourseBasicsForm({
  course,
  actions,
}: {
  course: CourseDraft;
  actions: BuilderActions;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:p-6">
      <Field label="Course title" required>
        <TextInput
          value={course.title}
          onChange={(v) => actions.setField({ title: v })}
          placeholder="e.g. Morpheus Arm Calibration"
        />
      </Field>

      <Field label="Short description" required>
        <TextInput
          value={course.description}
          onChange={(v) => actions.setField({ description: v })}
          placeholder="One line shown on the course card"
        />
      </Field>

      <Field label="Audience">
        <Select<Audience>
          value={course.audience}
          onChange={(v) => actions.setField({ audience: v })}
          options={AUDIENCES}
        />
      </Field>

      <Field
        label="Course goal"
        required
        hint="What a learner should be able to do after this course."
      >
        <TextArea
          value={course.goal}
          onChange={(v) => actions.setField({ goal: v })}
          placeholder="By the end of this course, the learner can..."
        />
      </Field>

      <Field label="Status">
        <Segmented<CourseDraftStatus>
          value={course.status}
          onChange={(v) => actions.setField({ status: v })}
          options={STATUSES}
        />
      </Field>

      <Field
        label="Banner image (optional)"
        hint="An image URL or expected file path, e.g. /images/my-course.png"
      >
        <TextInput
          value={course.bannerImage ?? ""}
          onChange={(v) => actions.setField({ bannerImage: v })}
          placeholder="/images/my-course.png"
        />
      </Field>
    </div>
  );
}
