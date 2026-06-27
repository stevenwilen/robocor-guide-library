import { AUDIENCES, type GuideBrief, type Material } from "./briefTypes";

// Validation, scope summary, and a readable structured submission body. There is
// no JSON envelope: the brief is sent (via the form service) as labeled fields
// plus the actual file attachments, so the submission itself is the handoff.

export function cleanTopics(brief: GuideBrief): string[] {
  return brief.topics.map((t) => t.trim()).filter(Boolean);
}

export function cleanMaterials(brief: GuideBrief): Material[] {
  return brief.materials.filter((m) => m.ref.trim());
}

export function audienceLabel(value: string): string {
  return AUDIENCES.find((a) => a.value === value)?.label ?? value;
}

/** Hard requirements that must be met before the brief can be sent. */
export function validateBrief(brief: GuideBrief): string[] {
  const errors: string[] = [];
  if (!brief.title.trim()) errors.push("Add a guide title.");
  if (!brief.goal.trim()) {
    errors.push("Describe what the guide should help the reader do.");
  }
  if (cleanTopics(brief).length === 0) {
    errors.push("List at least one topic to cover.");
  }
  if (cleanMaterials(brief).length === 0) {
    errors.push("Add at least one material (a link or a file).");
  }
  return errors;
}

export interface BriefScope {
  topics: number;
  materials: number;
  links: number;
  files: number;
  /** Soft notes a reader (Steven) should see before quoting. */
  flags: string[];
}

export function scopeOf(brief: GuideBrief): BriefScope {
  const topics = cleanTopics(brief);
  const materials = cleanMaterials(brief);
  const links = materials.filter((m) => m.kind === "link").length;
  const files = materials.filter((m) => m.kind === "file").length;

  const flags: string[] = [];
  if (files > 0) {
    flags.push(
      `${files} file${files === 1 ? "" : "s"} attached to the submission.`,
    );
  }
  if (topics.length > 0 && materials.length === 0) {
    flags.push("Topics are listed but no source material is attached.");
  }
  if (materials.length > 0 && materials.length < topics.length) {
    flags.push(
      "Fewer materials than topics — confirm every topic has a source.",
    );
  }
  if (!brief.audience) flags.push("No intended reader chosen.");

  return { topics: topics.length, materials: materials.length, links, files, flags };
}

/**
 * A readable, lightly-structured submission body. Organized so both Steven and
 * Claude can parse it at a glance (topics as a list, materials split into links
 * vs attached files). This is what the form service emails.
 */
export function buildSubmissionText(brief: GuideBrief): string {
  const topics = cleanTopics(brief);
  const materials = cleanMaterials(brief);
  const links = materials.filter((m) => m.kind === "link");
  const files = materials.filter((m) => m.kind === "file");
  const scope = scopeOf(brief);

  const lines: string[] = [];
  lines.push("ROBOCOR GUIDE BRIEF");
  lines.push("");
  lines.push(`Title: ${brief.title.trim()}`);
  lines.push(`For: ${audienceLabel(brief.audience)}`);
  lines.push(`Goal: ${brief.goal.trim()}`);
  lines.push("");

  lines.push("Topics to cover:");
  topics.forEach((t) => lines.push(`  - ${t}`));
  lines.push("");

  lines.push("Materials:");
  if (links.length > 0) {
    lines.push("  Links (Claude can open these directly):");
    links.forEach((m) =>
      lines.push(`    - ${m.ref.trim()}${m.note?.trim() ? ` — ${m.note.trim()}` : ""}`),
    );
  }
  if (files.length > 0) {
    lines.push("  Files (attached to this email):");
    files.forEach((m) =>
      lines.push(`    - ${m.ref.trim()}${m.note?.trim() ? ` — ${m.note.trim()}` : ""}`),
    );
  }
  lines.push("");

  if (brief.feel.trim()) {
    lines.push(`Feel / brand notes: ${brief.feel.trim()}`);
  }
  if (brief.notes.trim()) {
    lines.push(`Must include / leave out: ${brief.notes.trim()}`);
  }
  if (brief.feel.trim() || brief.notes.trim()) lines.push("");

  lines.push(
    `Scope: ${scope.topics} topic${scope.topics === 1 ? "" : "s"}, ${scope.links} link${
      scope.links === 1 ? "" : "s"
    }, ${scope.files} file${scope.files === 1 ? "" : "s"}.`,
  );
  lines.push(
    "Submitted via Robocor Creator Tools. Build with the publish-guide-draft skill: scope and section it, then design show, don't tell.",
  );

  return lines.join("\n");
}

export function submissionFileName(brief: GuideBrief): string {
  const slug =
    brief.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "guide";
  return `${slug}-brief.txt`;
}
