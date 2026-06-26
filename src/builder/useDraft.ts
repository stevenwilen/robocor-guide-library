import { useCallback, useState } from "react";
import { emptyCourse, type CourseDraft, type DraftDocument } from "./draftTypes";

// Local-only working draft for the Guide Builder. One draft per device, stored
// in localStorage. Image preview object URLs are NEVER stored here — they live
// in component state and are not persisted.

const KEY = "robocor-guide-draft";

export type SaveStatus = "saved" | "unsaved" | "cleared";

function now(): string {
  return new Date().toISOString();
}

function readDoc(): DraftDocument | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftDocument;
    if (!parsed || typeof parsed !== "object" || !parsed.course) return null;
    return parsed;
  } catch {
    return null;
  }
}

function freshDoc(): DraftDocument {
  return { course: emptyCourse(), createdAt: now(), updatedAt: now() };
}

export function useDraft() {
  const [doc, setDoc] = useState<DraftDocument>(() => readDoc() ?? freshDoc());
  const [status, setStatus] = useState<SaveStatus>(() =>
    readDoc() ? "saved" : "unsaved",
  );
  const [savedExists, setSavedExists] = useState<boolean>(
    () => readDoc() != null,
  );

  const setCourse = useCallback(
    (updater: CourseDraft | ((prev: CourseDraft) => CourseDraft)) => {
      setDoc((prev) => ({
        ...prev,
        course:
          typeof updater === "function"
            ? (updater as (p: CourseDraft) => CourseDraft)(prev.course)
            : updater,
      }));
      setStatus("unsaved");
    },
    [],
  );

  const save = useCallback(() => {
    setDoc((prev) => {
      const next = { ...prev, updatedAt: now() };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* localStorage may be unavailable; UI still has Copy/Download */
      }
      return next;
    });
    setSavedExists(true);
    setStatus("saved");
  }, []);

  const loadSaved = useCallback(() => {
    const saved = readDoc();
    if (saved) {
      setDoc(saved);
      setStatus("saved");
      setSavedExists(true);
      return true;
    }
    return false;
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setDoc(freshDoc());
    setSavedExists(false);
    setStatus("cleared");
  }, []);

  return {
    course: doc.course,
    doc,
    status,
    savedExists,
    setCourse,
    save,
    loadSaved,
    clear,
  };
}
