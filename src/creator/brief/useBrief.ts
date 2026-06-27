import { useCallback, useState } from "react";
import { emptyBrief, type BriefDocument, type GuideBrief } from "./briefTypes";

// Local-only working brief. One per device, stored in localStorage.

const KEY = "robocor-guide-brief";

export type BriefStatus = "saved" | "unsaved" | "cleared";

function now(): string {
  return new Date().toISOString();
}

function readDoc(): BriefDocument | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BriefDocument;
    if (!parsed || typeof parsed !== "object" || !parsed.brief) return null;
    return parsed;
  } catch {
    return null;
  }
}

function freshDoc(): BriefDocument {
  return { brief: emptyBrief(), createdAt: now(), updatedAt: now() };
}

export function useBrief() {
  const [doc, setDoc] = useState<BriefDocument>(() => readDoc() ?? freshDoc());
  const [status, setStatus] = useState<BriefStatus>(() =>
    readDoc() ? "saved" : "unsaved",
  );

  const setBrief = useCallback(
    (updater: GuideBrief | ((prev: GuideBrief) => GuideBrief)) => {
      setDoc((prev) => ({
        ...prev,
        brief:
          typeof updater === "function"
            ? (updater as (p: GuideBrief) => GuideBrief)(prev.brief)
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
        /* localStorage may be unavailable; Copy/Download still work */
      }
      return next;
    });
    setStatus("saved");
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setDoc(freshDoc());
    setStatus("cleared");
  }, []);

  return { brief: doc.brief, doc, status, setBrief, save, clear };
}
