import { ArrowRight, BarChart3, Building2, FolderKanban, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReportMetadata } from "../types/report";
import { formatDateTime } from "../utils/formatters";

const icons = {
  users: Users,
  departments: Building2,
  projects: FolderKanban
};

export function ReportCard({ report }: { report: ReportMetadata }) {
  const Icon = icons[report.id] ?? BarChart3;

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-brand">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">{report.recordCount} records</span>
      </div>
      <h2 className="mt-6 text-xl font-semibold text-ink">{report.name}</h2>
      <p className="mt-2 min-h-12 text-sm leading-6 text-muted">{report.description}</p>
      <p className="mt-5 text-xs text-muted">Updated {formatDateTime(report.lastUpdated)}</p>
      <Link to={`/reports/${report.id}`} className="mt-5 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-brand">
        View Report
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
