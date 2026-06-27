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
  /** One line shown on the index card: what taking this check confirms. */
  description?: string;
  questions: QuizQuestion[];
}

export const morpheusQuiz: Quiz = {
  id: "morpheus-drive-knowledge-check",
  title: "Morpheus Drive Knowledge Check",
  description: "Confirms you understood the Lesson 1 hardware setup.",
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

// Knowledge check for the "Using AI for Repeated Staff Work" guide. Questions
// are grounded ONLY in that guide's two sections (finding work AI can help with,
// and writing a better prompt). No invented details.
export const aiStaffWorkQuiz: Quiz = {
  id: "using-ai-for-repeated-staff-work-knowledge-check",
  title: "Using AI for Repeated Staff Work Knowledge Check",
  description: "Confirms you can spot good AI tasks and write a clearer prompt.",
  questions: [
    {
      id: "q1",
      question: "What kind of work is AI most useful for in this guide?",
      options: [
        "Tasks staff repeat often",
        "One-time creative projects",
        "Decisions that need a manager's approval",
        "Anything involving money",
      ],
      answerIndex: 0,
    },
    {
      id: "q2",
      question: "Which of these is a good task to start with?",
      options: [
        "Approving budgets",
        "Hiring decisions",
        "Drafting emails",
        "Signing contracts",
      ],
      answerIndex: 2,
    },
    {
      id: "q3",
      question: "After AI produces a result, what should a person still do?",
      options: [
        "Publish it right away",
        "Check the facts, tone, and final wording",
        "Delete the original notes",
        "Skip review to save time",
      ],
      answerIndex: 1,
    },
    {
      id: "q4",
      question: "What does a good prompt tell the AI?",
      options: [
        "Only the topic",
        "Your personal opinion of the task",
        "What the task is, who it is for, what information to use, and the format you want back",
        "Nothing, because AI figures it out on its own",
      ],
      answerIndex: 2,
    },
    {
      id: "q5",
      question: "According to the guide, a good prompt should also:",
      options: [
        "Tell the AI what not to add",
        "Require at least 500 words",
        "Include several unrelated tasks at once",
        "Leave out the rough notes",
      ],
      answerIndex: 0,
    },
  ],
};

/** All knowledge-check quizzes, keyed implicitly by id. Future courses add
 *  their quizzes here; the Quizzes page is data-driven off this registry. */
export const quizzes: Quiz[] = [morpheusQuiz, aiStaffWorkQuiz];

/** Look up a quiz by id (e.g. a course's `quizId`). */
export function getQuiz(id?: string): Quiz | undefined {
  if (!id) return undefined;
  return quizzes.find((q) => q.id === id);
}

/** Convenience: a course's quiz, if it links one. */
export function getQuizForCourse(course: { quizId?: string }): Quiz | undefined {
  return getQuiz(course.quizId);
}
