import {
  newBlock,
  newLesson,
  type CourseDraft,
  type DraftBlock,
  type DraftBlockType,
  type LessonDraft,
} from "./draftTypes";

function moveItem<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const j = index + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = arr.slice();
  [next[index], next[j]] = [next[j], next[index]];
  return next;
}

type SetCourse = (updater: (prev: CourseDraft) => CourseDraft) => void;

export interface BuilderActions {
  setField: (patch: Partial<CourseDraft>) => void;
  addLesson: () => void;
  removeLesson: (lessonId: string) => void;
  moveLesson: (index: number, dir: -1 | 1) => void;
  updateLesson: (lessonId: string, patch: Partial<LessonDraft>) => void;
  addBlock: (lessonId: string, type: DraftBlockType) => void;
  removeBlock: (lessonId: string, blockId: string) => void;
  moveBlock: (lessonId: string, index: number, dir: -1 | 1) => void;
  updateBlock: (lessonId: string, next: DraftBlock) => void;
}

function mapLesson(
  course: CourseDraft,
  lessonId: string,
  fn: (l: LessonDraft) => LessonDraft,
): CourseDraft {
  return {
    ...course,
    lessons: course.lessons.map((l) => (l.id === lessonId ? fn(l) : l)),
  };
}

export function createActions(setCourse: SetCourse): BuilderActions {
  return {
    setField: (patch) => setCourse((c) => ({ ...c, ...patch })),

    addLesson: () =>
      setCourse((c) => ({ ...c, lessons: [...c.lessons, newLesson()] })),

    removeLesson: (lessonId) =>
      setCourse((c) => ({
        ...c,
        lessons: c.lessons.filter((l) => l.id !== lessonId),
      })),

    moveLesson: (index, dir) =>
      setCourse((c) => ({ ...c, lessons: moveItem(c.lessons, index, dir) })),

    updateLesson: (lessonId, patch) =>
      setCourse((c) => mapLesson(c, lessonId, (l) => ({ ...l, ...patch }))),

    addBlock: (lessonId, type) =>
      setCourse((c) =>
        mapLesson(c, lessonId, (l) => ({
          ...l,
          blocks: [...l.blocks, newBlock(type)],
        })),
      ),

    removeBlock: (lessonId, blockId) =>
      setCourse((c) =>
        mapLesson(c, lessonId, (l) => ({
          ...l,
          blocks: l.blocks.filter((b) => b.id !== blockId),
        })),
      ),

    moveBlock: (lessonId, index, dir) =>
      setCourse((c) =>
        mapLesson(c, lessonId, (l) => ({
          ...l,
          blocks: moveItem(l.blocks, index, dir),
        })),
      ),

    updateBlock: (lessonId, next) =>
      setCourse((c) =>
        mapLesson(c, lessonId, (l) => ({
          ...l,
          blocks: l.blocks.map((b) => (b.id === next.id ? next : b)),
        })),
      ),
  };
}
