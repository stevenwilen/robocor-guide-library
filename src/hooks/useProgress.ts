import { useCallback, useSyncExternalStore } from "react";

// ============================================================================
// Local progress — the SINGLE source of truth for user lesson completion.
//
// Stored in the browser only (localStorage). This is intentionally not secure
// user tracking: clearing browser data resets it. Content state (whether a
// lesson exists) lives in src/data/courses.ts and is kept fully separate.
// ============================================================================

const STORAGE_KEY = "robocore-guide-progress";

type ProgressState = Record<string, { completedLessonIds: string[] }>;

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as ProgressState) : {};
  } catch {
    return {};
  }
}

// Module-level store so every component using the hook stays in sync.
let state: ProgressState = load();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode); progress stays in-memory.
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Keep in sync across browser tabs.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = load();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  return state;
}

export interface CourseProgress {
  completed: number;
  total: number;
  percent: number;
}

export function useProgress() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isComplete = useCallback(
    (courseId: string, lessonId: string) =>
      snapshot[courseId]?.completedLessonIds.includes(lessonId) ?? false,
    [snapshot],
  );

  const setComplete = useCallback(
    (courseId: string, lessonId: string, complete: boolean) => {
      const current = state[courseId]?.completedLessonIds ?? [];
      const next = complete
        ? Array.from(new Set([...current, lessonId]))
        : current.filter((id) => id !== lessonId);
      state = { ...state, [courseId]: { completedLessonIds: next } };
      persist();
    },
    [],
  );

  const toggleComplete = useCallback(
    (courseId: string, lessonId: string) => {
      const currentlyComplete =
        state[courseId]?.completedLessonIds.includes(lessonId) ?? false;
      setComplete(courseId, lessonId, !currentlyComplete);
    },
    [setComplete],
  );

  const courseProgress = useCallback(
    (courseId: string, total: number): CourseProgress => {
      const completedIds = snapshot[courseId]?.completedLessonIds ?? [];
      const completed = Math.min(completedIds.length, total);
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { completed, total, percent };
    },
    [snapshot],
  );

  return { isComplete, setComplete, toggleComplete, courseProgress };
}
