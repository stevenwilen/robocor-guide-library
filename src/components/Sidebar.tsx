import { NavLink } from "react-router-dom";
import { courses } from "../data/courses";
import { CourseIcon, LibraryIcon } from "./icons";

// Calm dark sidebar. Honest navigation only — links route to pages that exist
// (the library and each real course). No admin/users/reports placeholders.

type SidebarProps = {
  onNavigate?: () => void;
};

const linkBase =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-ink-900 text-slate-300">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-white font-bold">
          R
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide text-white">
            ROBOCORE
          </div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Guide Library
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-ink-700 text-white"
                : "text-slate-300 hover:bg-ink-800 hover:text-white"
            }`
          }
        >
          <LibraryIcon className="h-[18px] w-[18px]" />
          Library
        </NavLink>

        <div className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Courses
        </div>

        {courses.map((course) => (
          <NavLink
            key={course.id}
            to={`/course/${course.id}`}
            onClick={onNavigate}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-ink-700 text-white"
                  : "text-slate-300 hover:bg-ink-800 hover:text-white"
              }`
            }
          >
            <CourseIcon className="h-[18px] w-[18px]" />
            <span className="truncate">{course.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 text-[11px] leading-relaxed text-slate-600">
        Progress is saved on this device only.
      </div>
    </div>
  );
}
