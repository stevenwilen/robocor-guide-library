// Centralized localStorage key builders so the Dashboard, Quizzes, and
// Certificates pages stay in sync. Local-only device state - no accounts.

/** Latest quiz score, namespaced per quiz id. */
export function quizScoreKey(quizId: string): string {
  return `robocor-quiz-score:${quizId}`;
}

/** Certificate "issued on this device" state, namespaced per certificate id. */
export function certificateKey(certificateId: string): string {
  return `robocor-certificate:${certificateId}`;
}

/** Shape of a stored quiz score. */
export type QuizScore = { score: number; total: number; date: string } | null;
