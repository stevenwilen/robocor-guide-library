import { CheckCircleIcon, ClockIcon } from "./icons";

// Two distinct meanings, never conflated:
//   completed -> user progress (from localStorage)
//   pending   -> content status (lesson not finalized yet)
type Kind = "completed" | "available" | "pending";

const styles: Record<Kind, string> = {
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  available: "bg-blue-50 text-accent ring-accent/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

const labels: Record<Kind, string> = {
  completed: "Completed",
  available: "Available",
  pending: "Pending",
};

export default function StatusBadge({
  kind,
  label,
}: {
  kind: Kind;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${styles[kind]}`}
    >
      {kind === "completed" && <CheckCircleIcon className="h-3.5 w-3.5" />}
      {kind === "pending" && <ClockIcon className="h-3.5 w-3.5" />}
      {kind === "available" && (
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      )}
      {label ?? labels[kind]}
    </span>
  );
}
