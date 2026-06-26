import { useState } from "react";
import { BuilderIcon, LockIcon } from "../components/icons";
import { useCreatorUnlock } from "./useCreatorUnlock";

// 4-digit passcode screen shown before Creator Tools. This is a lightweight
// gate to keep learners out, NOT secure authentication.
export default function PasscodeGate({ children }: { children: React.ReactNode }) {
  const { unlocked, tryUnlock } = useCreatorUnlock();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (tryUnlock(code)) {
      setError(false);
      setCode("");
    } else {
      setError(true);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-800/50">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-accent dark:bg-accent/15">
            <BuilderIcon className="h-4 w-4" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Creator Tools
          </p>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight dark:text-slate-100">
          Enter creator passcode
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Creator tools are for drafting and submitting guide changes. Enter the
          4-digit passcode to continue. This is a lightweight gate, not a secure
          login.
        </p>

        <form onSubmit={submit} className="mt-5">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
              setError(false);
            }}
            placeholder="••••"
            aria-label="Creator passcode"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
              error
                ? "border-red-300 focus:ring-red-300/40"
                : "border-slate-300 focus:border-accent focus:ring-accent/30 dark:border-slate-600"
            }`}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">
              That passcode did not match. Try again.
            </p>
          )}
          <button
            type="submit"
            disabled={code.length < 4}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            <LockIcon className="h-4 w-4" />
            Unlock creator tools
          </button>
        </form>
      </div>
    </div>
  );
}
