import { useCallback, useState } from "react";
import {
  emptyUpdateRequest,
  type UpdateRequestDocument,
  type UpdateRequestDraft,
} from "./updateTypes";

// Local-only working update request. One at a time, stored in localStorage.

const KEY = "robocor-guide-update-request";

export type RequestStatus = "saved" | "unsaved" | "cleared" | "pending_approval";

function now(): string {
  return new Date().toISOString();
}

function readDoc(): UpdateRequestDocument | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UpdateRequestDocument;
    if (!parsed || typeof parsed !== "object" || !parsed.request) return null;
    return parsed;
  } catch {
    return null;
  }
}

function freshDoc(): UpdateRequestDocument {
  return { request: emptyUpdateRequest(), createdAt: now(), updatedAt: now() };
}

export function useUpdateRequest() {
  const [doc, setDoc] = useState<UpdateRequestDocument>(
    () => readDoc() ?? freshDoc(),
  );
  const [status, setStatus] = useState<RequestStatus>(() =>
    readDoc() ? "saved" : "unsaved",
  );

  const setRequest = useCallback(
    (
      updater:
        | UpdateRequestDraft
        | ((prev: UpdateRequestDraft) => UpdateRequestDraft),
    ) => {
      setDoc((prev) => ({
        ...prev,
        request:
          typeof updater === "function"
            ? (updater as (p: UpdateRequestDraft) => UpdateRequestDraft)(
                prev.request,
              )
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
        /* ignore */
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

  const markPendingApproval = useCallback(() => {
    setDoc((prev) => {
      const next = { ...prev, updatedAt: now() };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    setStatus("pending_approval");
  }, []);

  return {
    request: doc.request,
    doc,
    status,
    setRequest,
    save,
    clear,
    markPendingApproval,
  };
}
