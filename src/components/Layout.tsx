import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import { CloseIcon, MenuIcon } from "./icons";

// App shell: fixed dark sidebar on desktop, a top bar + slide-in drawer on
// mobile/tablet. The light content canvas scrolls independently.

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-ink-950 px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white text-sm font-bold">
            R
          </div>
          <span className="text-sm font-semibold tracking-wide">
            ROBOCOR Guide Library
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
          aria-label="Open navigation"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%] shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Close navigation"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Content canvas */}
      <main className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-12 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
