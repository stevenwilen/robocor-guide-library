import type { Audience, CourseDraft } from "../draftTypes";
import type { BuilderActions } from "../mutations";
import { Field, Select, TextInput } from "./fields";

const AUDIENCES: { value: Audience; label: string }[] = [
  { value: "interns", label: "Interns" },
  { value: "students", label: "Students" },
  { value: "staff", label: "Staff" },
  { value: "customers", label: "Customers" },
  { value: "other", label: "Other" },
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
      <Field label="Guide title" required>
        <TextInput
          value={course.title}
          onChange={(v) => actions.setField({ title: v })}
          placeholder="e.g. Morpheus Arm Calibration"
        />
      </Field>

      <Field
        label="Guide description"
        required
        hint="One line shown on the guide card."
      >
        <TextInput
          value={course.description}
          onChange={(v) => actions.setField({ description: v })}
          placeholder="What this guide covers"
        />
      </Field>

      <Field label="Intended reader">
        <Select<Audience>
          value={course.audience}
          onChange={(v) => actions.setField({ audience: v })}
          options={AUDIENCES}
        />
      </Field>

      <Field
        label="Banner image (optional)"
        hint="An image URL or expected file path, e.g. /images/my-guide.png"
      >
        <TextInput
          value={course.bannerImage ?? ""}
          onChange={(v) => actions.setField({ bannerImage: v })}
          placeholder="/images/my-guide.png"
        />
      </Field>
    </div>
  );
}
