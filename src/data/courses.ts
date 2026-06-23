import type { Course } from "./types";

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
    title: "Morpheus Drive",
    subtitle: "Quick-start setup and reference guide",
    level: "Beginner",
    durationLabel: "~1 hour",
    heroEyebrow: "Course",
    description:
      "Set up the Morpheus Drive hardware and get the system running with minimal setup.",
    about: [
      "This course shows how to quickly set up and use the Morpheus Drive.",
      // DRAFT: high-level outcome summary expanded from the course overview note.
      "You will connect the motors and power on the system, then move on to the app workflow once it is confirmed. The focus is on getting the system running with minimal setup.",
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
        durationLabel: "~15 min",
        sections: [
          {
            type: "paragraph",
            heading: "Overview",
            text: "This walkthrough shows how to connect two motors and a battery to the Morpheus Drive. Follow along with the video to complete the setup.",
          },
          {
            type: "video",
            title: "Morpheus Drive Setup",
            durationLabel: "3:14",
            note: "Video walkthrough placeholder — final recording to be embedded here.",
          },
          {
            // DRAFT: practical step list derived from the setup key notes.
            // Replace with the finalized hardware steps when confirmed.
            type: "steps",
            heading: "Setup steps",
            steps: [
              {
                title: "Connect the motors",
                detail:
                  "Each motor connects to one pair of terminals labeled M+ and M-. Connect both motors to their terminal pairs.",
              },
              {
                title: "Secure the wiring",
                detail:
                  "Make sure all wires are secured tightly before powering the system.",
              },
              {
                title: "Connect the battery and power on",
                detail:
                  "Connect the battery, then press the reset button after connecting power.",
              },
              {
                title: "Confirm the system is ready",
                detail:
                  "A blinking blue light indicates the system is ready.",
              },
            ],
          },
          {
            type: "keyNotes",
            heading: "Key notes",
            notes: [
              "Each motor connects to one pair of terminals labeled M+ and M-.",
              "Make sure all wires are secured tightly before powering the system.",
              "Press the reset button after connecting power.",
              "A blinking blue light indicates the system is ready.",
              "If a motor spins in the wrong direction, swap the two wires.",
              "Optional: add a switch to the main power wire for easy on/off control.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            heading: "Before you continue",
            text: "Confirm the blinking blue light before moving on. If the light does not appear, recheck the battery connection and the reset button.",
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
      },
    ],
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
