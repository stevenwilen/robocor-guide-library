import { NavLink } from "react-router-dom";
import { courses } from "../data/courses";
import { CourseIcon, LibraryIcon } from "./icons";

// Calm dark technical sidebar that ties into the course hero. Honest navigation
// only — links route to pages that exist. No admin/users/reports placeholders.

type SidebarProps = {
  onNavigate?: () => void;
};

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-accent/15 text-white ring-1 ring-inset ring-accent/25 shadow-[0_0_16px_-9px_rgba(59,130,246,0.4)]"
      : "text-slate-200 hover:bg-white/[0.07] hover:text-white",
  ].join(" ");
}

function ActiveBar({ isActive }: { isActive: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent-soft transition-opacity ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="relative flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-[#0c1322] via-[#111a2b] to-[#0f1828] text-slate-200">
      <div className="relative flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-[15px] font-bold text-white shadow-[0_2px_8px_-3px_rgba(37,99,235,0.35)] ring-1 ring-inset ring-white/10">
            R
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold tracking-wide text-white">
              ROBOCOR
            </div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-slate-300">
              Guide Library
            </div>
          </div>
        </div>

        <div className="mx-5 mb-1 border-t border-white/10" />

        <nav className="space-y-1 px-3 py-3">
          <NavLink to="/" end onClick={onNavigate} className={navClass}>
            {({ isActive }) => (
              <>
                <ActiveBar isActive={isActive} />
                <LibraryIcon
                  className={`h-[18px] w-[18px] ${isActive ? "text-accent-soft" : "text-slate-300 group-hover:text-white"}`}
                />
                Library
              </>
            )}
          </NavLink>

          <div className="px-3 pb-1.5 pt-6 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Courses
          </div>

          {courses.map((course) => (
            <NavLink
              key={course.id}
              to={`/course/${course.id}`}
              onClick={onNavigate}
              className={navClass}
            >
              {({ isActive }) => (
                <>
                  <ActiveBar isActive={isActive} />
                  <CourseIcon
                    className={`h-[18px] w-[18px] ${isActive ? "text-accent-soft" : "text-slate-300 group-hover:text-white"}`}
                  />
                  <span className="truncate">{course.title}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="relative mt-auto px-5 py-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-3">
          <p className="text-[11px] font-semibold text-slate-100">
            Progress saves locally
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
            Your completion is kept on this device only.
          </p>
        </div>
      </div>
    </div>
  );
}
