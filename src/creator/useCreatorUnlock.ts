import { useCallback, useSyncExternalStore } from "react";

// Lightweight creator gate. NOT security and not authentication: it only keeps
// ordinary learners out of the drafting tools. The unlocked flag lives in
// localStorage on this device.

const KEY = "robocor-creator-unlocked";

/** The expected passcode. Configurable via env; a local fallback is used so the
 *  gate works in development without setup. This is intentionally not a secret. */
export function creatorPasscode(): string {
  return import.meta.env.VITE_CREATOR_PASSCODE || "2468";
}

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
function getSnapshot(): boolean {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function useCreatorUnlock() {
  const unlocked = useSyncExternalStore(subscribe, getSnapshot, () => false);

  /** Returns true if the passcode matched and the tools are now unlocked. */
  const tryUnlock = useCallback((code: string): boolean => {
    if (code.trim() === creatorPasscode()) {
      try {
        localStorage.setItem(KEY, "true");
      } catch {
        /* ignore */
      }
      emit();
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    emit();
  }, []);

  return { unlocked, tryUnlock, lock };
}
