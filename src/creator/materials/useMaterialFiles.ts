import { useCallback, useRef, useState } from "react";
import type { Material } from "./types";

// Holds the actual File objects for "file" materials in memory only (never
// localStorage / base64). `attached` mirrors which material ids currently hold a
// file so the UI can react. Used by both creator flows with MaterialsEditor.

export function useMaterialFiles() {
  const filesRef = useRef<Map<string, File>>(new Map());
  const [attached, setAttached] = useState<Set<string>>(new Set());

  const pickFile = useCallback((id: string, file: File) => {
    filesRef.current.set(id, file);
    setAttached((prev) => new Set(prev).add(id));
  }, []);

  const dropFile = useCallback((id: string) => {
    filesRef.current.delete(id);
    setAttached((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const resetFiles = useCallback(() => {
    filesRef.current.clear();
    setAttached(new Set());
  }, []);

  const collectFiles = useCallback(
    (materials: Material[]): File[] =>
      materials
        .filter((m) => m.kind === "file")
        .map((m) => filesRef.current.get(m.id))
        .filter((f): f is File => Boolean(f)),
    [],
  );

  // File materials that have a name but no in-memory file (e.g. after a reload):
  // they must be re-selected before submitting.
  const missingFiles = useCallback(
    (materials: Material[]): Material[] =>
      materials.filter(
        (m) => m.kind === "file" && m.ref.trim() !== "" && !attached.has(m.id),
      ),
    [attached],
  );

  return { attached, pickFile, dropFile, resetFiles, collectFiles, missingFiles };
}
