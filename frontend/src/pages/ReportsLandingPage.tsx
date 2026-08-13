import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ReportCard } from "../components/ReportCard";
import { EmptyState, ErrorState, LoadingCards } from "../components/StateViews";
import { useReports } from "../hooks/useReports";

export function ReportsLandingPage() {
  const [search, setSearch] = useState("");
  const { data: reports = [], isLoading, isError, refetch } = useReports();

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return reports;
    }
    return reports.filter((report) =>
      [report.name, report.description].some((value) => value.toLowerCase().includes(term))
    );
  }, [reports, search]);

  return (
    <main className="min-h-screen bg-surface">
      <section className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Reporting Portal</p>
            <h1 className="mt-3 max-w-80 text-2xl font-semibold text-ink sm:max-w-2xl sm:text-4xl">Operational reports in one place</h1>
            <p className="mt-3 max-w-80 text-base leading-7 text-muted sm:max-w-2xl">
              Browse organizational reports, locate the dataset you need, and inspect details in interactive tables.
            </p>
          </div>
          <label className="relative block w-full max-w-80 sm:max-w-xl">
            <span className="sr-only">Search reports</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reports"
              className="w-full rounded-md border border-line bg-white py-3 pl-10 pr-4 text-ink outline-none ring-brand/20 transition focus:border-brand focus:ring-4"
            />
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted">Showing {filteredReports.length} reports</p>
          {search ? (
            <button type="button" onClick={() => setSearch("")} className="text-sm font-medium text-brand hover:text-ink">
              Clear search
            </button>
          ) : null}
        </div>

        {isLoading ? <LoadingCards /> : null}
        {isError ? (
          <ErrorState title="Unable to load reports" message="Something went wrong while retrieving report metadata." onRetry={() => void refetch()} />
        ) : null}
        {!isLoading && !isError && filteredReports.length === 0 ? (
          <EmptyState title="No reports found" message={`We could not find any reports matching "${search}".`} />
        ) : null}
        {!isLoading && !isError && filteredReports.length > 0 ? (
          <div className="grid max-w-80 gap-4 md:max-w-none md:grid-cols-2 xl:grid-cols-3">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
