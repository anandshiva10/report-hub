import type { SortingState } from "@tanstack/react-table";
import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { Pagination } from "../components/Pagination";
import { ReportTable } from "../components/ReportTable";
import { EmptyState, ErrorState } from "../components/StateViews";
import { isReportType, reportConfigs } from "../config/reportConfig";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useReportData } from "../hooks/useReports";
import { titleCase } from "../utils/formatters";

export function ReportDetailPage() {
  const { reportType } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!isReportType(reportType)) {
    return <Navigate to="/not-found" replace />;
  }

  const config = reportConfigs[reportType];
  const page = Number(searchParams.get("page") ?? "0");
  const size = Number(searchParams.get("size") ?? "10");
  const status = searchParams.get("status") ?? "";
  const sortParam = searchParams.get("sort") ?? "";
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebouncedValue(search);

  const sorting = useMemo<SortingState>(() => {
    if (!sortParam) {
      return [];
    }
    const [id, direction] = sortParam.split(",");
    return [{ id, desc: direction === "desc" }];
  }, [sortParam]);

  const query = useReportData(reportType, {
    page,
    size,
    search: debouncedSearch,
    status,
    sort: sortParam
  });

  useEffect(() => {
    updateParams({ search: debouncedSearch, page: "0" });
  }, [debouncedSearch]);

  function updateParams(updates: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });
    setSearchParams(next, { replace: true });
  }

  return (
    <main className="min-h-screen bg-surface">
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Reports
          </Link>
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-ink">{config.title}</h1>
              <p className="mt-2 text-muted">{config.description}</p>
            </div>
            {query.data ? (
              <p className="text-sm font-medium text-muted">{query.data.totalElements} records</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative w-full lg:max-w-md">
            <span className="sr-only">Search report rows</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={config.searchPlaceholder}
              className="w-full rounded-md border border-line bg-white py-2.5 pl-10 pr-4 text-ink outline-none ring-brand/20 transition focus:border-brand focus:ring-4"
            />
          </label>
          {config.statusOptions ? (
            <select
              value={status}
              onChange={(event) => updateParams({ status: event.target.value, page: "0" })}
              className="rounded-md border border-line bg-white px-3 py-2.5 text-ink"
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {config.statusOptions.map((option) => (
                <option key={option} value={option}>
                  {titleCase(option)}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        {query.isError ? (
          <ErrorState title={`Unable to load ${config.title.toLowerCase()}`} message="Something went wrong while retrieving report data." onRetry={() => void query.refetch()} />
        ) : null}
        {!query.isError && !query.isLoading && query.data?.content.length === 0 ? (
          <EmptyState title={`No ${config.title.toLowerCase()} found`} message="Try adjusting your search or filters." />
        ) : null}
        {!query.isError && (query.isLoading || (query.data && query.data.content.length > 0)) ? (
          <div className="overflow-hidden rounded-lg shadow-sm">
            <ReportTable
              columns={config.columns}
              data={query.data?.content ?? []}
              loading={query.isLoading}
              sorting={sorting}
              onSortingChange={(nextSorting) => {
                const resolved = typeof nextSorting === "function" ? nextSorting(sorting) : nextSorting;
                const first = resolved[0];
                updateParams({ sort: first ? `${first.id},${first.desc ? "desc" : "asc"}` : "", page: "0" });
              }}
            />
            {query.data ? (
              <Pagination
                page={query.data.page}
                size={query.data.size}
                totalElements={query.data.totalElements}
                totalPages={query.data.totalPages}
                onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
                onSizeChange={(nextSize) => updateParams({ size: String(nextSize), page: "0" })}
              />
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
