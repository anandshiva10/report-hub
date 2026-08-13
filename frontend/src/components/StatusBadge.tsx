import { titleCase } from "../utils/formatters";

const styles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  INACTIVE: "bg-slate-100 text-slate-700 ring-slate-200",
  SUSPENDED: "bg-red-50 text-red-800 ring-red-200",
  PLANNED: "bg-sky-50 text-sky-800 ring-sky-200",
  ON_HOLD: "bg-amber-50 text-amber-800 ring-amber-200",
  COMPLETED: "bg-teal-50 text-teal-800 ring-teal-200",
  CANCELLED: "bg-zinc-100 text-zinc-700 ring-zinc-200"
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ${styles[value] ?? styles.INACTIVE}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {titleCase(value)}
    </span>
  );
}
