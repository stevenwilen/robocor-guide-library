import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import { CloseIcon, MenuIcon } from "./icons";

// App shell: fixed light sidebar on desktop, a top bar + slide-in drawer on
// mobile/tablet. The content canvas scrolls independently.

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-clip lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/logo-light.png"
            alt=""
            className="h-7 w-7 object-contain dark:hidden"
          />
          <img
            src="/images/logo-dark.png"
            alt=""
            className="hidden h-7 w-7 object-contain dark:block"
          />
          <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
            Robocor
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Open navigation"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%] shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close navigation"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Content canvas */}
      <main className="min-w-0 flex-1 lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-12 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
