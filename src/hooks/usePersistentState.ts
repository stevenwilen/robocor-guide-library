import { useCallback, useSyncExternalStore } from "react";

// A tiny localStorage-backed state hook with a shared module store, so multiple
// components using the same key stay in sync (e.g. the Quiz page writes a score
// and the Dashboard reads it). Browser-only — no backend, no accounts.

type Store<T> = { value: T; listeners: Set<() => void> };
const stores = new Map<string, Store<unknown>>();

function getStore<T>(key: string, initial: T): Store<T> {
  let store = stores.get(key) as Store<T> | undefined;
  if (!store) {
    let value = initial;
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) value = JSON.parse(raw) as T;
    } catch {
      // ignore unreadable/corrupt values
    }
    store = { value, listeners: new Set() };
    stores.set(key, store as Store<unknown>);
  }
  return store;
}

export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const store = getStore(key, initial);

  const subscribe = useCallback(
    (cb: () => void) => {
      store.listeners.add(cb);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          try {
            store.value =
              e.newValue != null ? (JSON.parse(e.newValue) as T) : initial;
          } catch {
            store.value = initial;
          }
          store.listeners.forEach((l) => l());
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        store.listeners.delete(cb);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key, initial, store],
  );

  const value = useSyncExternalStore(
    subscribe,
    () => store.value,
    () => store.value,
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(store.value)
          : next;
      store.value = resolved;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // storage unavailable; value stays in memory for this session
      }
      store.listeners.forEach((l) => l());
    },
    [key, store],
  );

  return [value, setValue];
}
