import { SettingsIcon } from "../components/icons";
import {
  useSettings,
  type TextSize,
  type Theme,
} from "../hooks/useSettings";

export default function SettingsPage() {
  const { settings, update } = useSettings();

  return (
    <div className="mx-auto max-w-2xl">
      <header>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-accent dark:bg-accent/15">
            <SettingsIcon className="h-4 w-4" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Display
          </p>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight dark:text-slate-100">
          Settings
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          Display and accessibility preferences. These are saved on this device
          only and apply across the guide.
        </p>
      </header>

      <div className="mt-7 space-y-4">
        <Row
          title="Text size"
          description="Increase the base text size for easier reading."
        >
          <Segmented<TextSize>
            value={settings.textSize}
            onChange={(v) => update({ textSize: v })}
            options={[
              { value: "default", label: "Default" },
              { value: "large", label: "Large" },
            ]}
          />
        </Row>

        <Row
          title="Theme"
          description="Light, dark, or follow your system setting."
        >
          <Segmented<Theme>
            value={settings.theme}
            onChange={(v) => update({ theme: v })}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />
        </Row>

        <Row
          title="Reduced motion"
          description="Minimize transitions and animations."
        >
          <Toggle
            checked={settings.reducedMotion}
            onChange={(v) => update({ reducedMotion: v })}
            label="Reduced motion"
          />
        </Row>

        <Row
          title="High contrast"
          description="Strengthen text contrast and focus outlines."
        >
          <Toggle
            checked={settings.highContrast}
            onChange={(v) => update({ highContrast: v })}
            label="High contrast"
          />
        </Row>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-slate-400">
        These are local display controls — not account settings. Dark mode
        themes the app shell and reading surfaces; lesson content is kept on
        light reading cards for legibility.
      </p>
    </div>
  );
}

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-900">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-white text-accent shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-accent" : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
