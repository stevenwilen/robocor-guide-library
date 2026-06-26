import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircleIcon } from "./icons";

// Small, calm save feedback shared by the Creator Tools flows: an inline status
// near the Save button and a brief toast. No animation is added, so the app's
// reduced-motion setting is respected by default.

export type SaveState = "saved" | "unsaved" | "cleared" | "pending_approval";

/** Format a stored ISO timestamp as a local time like "2:14 PM". */
export function formatSavedTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/** A brief, auto-dismissing toast message. */
export function useToast(timeoutMs = 3000) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (msg: string) => {
      setMessage(msg);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(null), timeoutMs);
    },
    [timeoutMs],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { message, show };
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
    >
      <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-panel dark:bg-slate-100 dark:text-slate-900">
        <CheckCircleIcon className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
        {message}
      </div>
    </div>
  );
}

/** Inline status shown next to the Save button so feedback is visible without
 *  scrolling back to the top of the page. */
export function SaveIndicator({
  status,
  savedTime,
}: {
  status: SaveState;
  savedTime?: string;
}) {
  if (status === "unsaved") {
    return (
      <span className="inline-flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
        Unsaved changes
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircleIcon className="h-3.5 w-3.5" />
        Saved locally{savedTime ? ` at ${savedTime}` : ""}
      </span>
    );
  }
  if (status === "pending_approval") {
    return (
      <span className="inline-flex items-center text-xs font-medium text-accent dark:text-accent-soft">
        Pending approval
      </span>
    );
  }
  return null;
}
