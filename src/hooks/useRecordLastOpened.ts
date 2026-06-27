import { useEffect } from "react";
import { usePersistentState } from "./usePersistentState";
import { LAST_OPENED_GUIDE, type LastOpenedGuide } from "../data/storageKeys";

// Records the guide the learner is currently viewing (overview or a section)
// so the Dashboard can offer a real "Continue learning" card. Local only.
export function useRecordLastOpened(guideId: string | undefined) {
  const [, setLastOpened] = usePersistentState<LastOpenedGuide>(
    LAST_OPENED_GUIDE,
    null,
  );
  useEffect(() => {
    if (guideId) setLastOpened({ id: guideId, at: new Date().toISOString() });
    // setLastOpened is stable from the shared store; depend only on guideId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideId]);
}
