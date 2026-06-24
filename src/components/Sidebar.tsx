import { Link, useLocation } from "react-router-dom";
import { courses } from "../data/courses";
import {
  CertificateIcon,
  CourseIcon,
  DashboardIcon,
  QuizIcon,
  SettingsIcon,
} from "./icons";

// Clean light LMS-style shell. Honest navigation only — every item routes to a
// page that exists. No Users / Enrollments / Reports, no backend implied.

type SidebarProps = { onNavigate?: () => void };

type NavItem = {
  to: string;
  label: string;
  icon: (p: { className?: string }) => JSX.Element;
  isActive: (pathname: string) => boolean;
};

const NAV: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: DashboardIcon,
    isActive: (p) => p === "/",
  },
  {
    to: "/courses",
    label: "Courses",
    icon: CourseIcon,
    // Also active while browsing a course or lesson.
    isActive: (p) => p.startsWith("/courses") || p.startsWith("/course"),
  },
  {
    to: "/quizzes",
    label: "Quizzes",
    icon: QuizIcon,
    isActive: (p) => p.startsWith("/quizzes"),
  },
  {
    to: "/certificates",
    label: "Certificates",
    icon: CertificateIcon,
    isActive: (p) => p.startsWith("/certificates"),
  },
  {
    to: "/settings",
    label: "Settings",
    icon: SettingsIcon,
    isActive: (p) => p.startsWith("/settings"),
  },
];

// Honest, derived stats — never fabricated.
const activeCourseCount = courses.length;
const pendingLessonCount = courses
  .flatMap((c) => c.lessons)
  .filter((l) => l.contentStatus === "pending").length;

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <img
          src="/images/logo-light.png"
          alt=""
          className="h-9 w-9 object-contain dark:hidden"
        />
        <img
          src="/images/logo-dark.png"
          alt=""
          className="hidden h-9 w-9 object-contain dark:block"
        />
        <div className="leading-tight">
          <div className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
            Robocor
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Guide Library
          </div>
        </div>
      </div>

      <div className="mx-5 mb-1 border-t border-slate-100 dark:border-slate-800" />

      <nav className="flex-1 space-y-1 px-3 py-3">
        {NAV.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-accent dark:bg-accent/15 dark:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent transition-opacity ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
              <Icon
                className={`h-[18px] w-[18px] ${active ? "text-accent dark:text-accent-soft" : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300"}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Honest stats — derived from course data, not fabricated. */}
      <div className="px-4 pb-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Library status
          </p>
          <dl className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <dt className="text-slate-500 dark:text-slate-400">
                Active courses
              </dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">
                {activeCourseCount}
              </dd>
            </div>
            <div className="flex items-center justify-between text-xs">
              <dt className="text-slate-500 dark:text-slate-400">
                Pending lessons
              </dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">
                {pendingLessonCount}
              </dd>
            </div>
          </dl>
          <p className="mt-2.5 border-t border-slate-200 pt-2 text-[10.5px] leading-relaxed text-slate-400 dark:border-slate-700">
            Progress is saved on this device only.
          </p>
        </div>
      </div>
    </div>
  );
}
