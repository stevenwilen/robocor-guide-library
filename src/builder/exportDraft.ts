// Converts a builder draft into the published-shaped export envelope.
//
// The output is self-identifying (_type / claudeSkill) so Claude can recognize
// and integrate it later even with no other context. The `course` object
// closely resembles the published Course in src/data/types.ts; ids are
// kebab-cased and content blocks are converted to published LessonSection
// shapes so integration into src/data/courses.ts is near copy-paste.

import type { ImageRef, LessonSection } from "../data/types";
import type { CourseDraft, DraftBlock, DraftImage } from "./draftTypes";

export interface AssetEntry {
  blockId: string;
  fileName: string;
  intendedPath: string;
  needsUpload: true;
}

export interface CourseDraftExport {
  _type: "robocor_course_draft";
  schemaVersion: "1.0";
  submissionStatus: "pending_approval";
  intendedAction: "review_and_publish_to_guide_library";
  claudeSkill: "publish-course-draft";
  createdAt: string;
  updatedAt: string;
  course: Record<string, unknown>;
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
    case "heading":
      return { type: "heading", text: block.text.trim() };
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
    case "divider":
      return { type: "divider" };
    case "pendingNote":
      return { type: "pendingNote", text: block.text.trim() };
    default:
      return null;
  }
}

export function buildExport(
  course: CourseDraft,
  meta: { createdAt: string; updatedAt: string },
): CourseDraftExport {
  const assets: AssetEntry[] = [];

  const lessons = course.lessons.map((lesson, i) => {
    const base = {
      id: kebab(lesson.title),
      number: i + 1,
      title: lesson.title.trim(),
      summary: lesson.goal.trim(),
      contentStatus: lesson.status,
    };
    if (lesson.status === "pending") {
      return { ...base, pendingNote: lesson.pendingNote?.trim() || "" };
    }
    return {
      ...base,
      sections: lesson.blocks
        .map((b) => blockToSection(b, assets))
        .filter(Boolean),
    };
  });

  const notesForPublisher: string[] = [
    "Course level and duration were intentionally omitted in the Builder — add them when publishing if the design needs them.",
    "This is a structured draft. The final published course may be redesigned and polished before it goes live.",
  ];
  if (assets.length > 0) {
    notesForPublisher.push(
      `${assets.length} image asset(s) still need files supplied (see the assets array). Do not assume these images exist.`,
    );
  }
  const pendingLessons = course.lessons.filter((l) => l.status === "pending");
  if (pendingLessons.length > 0) {
    notesForPublisher.push(
      `${pendingLessons.length} lesson(s) are pending and should stay pending until content is provided.`,
    );
  }

  return {
    _type: "robocor_course_draft",
    schemaVersion: "1.0",
    submissionStatus: "pending_approval",
    intendedAction: "review_and_publish_to_guide_library",
    claudeSkill: "publish-course-draft",
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt,
    course: {
      id: kebab(course.title),
      title: course.title.trim(),
      subtitle: course.description.trim(),
      description: course.description.trim(),
      about: course.goal.trim() ? [course.goal.trim()] : [],
      audience: course.audience,
      goal: course.goal.trim(),
      status: course.status,
      image: course.bannerImage?.trim() || undefined,
      lessons,
    },
    assets,
    notesForPublisher,
  };
}

export function toJSON(exportDoc: CourseDraftExport): string {
  return JSON.stringify(exportDoc, null, 2);
}
