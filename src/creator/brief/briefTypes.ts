// Data model for a guide BRIEF (commission). The creator captures intent and
// hands over raw materials; they do not build blocks or write the lessons.
// Steven + Claude scope it, section it, and design it. The brief doubles as a
// scope sheet so a fixed price can be quoted against a complete submission.

import { newMaterial, type Material } from "../materials/types";

export type { Material } from "../materials/types";

export type Audience =
  | "interns"
  | "students"
  | "staff"
  | "customers"
  | "other";

export interface GuideBrief {
  title: string;
  audience: Audience;
  /** What the guide should help the reader do (the outcome / scope bound). */
  goal: string;
  /** Topics the guide should cover. The deliverable spine; Steven sections it. */
  topics: string[];
  /** The pile of source material (links + files). */
  materials: Material[];
  /** Optional creative direction / brand notes. */
  feel: string;
  /** Optional must-include / leave-out / specific examples to feature. */
  notes: string;
}

export interface BriefDocument {
  brief: GuideBrief;
  createdAt: string;
  updatedAt: string;
}

export const AUDIENCES: { value: Audience; label: string }[] = [
  { value: "interns", label: "Interns" },
  { value: "students", label: "Students" },
  { value: "staff", label: "Staff" },
  { value: "customers", label: "Customers" },
  { value: "other", label: "Other" },
];

export function emptyBrief(): GuideBrief {
  return {
    title: "",
    audience: "staff",
    goal: "",
    topics: [""],
    materials: [newMaterial("link")],
    feel: "",
    notes: "",
  };
}
