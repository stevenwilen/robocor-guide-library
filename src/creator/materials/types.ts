// A "material" is one piece of source/support content the creator hands over:
// a link Claude can fetch, or a local file attached to the submission. Shared by
// the New Guide brief and the Update Existing Guide request.

export interface Material {
  id: string;
  /** A link Claude can fetch, or a file that travels with the submission. */
  kind: "link" | "file";
  /** URL (for a link) or file name (for a file). */
  ref: string;
  /** Optional note on what this material is / how to use it. */
  note?: string;
}

let counter = 0;
export function uid(prefix = "mat"): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
    }
  } catch {
    /* fall through */
  }
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter}`;
}

export function newMaterial(kind: "link" | "file" = "link"): Material {
  return { id: uid(), kind, ref: "", note: "" };
}

export function cleanMaterials(materials: Material[]): Material[] {
  return materials.filter((m) => m.ref.trim());
}
