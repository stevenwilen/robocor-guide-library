// Honest, locally-evaluated completion certificates.
//
// A certificate is a lightweight local completion card - NOT an account-verified
// credential. Each definition declares exactly which locally-completed lessons
// (and optionally the course quiz) unlock it. Unlock state lives in localStorage
// (see CertificatesPage), never on a server.
//
// HONESTY RULE: a certificate may only cover lessons that are actually
// "available" and finished. Do not define a full-course certificate that
// depends on lessons still marked "pending" - scope it to the completed
// available lessons instead.

export interface CertificateDef {
  id: string;
  courseId: string;
  /** Headline shown on the completion card, e.g. "Morpheus Drive Hardware Setup". */
  title: string;
  /** Short scope label, e.g. "Hardware Setup". */
  scopeLabel: string;
  /** Lessons that must be locally complete to unlock. */
  requiredLessonIds: string[];
  /** When true, the course quiz must also have been taken. */
  requiresQuiz?: boolean;
}

// Morpheus Drive: scoped to Lesson 1 (hardware-setup) + the knowledge check.
// This mirrors the original CertificatesPage behavior exactly
// (unlocked = hardware-setup complete AND quiz taken).
export const certificates: CertificateDef[] = [
  {
    id: "morpheus-drive-hardware-setup",
    courseId: "morpheus-drive",
    title: "Morpheus Drive Hardware Setup",
    scopeLabel: "Hardware Setup",
    requiredLessonIds: ["hardware-setup"],
    requiresQuiz: true,
  },
  // Using AI for Repeated Staff Work: both lessons are available, so this
  // covers the full guide plus the knowledge check.
  {
    id: "using-ai-for-repeated-staff-work-completion",
    courseId: "using-ai-for-repeated-staff-work",
    title: "Using AI for Repeated Staff Work",
    scopeLabel: "Core Lessons",
    requiredLessonIds: [
      "finding-work-ai-can-help-with",
      "writing-a-better-prompt",
    ],
    requiresQuiz: true,
  },
];

export function getCertificatesForCourse(courseId: string): CertificateDef[] {
  return certificates.filter((c) => c.courseId === courseId);
}
