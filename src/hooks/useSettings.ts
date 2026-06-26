import { useCallback, useSyncExternalStore } from "react";

// Local display / accessibility settings, applied to the document root.
// Stored in the browser only - no backend, no accounts.

export type TextSize = "default" | "large";
export type Theme = "light" | "dark" | "system";

export interface DisplaySettings {
  textSize: TextSize;
  theme: Theme;
  reducedMotion: boolean;
  highContrast: boolean;
}

const STORAGE_KEY = "robocor-display-settings";

const DEFAULTS: DisplaySettings = {
  textSize: "default",
  theme: "light",
  reducedMotion: false,
  highContrast: false,
};

function load(): DisplaySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<DisplaySettings>) };
  } catch {
    return DEFAULTS;
  }
}

function prefersDark(): boolean {
  return Boolean(
    typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches,
  );
}

function applyToDocument(s: DisplaySettings) {
  const root = document.documentElement;
  root.style.fontSize = s.textSize === "large" ? "18px" : "";
  const dark = s.theme === "dark" || (s.theme === "system" && prefersDark());
  root.classList.toggle("dark", dark);
  root.classList.toggle("reduce-motion", s.reducedMotion);
  root.classList.toggle("high-contrast", s.highContrast);
  root.style.colorScheme = dark ? "dark" : "light";
}

let state = load();
const listeners = new Set<() => void>();
let systemListenerAttached = false;

function emitAndApply() {
  applyToDocument(state);
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable; keep in-memory for this session
  }
}

// Call once at startup (before first paint) to apply saved settings and react
// to OS theme changes when theme is "system".
export function initSettings() {
  applyToDocument(state);
  if (!systemListenerAttached && typeof window !== "undefined") {
    window
      .matchMedia?.("(prefers-color-scheme: dark)")
      .addEventListener?.("change", () => {
        if (state.theme === "system") applyToDocument(state);
      });
    systemListenerAttached = true;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useSettings() {
  const settings = useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );

  const update = useCallback((patch: Partial<DisplaySettings>) => {
    state = { ...state, ...patch };
    persist();
    emitAndApply();
  }, []);

  return { settings, update };
}
