import { useState } from "react";
import { BuilderIcon, LockIcon } from "../components/icons";
import PasscodeGate from "../creator/PasscodeGate";
import { useCreatorUnlock } from "../creator/useCreatorUnlock";
import NewGuideDraft from "../creator/NewGuideDraft";
import UpdateExistingGuide from "../creator/update/UpdateExistingGuide";

type CreatorTab = "new" | "update";

export default function CreatorToolsPage() {
  return (
    <PasscodeGate>
      <CreatorTools />
    </PasscodeGate>
  );
}

function CreatorTools() {
  const { lock } = useCreatorUnlock();
  const [tab, setTab] = useState<CreatorTab>("new");

  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-accent dark:bg-accent/15">
            <BuilderIcon className="h-4 w-4" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Creator Tools
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight dark:text-slate-100">
            Creator Tools
          </h1>
          <button
            type="button"
            onClick={lock}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <LockIcon className="h-3.5 w-3.5" />
            Lock creator tools
          </button>
        </div>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          Creator tools are for drafting and submitting guide changes. Nothing
          here edits the live guide library directly.
        </p>
      </header>

      {/* Outer tabs */}
      <div className="mt-6 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-800/50">
        <TabButton active={tab === "new"} onClick={() => setTab("new")}>
          New Guide
        </TabButton>
        <TabButton active={tab === "update"} onClick={() => setTab("update")}>
          Update Existing Guide
        </TabButton>
      </div>

      <div className="mt-5">
        {tab === "new" ? <NewGuideDraft /> : <UpdateExistingGuide />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${
        active
          ? "bg-accent text-white shadow-sm"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}
