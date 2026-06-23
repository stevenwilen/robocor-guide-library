// Lightweight local knowledge check for the Morpheus Drive guide.
// Questions are grounded ONLY in current Lesson 1 content and the honest
// project state (pending app lessons). No invented technical details:
// nothing about exact wiring labels, battery specs, reset behavior, or app
// controls. Update these as more lessons are added.

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  /** Index of the correct option. */
  answerIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export const morpheusQuiz: Quiz = {
  id: "morpheus-drive-knowledge-check",
  title: "Morpheus Drive Knowledge Check",
  questions: [
    {
      id: "q1",
      question: "What does Lesson 1 help you set up?",
      options: [
        "The Morpheus Drive hardware",
        "An online account",
        "Cloud reporting and analytics",
        "User permissions",
      ],
      answerIndex: 0,
    },
    {
      id: "q2",
      question:
        "In the Lesson 1 walkthrough, which components are connected to the Morpheus Drive?",
      options: [
        "A camera and a speaker",
        "Two motors and a battery",
        "A keyboard and a mouse",
        "Two displays",
      ],
      answerIndex: 1,
    },
    {
      id: "q3",
      question: "Before moving on from the hardware setup, you should:",
      options: [
        "Create an online account",
        "Submit a report",
        "Confirm the system shows it is ready",
        "Skip straight to the app",
      ],
      answerIndex: 2,
    },
    {
      id: "q4",
      question: "What is the role of the setup video in Lesson 1?",
      options: [
        "To walk you through the hardware setup",
        "To configure user accounts",
        "To display usage analytics",
        "To sell additional products",
      ],
      answerIndex: 0,
    },
    {
      id: "q5",
      question: "Why are Lessons 2 and 3 (the app lessons) currently pending?",
      options: [
        "They were removed permanently",
        "They require a paid account",
        "They are reserved for the updated app workflow",
        "They need a user login",
      ],
      answerIndex: 2,
    },
  ],
};
