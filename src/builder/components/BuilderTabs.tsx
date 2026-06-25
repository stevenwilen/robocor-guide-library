export type BuilderTab = "basics" | "lessons" | "review";

const TABS: { id: BuilderTab; label: string }[] = [
  { id: "basics", label: "Guide Basics" },
  { id: "lessons", label: "Sections and Blocks" },
  { id: "review", label: "Review and Submit" },
];

export default function BuilderTabs({
  active,
  onChange,
}: {
  active: BuilderTab;
  onChange: (tab: BuilderTab) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-800/50">
      {TABS.map((tab, i) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? "step" : undefined}
            className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${
              isActive
                ? "bg-accent text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <span className="mr-1.5 text-[11px] opacity-70">{i + 1}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
