import type { Course, PlannedCourse } from "./types";

// ============================================================================
// HOW TO EDIT THIS FILE
// ----------------------------------------------------------------------------
// All course + lesson content lives here. To add a course, push another object
// onto the `courses` array. To edit a lesson, change its `sections`.
//
// `contentStatus`:
//   "available" -> the lesson renders its `sections`.
//   "pending"   -> the lesson renders a structured pending state using
//                  `pendingNote`. Use this for content that is not finalized.
//
// User completion is separate and is stored in the browser (localStorage),
// keyed by lesson `id`. It is never set here.
//
// DRAFT markers: lines tagged `// DRAFT:` are placeholder copy expanded from
// the source notes/screenshots. They are practical but meant to be replaced
// with final wording when it is confirmed.
// ============================================================================

export const courses: Course[] = [
  {
    id: "morpheus-drive",
    quizId: "morpheus-drive-knowledge-check",
    title: "Morpheus Drive",
    subtitle: "Quick-start setup and reference guide",
    level: "Beginner",
    durationLabel: "~1 hour",
    // Banner image lives in public/images/ and is served at this root path.
    image: "/images/morpheus-drive.png",
    heroEyebrow: "Guide",
    description:
      "Set up the Morpheus Drive hardware and get the system running with minimal setup.",
    about: [
      "This guide shows how to quickly set up and use the Morpheus Drive.",
      // DRAFT: high-level outcome summary expanded from the course overview note.
      "You will connect the motors and power on the system, then move on to the app workflow once it is confirmed. The focus is on getting the system running with minimal setup.",
    ],
    helpsWith: [
      "Set up the Morpheus Drive hardware",
      "Confirm the motors and power are connected correctly",
      "Prepare for the updated app connection workflow",
      "Keep the guide ready for future lessons",
    ],
    lessons: [
      // ----------------------------------------------------------------------
      // LESSON 1 — fully built (content available)
      // ----------------------------------------------------------------------
      {
        id: "hardware-setup",
        number: 1,
        title: "Morpheus Drive Hardware Setup",
        summary:
          "Connect two motors and a battery to the Morpheus Drive and confirm the system powers on.",
        contentStatus: "available",
        // NOTE: no per-lesson duration shown — a time estimate for this lesson
        // is not source-confirmed. (The video's own 3:14 runtime is reference-
        // sourced and lives on the video block below.)
        sections: [
          {
            // Reference-sourced (morpheus-final-section-1.png).
            type: "paragraph",
            heading: "Overview",
            text: "This walkthrough shows how to connect two motors and a battery to the Morpheus Drive. Follow along with the video to complete the setup.",
          },
          {
            // Reference-sourced title + runtime (3:14, from the screenshot).
            // Real setup video. The embed URL is
            // https://www.youtube.com/embed/<youtubeId>.
            type: "video",
            title: "Steven – Morpheus Drive Setup",
            youtubeId: "Ay3YeL9tJZM",
            durationLabel: "3:14",
            note: "Additional reference photos can be added later if needed.",
          },
          {
            // DRAFT / CONFIRMABLE: action sequence derived from the setup notes.
            // Kept deliberately generic. Specific terminal labels, wiring,
            // battery specs, and reset behavior are NOT invented here — they
            // live in "Key notes" (reference-sourced) and should be confirmed
            // with the client before this reads as final.
            type: "steps",
            heading: "Hardware setup checklist",
            steps: [
              {
                title: "Prepare the components",
                detail:
                  "Have the two motors and the battery ready before you begin.",
              },
              {
                title: "Connect the motors",
                detail:
                  "Connect each motor to its terminal pair on the Morpheus Drive.",
              },
              {
                title: "Connect the battery and power on",
                detail: "Connect the battery, then power on the system.",
              },
              {
                title: "Confirm the system is ready",
                detail:
                  "Check the status light to confirm the system is ready before moving on.",
              },
            ],
          },
          {
            // Reference-sourced cautions, reminders, and specific details
            // (morpheus-final-section-1.png). These hold the specifics so the
            // checklist above can stay generic and avoid duplication.
            // ("main" power wire softened to "power wire" — the source text was
            // partially cut off in the screenshot.)
            type: "keyNotes",
            heading: "Key notes",
            notes: [
              "Each motor connects to one pair of terminals labeled M+ and M-.",
              "Make sure all wires are secured tightly before powering the system.",
              "Press the reset button after connecting power.",
              "A blinking blue light indicates the system is ready.",
              "If a motor spins in the wrong direction, swap the two wires.",
              "Optional: add a switch to the power wire for easy on/off control.",
            ],
          },
          {
            // CONFIRMABLE: ready indicator attributed to the setup notes rather
            // than stated as a hard guarantee.
            type: "callout",
            tone: "tip",
            heading: "Ready check",
            text: "Confirm the system shows it is ready before continuing. The setup notes describe a blinking blue light as the ready indicator. Check that this matches your unit.",
          },
        ],
      },

      // ----------------------------------------------------------------------
      // LESSON 2 — planned / pending (app workflow changed)
      // ----------------------------------------------------------------------
      {
        id: "connecting-to-the-app",
        number: 2,
        title: "Connecting Morpheus Drive to the App",
        summary:
          "Pair the Morpheus Drive with the app and confirm the connection.",
        contentStatus: "pending",
        pendingNote:
          "Reserved for the updated CoreOS app connection process. This lesson can be completed after the new app flow is confirmed.",
        contentNeeded: [
          "Updated app walkthrough",
          "Connection steps",
          "Screenshots or screen recording",
          "Common pairing issues",
        ],
      },

      // ----------------------------------------------------------------------
      // LESSON 3 — planned / pending (app workflow changed)
      // ----------------------------------------------------------------------
      {
        id: "navigating-the-app",
        number: 3,
        title: "Navigating the App",
        summary:
          "Move through the app to scan the environment and control movement.",
        contentStatus: "pending",
        pendingNote:
          "Reserved for the updated app workflow. This lesson can be completed after the new app flow is confirmed.",
        contentNeeded: [
          "Updated app screen flow",
          "Navigation walkthrough",
          "App controls or feature list",
          "Common user questions",
        ],
      },
    ],
  },
];

// Courses the library is structured to support but that are not built yet.
// These render as clearly-labeled planned cards on the directory — never as
// active, clickable courses. Describe intended scope only, not real content.
export const plannedCourses: PlannedCourse[] = [
  {
    id: "coreos-app-walkthrough",
    title: "CoreOS App Walkthrough",
    description:
      "Planned walkthrough of the updated app connection and setup flow.",
    status: "Pending updated app workflow",
  },
  {
    id: "robot-build-reference",
    title: "Robot Build Reference",
    description:
      "Planned reference for assembling and wiring the robot hardware.",
    status: "Available as future guide",
  },
  {
    id: "troubleshooting-guide",
    title: "Troubleshooting Guide",
    description:
      "Planned guide for common setup, power, and connection issues.",
    status: "Can be added later",
  },
];

// --- Lookup helpers -------------------------------------------------------

export function getCourse(courseId: string | undefined): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export function getLesson(courseId: string | undefined, lessonId: string | undefined) {
  const course = getCourse(courseId);
  const lesson = course?.lessons.find((l) => l.id === lessonId);
  return { course, lesson };
}
