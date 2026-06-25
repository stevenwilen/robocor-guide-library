// Converts a builder draft into the guide draft export envelope.
//
// The output is self-identifying (_type / claudeSkill) so Claude can recognize
// and integrate it later even with no other context. The `guide` object uses
// guide/section vocabulary; ids are kebab-cased and content blocks are
// converted to published LessonSection shapes so integration into
// src/data/courses.ts is straightforward.

import type { ImageRef, LessonSection } from "../data/types";
import type { CourseDraft, DraftBlock, DraftImage } from "./draftTypes";

export interface AssetEntry {
  blockId: string;
  fileName: string;
  intendedPath: string;
  needsUpload: true;
}

export interface GuideDraftExport {
  _type: "robocor_guide_draft";
  schemaVersion: "2.0";
  submissionStatus: "pending_approval";
  intendedAction: "review_and_publish_to_guide_library";
  claudeSkill: "publish-guide-draft";
  createdAt: string;
  updatedAt: string;
  guide: Record<string, unknown>;
  assets: AssetEntry[];
  notesForPublisher: string[];
}

export function kebab(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "untitled"
  );
}

/** Extract a YouTube id from a URL, or return the input if it already looks
 *  like a bare id. */
export function parseYouTube(input: string): string {
  const s = input.trim();
  const patterns = [
    /[?&]v=([\w-]{6,})/,
    /youtu\.be\/([\w-]{6,})/,
    /embed\/([\w-]{6,})/,
    /shorts\/([\w-]{6,})/,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return s;
}

function isUrl(s: string): boolean {
  return /^https?:\/\//i.test(s.trim());
}

// Resolve a draft image into a published ImageRef and, when a file still has to
// be supplied, an asset entry. Never invents an uploaded URL.
function resolveImage(img: DraftImage): { ref: ImageRef; asset?: AssetEntry } {
  const value = img.pathOrUrl.trim();
  const alt = img.alt.trim();
  const caption = img.caption?.trim() || undefined;

  // A local file was chosen — the file must travel with the draft.
  if (img.fileName) {
    const intendedPath =
      value && !isUrl(value) ? value : `/images/${img.fileName}`;
    return {
      ref: { fileName: img.fileName, intendedPath, alt, caption, needsUpload: true },
      asset: { blockId: img.id, fileName: img.fileName, intendedPath, needsUpload: true },
    };
  }

  // A usable URL was typed — safe to reference directly.
  if (isUrl(value)) {
    return { ref: { src: value, alt, caption } };
  }

  // A path string with no file yet — record it as needing upload.
  const intendedPath = value || "/images/REPLACE_ME.png";
  return {
    ref: { intendedPath, alt, caption, needsUpload: true },
    asset: { blockId: img.id, fileName: "", intendedPath, needsUpload: true },
  };
}

function blockToSection(
  block: DraftBlock,
  assets: AssetEntry[],
): LessonSection | null {
  switch (block.type) {
    case "paragraph":
      return {
        type: "paragraph",
        heading: block.heading?.trim() || undefined,
        text: block.text.trim(),
      };
    case "video":
      return {
        type: "video",
        title: block.caption?.trim() || "Video walkthrough",
        youtubeId: parseYouTube(block.youtube),
        style: block.style,
        note: block.caption?.trim() || undefined,
      };
    case "image": {
      const { ref, asset } = resolveImage(block.image);
      if (asset) assets.push(asset);
      return { type: "image", layout: block.layout, ...ref };
    }
    case "gallery": {
      const images = block.images.map((im) => {
        const { ref, asset } = resolveImage(im);
        if (asset) assets.push(asset);
        return ref;
      });
      return {
        type: "gallery",
        heading: block.heading?.trim() || undefined,
        images,
      };
    }
    case "checklist":
      return {
        type: "steps",
        steps: block.items
          .map((t) => t.trim())
          .filter(Boolean)
          .map((title) => ({ title })),
      };
    case "keyNotes":
      return {
        type: "keyNotes",
        notes: block.notes.map((n) => n.trim()).filter(Boolean),
      };
    case "callout":
      return {
        type: "callout",
        tone: block.tone,
        heading: block.title?.trim() || undefined,
        text: block.body.trim(),
      };
    default:
      return null;
  }
}

export function buildExport(
  course: CourseDraft,
  meta: { createdAt: string; updatedAt: string },
): GuideDraftExport {
  const assets: AssetEntry[] = [];

  const sections = course.lessons.map((lesson, i) => {
    const base = {
      id: kebab(lesson.title),
      number: i + 1,
      title: lesson.title.trim(),
      summary: lesson.description.trim(),
      // Published contentStatus equivalent kept for easy integration.
      contentStatus: lesson.status,
      state: lesson.status === "available" ? "ready" : "needs_info",
    };
    if (lesson.status === "pending") {
      return { ...base, infoNeeded: lesson.pendingNote?.trim() || "" };
    }
    return {
      ...base,
      blocks: lesson.blocks
        .map((b) => blockToSection(b, assets))
        .filter(Boolean),
    };
  });

  const notesForPublisher: string[] = [
    "This is a structured guide draft. The final published guide may be redesigned and polished before it goes live.",
    "Reading level and duration were intentionally omitted in the Builder — add them when publishing if the design needs them.",
  ];
  if (assets.length > 0) {
    notesForPublisher.push(
      `${assets.length} image asset(s) still need files supplied (see the assets array). Do not assume these images exist.`,
    );
  }
  const needsInfo = course.lessons.filter((l) => l.status === "pending");
  if (needsInfo.length > 0) {
    notesForPublisher.push(
      `${needsInfo.length} section(s) need more info and should stay planned/pending until content is provided.`,
    );
  }

  return {
    _type: "robocor_guide_draft",
    schemaVersion: "2.0",
    submissionStatus: "pending_approval",
    intendedAction: "review_and_publish_to_guide_library",
    claudeSkill: "publish-guide-draft",
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt,
    guide: {
      id: kebab(course.title),
      title: course.title.trim(),
      description: course.description.trim(),
      subtitle: course.description.trim(),
      intendedReader: course.audience,
      image: course.bannerImage?.trim() || undefined,
      sections,
    },
    assets,
    notesForPublisher,
  };
}

export function toJSON(exportDoc: GuideDraftExport): string {
  return JSON.stringify(exportDoc, null, 2);
}
